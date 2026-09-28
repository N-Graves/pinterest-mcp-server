/**
 * Pinterest authentication, including the refresh that keeps a server alive
 * past its first month.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * 1.0.0 took a static PINTEREST_ACCESS_TOKEN and nothing else. Pinterest
 * access tokens last 30 days, so every install of that version stopped working
 * a month after it was set up, with a 401 the caller could do nothing about.
 *
 * ── The hazard the refresh is built around ─────────────────────────────────
 * Pinterest refresh tokens are now "continuous": each lasts 60 days, and every
 * refresh returns a NEW one with a fresh 60-day window. That makes them
 * rotating credentials, with the same failure mode as X's:
 *
 *   - two MCP clients running at once (entirely normal) both decide to
 *     refresh, both spend the stored refresh token, and whichever writes
 *     second persists one Pinterest may already have superseded;
 *   - a crash between truncating and rewriting the credentials file loses the
 *     refresh token outright.
 *
 * Either way the chain is broken and the only fix is a fresh consent in a
 * browser. So the refresh runs inside TokenStore.withLock, re-reads the file
 * under the lock before deciding to refresh at all (another process may have
 * just done it), and writes the access token, the rotated refresh token and
 * both expiries in ONE atomic write.
 */

import { TokenStore, ToolError } from "@nasdigitaluk/mcp-server-core";

/** Refresh this far ahead of expiry, so a long call cannot straddle it. */
export const SKEW_MS = 5 * 60_000;
/** What Pinterest documents when a response omits expires_in. */
const DEFAULT_ACCESS_SECONDS = 30 * 24 * 3600;
const REFRESH_TIMEOUT_MS = 30_000;

export const KEYS = {
  appId: "PINTEREST_APP_ID",
  appSecret: "PINTEREST_APP_SECRET",
  access: "PINTEREST_ACCESS_TOKEN",
  refresh: "PINTEREST_REFRESH_TOKEN",
  expires: "PINTEREST_TOKEN_EXPIRES_AT",
  refreshExpires: "PINTEREST_REFRESH_TOKEN_EXPIRES_AT",
  scope: "PINTEREST_TOKEN_SCOPE",
} as const;

export interface PinterestAuth {
  mode: "static" | "refreshing";
  headers(): Promise<Record<string, string>>;
  describe(): string;
}

/** The token endpoint for whichever environment the server is pointed at. */
export function tokenUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/oauth/token`;
}

export function basicAuth(appId: string, appSecret: string): string {
  return "Basic " + Buffer.from(`${appId}:${appSecret}`).toString("base64");
}

/**
 * Pinterest's token response, turned into credentials-file entries.
 *
 * Shared by the refresh and by the consent CLI, so the two can never disagree
 * about what a stored credential looks like. Expiries are epoch milliseconds.
 */
export function tokenFields(
  data: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_token_expires_in?: number;
    refresh_token_expires_at?: number;
    scope?: string;
  },
  now: number,
): Record<string, string> {
  if (!data.access_token) {
    throw new ToolError("Pinterest returned no access token.");
  }
  const out: Record<string, string> = {
    [KEYS.access]: data.access_token,
    [KEYS.expires]: String(now + (data.expires_in ?? DEFAULT_ACCESS_SECONDS) * 1000),
  };
  if (data.refresh_token) {
    out[KEYS.refresh] = data.refresh_token;
    if (typeof data.refresh_token_expires_in === "number") {
      out[KEYS.refreshExpires] = String(now + data.refresh_token_expires_in * 1000);
    } else if (typeof data.refresh_token_expires_at === "number") {
      // Pinterest reports this one in epoch seconds.
      out[KEYS.refreshExpires] = String(data.refresh_token_expires_at * 1000);
    } else {
      // The store merges, so without this a new refresh token would inherit
      // the OLD one's expiry and could be refused as expired while valid.
      out[KEYS.refreshExpires] = "";
    }
  }
  if (data.scope) out[KEYS.scope] = data.scope;
  return out;
}

/** A token from the developer portal. No refresh, no file; dies in 30 days. */
export function staticAuth(token: string): PinterestAuth {
  return {
    mode: "static",
    headers: async () => ({ Authorization: `Bearer ${token}` }),
    describe: () =>
      "static access token (does not refresh; Pinterest expires it after 30 days — " +
      "run pinterest-mcp-auth for one that does)",
  };
}

/**
 * OAuth2 with a continuous refresh token, refreshing itself as needed.
 *
 * App id and secret come from the environment or, failing that, from the
 * credentials file itself — the consent CLI writes them there, so a single
 * 0600 file is all a working install needs.
 */
export function refreshingAuth(opts: {
  store: TokenStore;
  baseUrl: string;
  appId?: string;
  appSecret?: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
}): PinterestAuth {
  const doFetch = opts.fetchImpl ?? globalThis.fetch;
  const now = opts.now ?? Date.now;

  const stillValid = (creds: Record<string, string>) => {
    if (!creds[KEYS.access]) return false;
    const exp = Number(creds[KEYS.expires] ?? 0);
    // No recorded expiry: refresh rather than discover the token is dead
    // halfway through somebody's work.
    return exp > 0 && now() + SKEW_MS < exp;
  };

  async function refresh(): Promise<string> {
    return opts.store.withLock(async () => {
      // Re-read INSIDE the lock. Another process may have refreshed while this
      // one waited, and refreshing again would spend a token that is current.
      const creds = opts.store.read();
      if (stillValid(creds)) return creds[KEYS.access]!;

      const appId = opts.appId ?? creds[KEYS.appId];
      const appSecret = opts.appSecret ?? creds[KEYS.appSecret];
      const refreshToken = creds[KEYS.refresh];
      if (!appId || !appSecret) {
        throw new ToolError(
          "The Pinterest access token has expired and there is no app id and secret to " +
            "refresh it with. Set PINTEREST_APP_ID and PINTEREST_APP_SECRET, or run " +
            "pinterest-mcp-auth, which stores them in the credentials file.",
        );
      }
      if (!refreshToken) {
        throw new ToolError(
          "The Pinterest access token has expired and no refresh token is stored. " +
            "Run pinterest-mcp-auth to authorise again.",
        );
      }
      const refreshExpires = Number(creds[KEYS.refreshExpires] ?? 0);
      if (refreshExpires > 0 && refreshExpires <= now()) {
        // Spending it would only produce a confusing 400.
        throw new ToolError(
          "The Pinterest refresh token has expired: nothing used this server for over " +
            "60 days. Run pinterest-mcp-auth to authorise again.",
        );
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);
      let res: Response;
      try {
        res = await doFetch(tokenUrl(opts.baseUrl), {
          method: "POST",
          headers: {
            Authorization: basicAuth(appId, appSecret),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }).toString(),
          signal: controller.signal,
        });
      } catch {
        throw new ToolError("Could not reach Pinterest to refresh the access token. Try again shortly.");
      } finally {
        clearTimeout(timer);
      }

      if (!res.ok) {
        // Token-endpoint error bodies can echo the request, which carries the
        // refresh token. Report the status, never the body.
        throw new ToolError(
          `Refreshing the Pinterest access token failed (HTTP ${res.status}). ` +
            (res.status === 400 || res.status === 401
              ? "The refresh token has probably expired or been revoked; run pinterest-mcp-auth."
              : "Try again shortly."),
        );
      }

      const fields = tokenFields(
        (await res.json()) as Parameters<typeof tokenFields>[0],
        now(),
      );
      // One write: losing the rotated refresh token is what breaks the chain.
      opts.store.write(fields);
      return fields[KEYS.access]!;
    });
  }

  return {
    mode: "refreshing",
    async headers() {
      const creds = opts.store.read();
      const token = stillValid(creds) ? creds[KEYS.access]! : await refresh();
      return { Authorization: `Bearer ${token}` };
    },
    describe: () => "OAuth2 with a continuous refresh token, refreshing automatically",
  };
}
