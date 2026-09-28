/**
 * Which credentials the server runs on. Its own module so it can be tested
 * without starting a server.
 */

import { TokenStore } from "@nasdigitaluk/mcp-server-core";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { refreshingAuth, staticAuth, type PinterestAuth } from "./auth.js";

export const VERSION = "1.1.0";
export const DEFAULT_BASE_URL = "https://api.pinterest.com/v5";

export const expandHome = (p: string) => p.replace(/^~(?=$|\/)/, homedir());
export const defaultCredentialsFile = () => join(homedir(), ".pinterest-mcp-credentials");

/**
 * An explicit credentials file wins, then an explicit static token, then a
 * credentials file left at the default location by pinterest-mcp-auth.
 */
export function resolveAuth(
  env: NodeJS.ProcessEnv,
  baseUrl: string,
  opts: { defaultFile?: string; fetchImpl?: typeof fetch } = {},
): PinterestAuth {
  const explicitFile = env.PINTEREST_CREDENTIALS_FILE;
  const token = env.PINTEREST_ACCESS_TOKEN;
  const fallback = opts.defaultFile ?? defaultCredentialsFile();

  const fromFile = (path: string) =>
    refreshingAuth({
      store: new TokenStore(expandHome(path)),
      baseUrl,
      appId: env.PINTEREST_APP_ID || undefined,
      appSecret: env.PINTEREST_APP_SECRET || undefined,
      fetchImpl: opts.fetchImpl,
    });

  if (explicitFile) return fromFile(explicitFile);
  if (token) return staticAuth(token);
  if (existsSync(fallback)) return fromFile(fallback);

  throw new Error(
    "No Pinterest credentials. Run `npx -p @nasdigitaluk/pinterest-mcp pinterest-mcp-auth` " +
      "once for a token that refreshes itself, or set PINTEREST_ACCESS_TOKEN to a token from " +
      "https://developers.pinterest.com (those stop working after 30 days).",
  );
}
