#!/usr/bin/env node
/**
 * pinterest-mcp-server — a Model Context Protocol server for the Pinterest API v5.
 *
 * Two ways to authenticate. Pick one:
 *
 *   Refreshing (recommended — keeps working indefinitely):
 *     npx -p @nasdigitaluk/pinterest-mcp pinterest-mcp-auth   # once, in a browser
 *     PINTEREST_CREDENTIALS_FILE=~/.pinterest-mcp-credentials pinterest-mcp
 *
 *   Static (a token from the developer portal; stops working after 30 days):
 *     PINTEREST_ACCESS_TOKEN=... pinterest-mcp
 *
 * Configuration:
 *   PINTEREST_CREDENTIALS_FILE  refreshing mode. Written by pinterest-mcp-auth;
 *                               holds the tokens, their expiries, and the app
 *                               id and secret used to refresh them.
 *   PINTEREST_APP_ID /          optional overrides for the app credentials
 *   PINTEREST_APP_SECRET        stored in that file.
 *   PINTEREST_ACCESS_TOKEN      static mode.
 *   PINTEREST_AD_ACCOUNT_ID     optional. 148 of the operations are scoped to an
 *                               ad account; set this and it is filled in when
 *                               omitted.
 *   PINTEREST_UPLOAD_DIR        optional. The ONE folder local images and videos
 *                               may be read from. Unset, local files are refused.
 *   PINTEREST_BASE_URL          optional. Defaults to https://api.pinterest.com/v5
 *                               Point at https://api-sandbox.pinterest.com/v5 for
 *                               the sandbox (which needs its own token).
 *   MCP_READ_ONLY=1             refuse anything that changes state.
 *   MCP_NO_DESTRUCTIVE=1        allow writes, refuse anything irreversible or
 *                               chargeable — which here includes touching ad
 *                               campaigns, because an active one spends budget.
 *
 * ⚠️  The three /oauth/* endpoints are deliberately excluded from the tool
 *     surface. Refreshing happens inside the server; handing a caller the
 *     ability to mint or revoke the credentials it runs on is not a feature.
 */

import { HttpClient, authorizerFromEnv, runServer } from "@nasdigitaluk/mcp-server-core";
import { DEFAULT_BASE_URL, VERSION, resolveAuth } from "./config.js";
import { buildTools } from "./tools.js";
import { COVERED } from "./dispatch.js";
import { OPERATIONS } from "./generated/operations.js";

async function main() {
  const baseUrl = process.env.PINTEREST_BASE_URL || DEFAULT_BASE_URL;
  const auth = resolveAuth(process.env, baseUrl);

  const http = new HttpClient({
    baseUrl,
    headers: { "User-Agent": `pinterest-mcp-server/${VERSION}` },
    dynamicHeaders: () => auth.headers(),
    timeoutMs: 45_000,
    // Analytics and catalogue reports over a long date range are large.
    maxBytes: 32 * 1024 * 1024,
  });

  const adAccount = process.env.PINTEREST_AD_ACCOUNT_ID;
  const uploadDir = process.env.PINTEREST_UPLOAD_DIR || undefined;

  await runServer({
    name: "pinterest-mcp-server",
    version: VERSION,
    authorizer: authorizerFromEnv(),
    tools: buildTools(http, adAccount, { uploadDir }),
  });

  const chargeable = OPERATIONS.filter((o) => o.action === "destructive").length;
  console.error(
    `Pinterest API v5: ${COVERED.length} of ${OPERATIONS.length} operations reachable, ` +
      `${chargeable} irreversible or chargeable. Auth: ${auth.describe()}. ` +
      `Local files: ${uploadDir ? "enabled, confined to PINTEREST_UPLOAD_DIR" : "off"}.` +
      (adAccount ? ` Default ad account ${adAccount}.` : ""),
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
