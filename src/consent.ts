/**
 * The pure parts of the consent flow: arguments, the consent link, the state
 * check and the summary. Kept apart from auth-cli.ts so they can be tested
 * without starting a listener.
 */

import { timingSafeEqual } from "node:crypto";
import { KEYS } from "./auth.js";

/**
 * Enough to read and publish organic content, including on secret boards.
 * No ads:write: an active campaign spends money the moment it exists.
 */
export const DEFAULT_SCOPES = [
  "boards:read",
  "boards:write",
  "boards:read_secret",
  "boards:write_secret",
  "pins:read",
  "pins:write",
  "pins:read_secret",
  "pins:write_secret",
  "user_accounts:read",
];

const DAY_MS = 24 * 3600_000;

export interface CliArgs {
  port: number;
  scopes: string[];
  help: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  let port = 3034;
  let scopes = [...DEFAULT_SCOPES];
  let help = false;
  const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    const eq = arg.indexOf("=");
    const flag = eq === -1 ? arg : arg.slice(0, eq);
    const take = () => {
      if (eq !== -1) return arg.slice(eq + 1);
      const v = argv[i + 1];
      if (v === undefined || v.startsWith("--")) throw new Error(`${flag} needs a value`);
      i++;
      return v;
    };
    if (flag === "--port") port = Number(take());
    else if (flag === "--scopes") scopes = list(take());
    else if (flag === "--add-scopes") scopes = [...new Set([...scopes, ...list(take())])];
    else if (flag === "--help" || flag === "-h") help = true;
    else throw new Error(`Unknown option ${flag}`);
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Invalid --port ${port}`);
  if (scopes.length === 0) throw new Error("--scopes cannot be empty");
  return { port, scopes, help };
}

export function authorizeUrl(appId: string, redirectUri: string, scopes: string[], state: string) {
  const u = new URL("https://www.pinterest.com/oauth/");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", appId);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("scope", scopes.join(","));
  u.searchParams.set("state", state);
  return u.toString();
}

/** Constant time, so a forged redirect learns nothing from how fast it fails. */
export function sameState(expected: string, got: string | null): boolean {
  if (!got) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** What to tell the person: everything except the secrets. */
export function summary(fields: Record<string, string>, now: number): string[] {
  const when = (key: string) => {
    const ms = Number(fields[key] ?? 0);
    return ms > 0
      ? `${new Date(ms).toISOString().slice(0, 10)} (${Math.round((ms - now) / DAY_MS)} days)`
      : "not reported";
  };
  const refreshMs = Number(fields[KEYS.refreshExpires] ?? 0);
  const kind = !fields[KEYS.refresh]
    ? "none returned — this token cannot refresh"
    : refreshMs > 0 && refreshMs - now < 100 * DAY_MS
      ? "continuous (renews on every refresh)"
      : refreshMs > 0
        ? "legacy long-lived (switch the app to continuous refresh)"
        : "returned, expiry not reported";
  return [
    `scopes:         ${fields[KEYS.scope] ?? "not reported"}`,
    `access token:   expires ${when(KEYS.expires)}`,
    `refresh token:  ${kind}; expires ${when(KEYS.refreshExpires)}`,
  ];
}
