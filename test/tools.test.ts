import { describe, it, expect } from "vitest";
import { HttpClient, HttpError, ToolError } from "@nasdigitaluk/mcp-server-core";
import { buildTools, DEFAULT_PIN_METRICS } from "../src/tools.js";
import { explainPinterestError } from "../src/errors.js";
import { DEFAULT_SCOPES, authorizeUrl, parseArgs, sameState, summary } from "../src/consent.js";
import { KEYS } from "../src/auth.js";

function client(status = 200, body: unknown = {}) {
  const calls: { url: string; method: string; body?: string }[] = [];
  const http = new HttpClient({
    baseUrl: "https://api.pinterest.com/v5",
    fetchImpl: (async (url: string, opts: RequestInit = {}) => {
      calls.push({ url, method: opts.method ?? "GET", body: opts.body as string | undefined });
      return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
    }) as unknown as typeof fetch,
  });
  return { http, calls };
}

const tool = (http: HttpClient, name: string) => buildTools(http).find((t) => t.name === name)!;
const run = (http: HttpClient, name: string, args: unknown) => {
  const t = tool(http, name);
  return t.handler(t.input.parse(args));
};

describe("the advertised surface", () => {
  it("is ten tools", () => {
    expect(buildTools(client().http).map((t) => t.name).sort()).toEqual([
      "pinterest_call",
      "pinterest_create_pin",
      "pinterest_create_video_pin",
      "pinterest_get_account_analytics",
      "pinterest_get_me",
      "pinterest_get_pin_analytics",
      "pinterest_list_boards",
      "pinterest_list_operations",
      "pinterest_list_pins",
      "pinterest_search_my_pins",
    ]);
  });

  it("says when local files are switched off, so a model reaches for a URL instead", () => {
    const off = buildTools(client().http).find((t) => t.name === "pinterest_create_pin")!;
    const on = buildTools(client().http, undefined, { uploadDir: "/x" }).find((t) => t.name === "pinterest_create_pin")!;
    expect(off.description).toMatch(/switched off/);
    expect(on.description).not.toMatch(/switched off/);
  });
});

describe("creating image pins", () => {
  it("takes exactly one of image_url, image_path or images", () => {
    const t = tool(client().http, "pinterest_create_pin");
    expect(t.input.safeParse({ board_id: "b" }).success).toBe(false);
    expect(t.input.safeParse({ board_id: "b", image_url: "https://x.test/a.png", image_path: "a.png" }).success).toBe(false);
    expect(t.input.safeParse({ board_id: "b", image_path: "a.png" }).success).toBe(true);
  });

  it("refuses a carousel entry that is a non-http URL", async () => {
    await expect(
      run(client().http, "pinterest_create_pin", { board_id: "b", images: ["https://x.test/a.png", "file:///etc/passwd"] }),
    ).rejects.toThrow(/not a usable public URL/);
  });

  it("refuses a local path when no upload folder is configured", async () => {
    const { http, calls } = client();
    await expect(run(http, "pinterest_create_pin", { board_id: "b", image_path: "a.png" })).rejects.toThrow(
      /PINTEREST_UPLOAD_DIR/,
    );
    expect(calls).toHaveLength(0);
  });
});

describe("analytics", () => {
  it("sends the metric_types Pinterest requires on pin analytics even when omitted", async () => {
    // 1.0.0 left this optional and Pinterest 400'd the obvious call.
    const { http, calls } = client();
    await run(http, "pinterest_get_pin_analytics", { pin_id: "p1", start_date: "2026-09-01", end_date: "2026-09-27" });
    expect(new URL(calls[0]!.url).searchParams.get("metric_types")).toBe(DEFAULT_PIN_METRICS);
  });

  it("rejects a date that is not YYYY-MM-DD before calling Pinterest", () => {
    const t = tool(client().http, "pinterest_get_pin_analytics");
    expect(t.input.safeParse({ pin_id: "p", start_date: "01/09/2026", end_date: "2026-09-27" }).success).toBe(false);
  });

  it("reads the account summary", async () => {
    const { http, calls } = client();
    await run(http, "pinterest_get_account_analytics", { start_date: "2026-09-01", end_date: "2026-09-27" });
    expect(new URL(calls[0]!.url).pathname).toBe("/v5/user_account/analytics");
  });

  it("reads top pins with the sort Pinterest requires", async () => {
    const { http, calls } = client();
    await run(http, "pinterest_get_account_analytics", {
      start_date: "2026-09-01",
      end_date: "2026-09-27",
      view: "top_pins",
      num_of_pins: 5,
    });
    const u = new URL(calls[0]!.url);
    expect(u.pathname).toBe("/v5/user_account/analytics/top_pins");
    expect(u.searchParams.get("sort_by")).toBe("IMPRESSION");
    expect(u.searchParams.get("num_of_pins")).toBe("5");
  });

  it("refuses top-view options on the summary rather than silently dropping them", async () => {
    await expect(
      run(client().http, "pinterest_get_account_analytics", {
        start_date: "2026-09-01",
        end_date: "2026-09-27",
        sort_by: "SAVE",
      }),
    ).rejects.toThrow(/only apply/);
  });
});

describe("Pinterest's own explanation", () => {
  const missingScope = JSON.stringify({
    code: 3,
    message: "Your token does not have sufficient permissions. Missing: ['boards:write']",
  });

  it("reaches the caller, because 'rejected the credentials' sends you to the wrong fix", async () => {
    const { http } = client(401, JSON.parse(missingScope));
    const err = await run(http, "pinterest_get_me", {}).catch((e) => e as Error);
    expect(err).toBeInstanceOf(ToolError);
    expect(err.message).toMatch(/HTTP 401/);
    expect(err.message).toContain("Missing: ['boards:write']");
  });

  it("is passed through the dispatcher too", async () => {
    const { http } = client(401, JSON.parse(missingScope));
    const err = await run(http, "pinterest_call", { operation_id: "user_account/get" }).catch((e) => e as Error);
    expect(err.message).toContain("boards:write");
  });

  it("carries only the message field, capped, with credentials redacted", () => {
    const body = JSON.stringify({
      code: 1,
      message: "bad token pina_" + "A".repeat(60) + " " + "x".repeat(400),
      echoed_request: "SHOULD-NOT-APPEAR",
    });
    const out = explainPinterestError(new HttpError("The provider rejected the request as malformed. (HTTP 400)", 400, body)) as Error;
    expect(out.message).toContain("[redacted]");
    expect(out.message).not.toContain("AAAAAAAAAA");
    expect(out.message).not.toContain("SHOULD-NOT-APPEAR");
    expect(out.message.length).toBeLessThan(420);
  });

  it("leaves an error alone when the body is not Pinterest's shape", () => {
    const e = new HttpError("x", 500, "<html>gateway</html>");
    expect(explainPinterestError(e)).toBe(e);
  });
});

describe("the consent helper", () => {
  it("defaults to organic read and write, including secret boards, and never ads:write", () => {
    const a = parseArgs([]);
    expect(a.port).toBe(3034);
    expect(a.scopes).toEqual(DEFAULT_SCOPES);
    expect(a.scopes).toContain("pins:write_secret");
    expect(a.scopes).not.toContain("ads:write");
  });

  it("takes --port and adds scopes without duplicating", () => {
    const a = parseArgs(["--port=4000", "--add-scopes", "ads:read,pins:read"]);
    expect(a.port).toBe(4000);
    expect(a.scopes.filter((s) => s === "pins:read")).toHaveLength(1);
    expect(a.scopes).toContain("ads:read");
  });

  it("refuses unknown options and impossible ports", () => {
    expect(() => parseArgs(["--prot", "1"])).toThrow(/Unknown option/);
    expect(() => parseArgs(["--port", "70000"])).toThrow(/Invalid --port/);
    expect(() => parseArgs(["--scopes"])).toThrow(/needs a value/);
  });

  it("builds the consent link with the redirect, scopes and state encoded", () => {
    const u = new URL(authorizeUrl("1600301", "http://localhost:3034/oauth/redirect", ["a:b", "c:d"], "st"));
    expect(u.origin + u.pathname).toBe("https://www.pinterest.com/oauth/");
    expect(u.searchParams.get("client_id")).toBe("1600301");
    expect(u.searchParams.get("redirect_uri")).toBe("http://localhost:3034/oauth/redirect");
    expect(u.searchParams.get("scope")).toBe("a:b,c:d");
    expect(u.searchParams.get("state")).toBe("st");
  });

  it("accepts only its own state", () => {
    expect(sameState("abc", "abc")).toBe(true);
    expect(sameState("abc", "abd")).toBe(false);
    expect(sameState("abc", "abcd")).toBe(false);
    // A truncated state must not match: a prefix comparison would accept it.
    expect(sameState("abc", "ab")).toBe(false);
    expect(sameState("abc", "")).toBe(false);
    expect(sameState("abc", null)).toBe(false);
  });

  it("summarises without ever printing a token", () => {
    const now = Date.UTC(2026, 8, 28);
    const lines = summary(
      {
        [KEYS.access]: "ACCESS-SECRET",
        [KEYS.refresh]: "REFRESH-SECRET",
        [KEYS.expires]: String(now + 30 * 86_400_000),
        [KEYS.refreshExpires]: String(now + 60 * 86_400_000),
        [KEYS.scope]: "boards:read",
      },
      now,
    ).join("\n");
    expect(lines).not.toContain("SECRET");
    expect(lines).toMatch(/continuous/);
    expect(lines).toMatch(/60 days/);
  });
});
