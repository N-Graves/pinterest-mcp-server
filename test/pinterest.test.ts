import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  HttpClient,
  checkCoverage,
  formatCoverage,
  operationsFromOpenApi,
} from "@nasdigital/mcp-server-core";
import { OPERATIONS } from "../src/generated/operations.js";
import { createDispatcher, COVERED } from "../src/dispatch.js";
import { buildTools } from "../src/tools.js";

const spec = JSON.parse(
  readFileSync(join(import.meta.dirname, "../vendor/pinterest-openapi.json"), "utf8"),
);

function client() {
  const calls: { url: string; method: string; body?: string }[] = [];
  const http = new HttpClient({
    baseUrl: "https://api.pinterest.com/v5",
    fetchImpl: (async (url: string, opts: RequestInit = {}) => {
      calls.push({ url, method: opts.method ?? "GET", body: opts.body as string | undefined });
      return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
    }) as unknown as typeof fetch,
  });
  return { http, calls };
}

const toolNamed = (http: HttpClient, name: string, ad?: string) =>
  buildTools(http, ad).find((t) => t.name === name)!;

describe("coverage", () => {
  it("accounts for every operation Pinterest publishes", () => {
    const report = checkCoverage(OPERATIONS, operationsFromOpenApi(spec));
    expect(report.ok, formatCoverage(report)).toBe(true);
  });

  it("covers the advertising suite rather than excluding it", () => {
    // An ad account is something any business account can create - unlike an
    // admin key on a self-hosted Forem. Excluding these would deny the API to
    // people who can genuinely use it.
    const ads = OPERATIONS.filter((o) => o.path.startsWith("/ad_accounts/"));
    expect(ads.length).toBeGreaterThan(100);
    expect(ads.every((o) => o.status === "covered")).toBe(true);
  });

  it("excludes only the OAuth token endpoints, and says why", () => {
    const excluded = OPERATIONS.filter((o) => o.status === "excluded");
    expect(excluded).toHaveLength(3);
    expect(excluded.every((o) => o.path.startsWith("/oauth/"))).toBe(true);
    expect(excluded.every((o) => /mint or revoke/i.test(o.reason ?? ""))).toBe(true);
  });

  it("refuses to hand a caller the token endpoints at runtime too", () => {
    // Documented in the catalogue AND enforced - a model asking for it gets
    // the reason, not a Pinterest error.
    const { http } = client();
    const tokenOp = OPERATIONS.find((o) => o.path === "/oauth/token")!;
    expect(() => createDispatcher(http).resolve(tokenOp.id)).toThrow(/mint or revoke/i);
  });
});

describe("consequence", () => {
  it("treats ad-entity changes as chargeable, not ordinary writes", () => {
    // A campaign created ACTIVE spends budget immediately; the same call with
    // status PAUSED spends nothing, and no static rule can tell them apart. So
    // the conservative reading wins and MCP_NO_DESTRUCTIVE means "will not
    // touch my ad budget".
    const campaignWrite = OPERATIONS.find(
      (o) => o.method === "POST" && /^\/ad_accounts\/\{[^}]+\}\/campaigns$/.test(o.path),
    )!;
    expect(campaignWrite.action).toBe("destructive");
  });

  it("leaves ad reporting as a read, so analysis still works under lockdown", () => {
    const reads = OPERATIONS.filter((o) => o.path.startsWith("/ad_accounts/") && o.method === "GET");
    expect(reads.length).toBeGreaterThan(30);
    expect(reads.every((o) => o.action === "read")).toBe(true);
  });

  it("treats organic pin and board edits as ordinary writes", () => {
    expect(OPERATIONS.find((o) => o.method === "POST" && o.path === "/pins")!.action).toBe("write");
    expect(OPERATIONS.find((o) => o.method === "PATCH" && o.path === "/boards/{board_id}")!.action).toBe("write");
    expect(OPERATIONS.find((o) => o.method === "DELETE" && o.path === "/pins/{pin_id}")!.action).toBe("destructive");
  });
});

describe("the default ad account", () => {
  const listCampaigns = OPERATIONS.find(
    (o) => o.method === "GET" && /^\/ad_accounts\/\{[^}]+\}\/campaigns$/.test(o.path),
  )!;

  it("fills in ad_account_id when omitted", async () => {
    const { http, calls } = client();
    await createDispatcher(http, "ad-1").call(listCampaigns.id, {});
    expect(calls[0]!.url).toContain("/ad_accounts/ad-1/campaigns");
  });

  it("lets an explicit value win", async () => {
    const { http, calls } = client();
    await createDispatcher(http, "ad-1").call(listCampaigns.id, { ad_account_id: "other" });
    expect(calls[0]!.url).toContain("/ad_accounts/other/campaigns");
  });

  it("names the env var when there is nothing to fall back on", async () => {
    const { http } = client();
    await expect(createDispatcher(http).call(listCampaigns.id, {})).rejects.toThrow(
      /PINTEREST_AD_ACCOUNT_ID/,
    );
  });
});

describe("tools", () => {
  it("builds a pin with the media_source shape Pinterest expects", async () => {
    const { http, calls } = client();
    await toolNamed(http, "pinterest_create_pin").handler({
      board_id: "b1",
      image_url: "https://x.test/a.png",
      title: "T",
    });
    const body = JSON.parse(calls[0]!.body!);
    expect(body.media_source).toEqual({ source_type: "image_url", url: "https://x.test/a.png" });
    expect(body.title).toBe("T");
    // Fields the caller never mentioned must not be sent as undefined.
    expect("description" in body).toBe(false);
  });

  it("refuses a local path for the pin image, since Pinterest fetches it server-side", () => {
    const { http } = client();
    const tool = toolNamed(http, "pinterest_create_pin");
    expect(tool.input.safeParse({ board_id: "b", image_url: "file:///a.png" }).success).toBe(false);
    expect(tool.input.safeParse({ board_id: "b", image_url: "https://x.test/a.png" }).success).toBe(true);
  });

  it("keeps the advertised surface small despite 263 reachable operations", () => {
    const { http } = client();
    expect(buildTools(http).length).toBeLessThanOrEqual(10);
  });

  it("declares pinterest_call at the strictest level it can reach", () => {
    const { http } = client();
    expect(toolNamed(http, "pinterest_call").action).toBe("destructive");
  });
});
