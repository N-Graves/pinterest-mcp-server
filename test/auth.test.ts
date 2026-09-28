import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TokenStore } from "@nasdigitaluk/mcp-server-core";
import { KEYS, SKEW_MS, refreshingAuth, staticAuth, tokenFields, tokenUrl } from "../src/auth.js";
import { resolveAuth } from "../src/config.js";

const LIVE = "https://api.pinterest.com/v5";
const SANDBOX = "https://api-sandbox.pinterest.com/v5";
const DAY = 24 * 3600_000;

let dir: string;
let file: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "pin-auth-"));
  file = join(dir, "creds");
});

function seed(values: Record<string, string>) {
  new TokenStore(file).write(values);
}

/** A token endpoint that answers after `delayMs`, recording every call. */
function tokenEndpoint(opts: { status?: number; body?: unknown; delayMs?: number } = {}) {
  const calls: { url: string; headers: Record<string, string>; body: string }[] = [];
  let n = 0;
  const fetchImpl = (async (url: string, init: RequestInit = {}) => {
    calls.push({ url, headers: init.headers as Record<string, string>, body: String(init.body) });
    n++;
    if (opts.delayMs) await new Promise((r) => setTimeout(r, opts.delayMs));
    const body = opts.body ?? {
      access_token: `new-access-${n}`,
      refresh_token: `new-refresh-${n}`,
      expires_in: 30 * 24 * 3600,
      refresh_token_expires_in: 60 * 24 * 3600,
      scope: "boards:read,pins:read",
    };
    return new Response(JSON.stringify(body), { status: opts.status ?? 200 });
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

const auth = (fetchImpl: typeof fetch, extra: { baseUrl?: string; now?: () => number } = {}) =>
  refreshingAuth({
    store: new TokenStore(file),
    baseUrl: extra.baseUrl ?? LIVE,
    appId: "app",
    appSecret: "secret",
    fetchImpl,
    now: extra.now,
  });

describe("static token", () => {
  it("sends the token it was given and never refreshes", async () => {
    const a = staticAuth("tok");
    expect(await a.headers()).toEqual({ Authorization: "Bearer tok" });
    expect(a.mode).toBe("static");
    expect(a.describe()).toMatch(/30 days/);
  });
});

describe("refreshing", () => {
  it("uses a token that is still valid without touching the network", async () => {
    seed({ [KEYS.access]: "current", [KEYS.refresh]: "r", [KEYS.expires]: String(Date.now() + DAY) });
    const t = tokenEndpoint();
    expect(await auth(t.fetchImpl).headers()).toEqual({ Authorization: "Bearer current" });
    expect(t.calls).toHaveLength(0);
  });

  it("refreshes an expired token and stores the ROTATED refresh token in the same write", async () => {
    seed({ [KEYS.access]: "old", [KEYS.refresh]: "old-refresh", [KEYS.expires]: String(Date.now() - 1) });
    const t = tokenEndpoint();
    expect(await auth(t.fetchImpl).headers()).toEqual({ Authorization: "Bearer new-access-1" });

    expect(t.calls).toHaveLength(1);
    expect(t.calls[0]!.url).toBe(`${LIVE}/oauth/token`);
    expect(t.calls[0]!.headers.Authorization).toBe("Basic " + Buffer.from("app:secret").toString("base64"));
    const form = new URLSearchParams(t.calls[0]!.body);
    expect(form.get("grant_type")).toBe("refresh_token");
    expect(form.get("refresh_token")).toBe("old-refresh");

    const stored = new TokenStore(file).read();
    expect(stored[KEYS.access]).toBe("new-access-1");
    expect(stored[KEYS.refresh]).toBe("new-refresh-1");
    expect(Number(stored[KEYS.expires])).toBeGreaterThan(Date.now() + 29 * DAY);
    expect(Number(stored[KEYS.refreshExpires])).toBeGreaterThan(Date.now() + 59 * DAY);
    expect(statSync(file).mode & 0o777).toBe(0o600);
  });

  it("spends the refresh token ONCE when two servers refresh at the same moment", async () => {
    // Two MCP clients open at once is normal. Both see an expired token; the
    // second must re-read under the lock and use the first one's result.
    seed({ [KEYS.access]: "old", [KEYS.refresh]: "old-refresh", [KEYS.expires]: "1" });
    const t = tokenEndpoint({ delayMs: 150 });
    const [a, b] = await Promise.all([auth(t.fetchImpl).headers(), auth(t.fetchImpl).headers()]);
    expect(t.calls).toHaveLength(1);
    expect(a).toEqual(b);
    expect(readdirSync(dir).sort()).toEqual(["creds"]); // no .lock or .tmp left behind
  });

  it("refreshes inside the skew window, not only after expiry", async () => {
    const now = Date.now();
    seed({ [KEYS.access]: "soon", [KEYS.refresh]: "r", [KEYS.expires]: String(now + SKEW_MS - 60_000) });
    const t = tokenEndpoint();
    await auth(t.fetchImpl, { now: () => now }).headers();
    expect(t.calls).toHaveLength(1);
  });

  it("leaves a token alone just outside the skew window", async () => {
    const now = Date.now();
    seed({ [KEYS.access]: "fine", [KEYS.refresh]: "r", [KEYS.expires]: String(now + SKEW_MS + 60_000) });
    const t = tokenEndpoint();
    await auth(t.fetchImpl, { now: () => now }).headers();
    expect(t.calls).toHaveLength(0);
  });

  it("treats an unrecorded expiry as expired", async () => {
    seed({ [KEYS.access]: "unknown-age", [KEYS.refresh]: "r" });
    const t = tokenEndpoint();
    await auth(t.fetchImpl).headers();
    expect(t.calls).toHaveLength(1);
  });

  it("refreshes against the sandbox when the server is pointed at it", async () => {
    seed({ [KEYS.access]: "old", [KEYS.refresh]: "r", [KEYS.expires]: "1" });
    const t = tokenEndpoint();
    await auth(t.fetchImpl, { baseUrl: SANDBOX }).headers();
    expect(t.calls[0]!.url).toBe(`${SANDBOX}/oauth/token`);
  });

  it("reads the app id and secret from the credentials file when not given", async () => {
    seed({
      [KEYS.appId]: "file-app",
      [KEYS.appSecret]: "file-secret",
      [KEYS.access]: "old",
      [KEYS.refresh]: "r",
      [KEYS.expires]: "1",
    });
    const t = tokenEndpoint();
    await refreshingAuth({ store: new TokenStore(file), baseUrl: LIVE, fetchImpl: t.fetchImpl }).headers();
    expect(t.calls[0]!.headers.Authorization).toBe(
      "Basic " + Buffer.from("file-app:file-secret").toString("base64"),
    );
  });

  it("keeps the stored refresh token when Pinterest does not send a new one", async () => {
    seed({ [KEYS.access]: "old", [KEYS.refresh]: "keep-me", [KEYS.expires]: "1" });
    const t = tokenEndpoint({ body: { access_token: "a2", expires_in: 100 } });
    await auth(t.fetchImpl).headers();
    expect(new TokenStore(file).read()[KEYS.refresh]).toBe("keep-me");
  });

  it("reports a failed refresh by status, never by body, and says how to recover", async () => {
    seed({ [KEYS.access]: "old", [KEYS.refresh]: "r", [KEYS.expires]: "1" });
    const t = tokenEndpoint({ status: 400, body: { message: "SECRET-ECHO refresh_token=r" } });
    const err = await auth(t.fetchImpl).headers().catch((e) => e as Error);
    expect(err.message).toMatch(/HTTP 400/);
    expect(err.message).toMatch(/pinterest-mcp-auth/);
    expect(err.message).not.toMatch(/SECRET-ECHO/);
  });

  it("does not spend a refresh token that has already expired", async () => {
    seed({
      [KEYS.access]: "old",
      [KEYS.refresh]: "stale",
      [KEYS.expires]: "1",
      [KEYS.refreshExpires]: String(Date.now() - DAY),
    });
    const t = tokenEndpoint();
    await expect(auth(t.fetchImpl).headers()).rejects.toThrow(/60 days/);
    expect(t.calls).toHaveLength(0);
  });

  it("names the fix when there is no refresh token at all", async () => {
    seed({ [KEYS.access]: "old", [KEYS.expires]: "1" });
    await expect(auth(tokenEndpoint().fetchImpl).headers()).rejects.toThrow(/pinterest-mcp-auth/);
  });
});

describe("token fields", () => {
  it("clears a stale refresh expiry when the new token does not report one", () => {
    const f = tokenFields({ access_token: "a", refresh_token: "r" }, 1000);
    expect(f[KEYS.refreshExpires]).toBe("");
  });

  it("reads refresh_token_expires_at as epoch seconds", () => {
    const f = tokenFields({ access_token: "a", refresh_token: "r", refresh_token_expires_at: 2000 }, 0);
    expect(f[KEYS.refreshExpires]).toBe("2000000");
  });

  it("refuses a response with no access token", () => {
    expect(() => tokenFields({}, 0)).toThrow(/no access token/);
  });

  it("builds the token URL for either environment", () => {
    expect(tokenUrl(`${LIVE}/`)).toBe(`${LIVE}/oauth/token`);
    expect(tokenUrl(SANDBOX)).toBe(`${SANDBOX}/oauth/token`);
  });
});

describe("choosing the credentials", () => {
  const missing = () => join(dir, "nothing-here");

  it("prefers an explicit credentials file over a static token", () => {
    const a = resolveAuth(
      { PINTEREST_CREDENTIALS_FILE: file, PINTEREST_ACCESS_TOKEN: "t" },
      LIVE,
      { defaultFile: missing() },
    );
    expect(a.mode).toBe("refreshing");
  });

  it("uses a static token when that is all there is", () => {
    expect(resolveAuth({ PINTEREST_ACCESS_TOKEN: "t" }, LIVE, { defaultFile: missing() }).mode).toBe("static");
  });

  it("falls back to the file pinterest-mcp-auth leaves at the default location", () => {
    writeFileSync(join(dir, "default"), "PINTEREST_ACCESS_TOKEN=x\n");
    expect(resolveAuth({}, LIVE, { defaultFile: join(dir, "default") }).mode).toBe("refreshing");
  });

  it("says how to get credentials when there are none", () => {
    expect(() => resolveAuth({}, LIVE, { defaultFile: missing() })).toThrow(/pinterest-mcp-auth/);
  });
});
