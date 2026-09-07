#!/usr/bin/env node
/**
 * pinterest-mcp-server — a Model Context Protocol server for the Pinterest API v5.
 *
 *   PINTEREST_ACCESS_TOKEN=... npx @nasdigitaluk/pinterest-mcp
 *
 * Configuration:
 *   PINTEREST_ACCESS_TOKEN   required. An OAuth2 access token for your app.
 *   PINTEREST_AD_ACCOUNT_ID  optional. 148 of the operations are scoped to an
 *                            ad account; set this and it is filled in when
 *                            omitted.
 *   PINTEREST_BASE_URL       optional. Defaults to https://api.pinterest.com/v5
 *                            Point at https://api-sandbox.pinterest.com/v5 to
 *                            work against the sandbox.
 *   MCP_READ_ONLY=1          refuse anything that changes state.
 *   MCP_NO_DESTRUCTIVE=1     allow writes, refuse anything irreversible or
 *                            chargeable — which here includes touching ad
 *                            campaigns, because an active one spends budget.
 *
 * ⚠️  This server does NOT implement the OAuth flow, and the three /oauth/*
 *     endpoints are deliberately excluded from the catalogue. Handing a caller
 *     the ability to mint or revoke the credentials the server is running on
 *     is not a feature. Obtain a token out of band and set it here.
 */

import {
  HttpClient,
  authorizerFromEnv,
  requireEnv,
  runServer,
} from "@nasdigitaluk/mcp-server-core";
import { buildTools } from "./tools.js";
import { COVERED } from "./dispatch.js";
import { OPERATIONS } from "./generated/operations.js";

const VERSION = "1.0.0";

async function main() {
  const token = requireEnv(
    "PINTEREST_ACCESS_TOKEN",
    "Create an app at https://developers.pinterest.com and complete the OAuth flow to get one.",
  );

  const http = new HttpClient({
    baseUrl: process.env.PINTEREST_BASE_URL || "https://api.pinterest.com/v5",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": `pinterest-mcp-server/${VERSION}`,
    },
    timeoutMs: 45_000,
    // Analytics and catalogue reports over a long date range are large.
    maxBytes: 32 * 1024 * 1024,
  });

  const adAccount = process.env.PINTEREST_AD_ACCOUNT_ID;

  await runServer({
    name: "pinterest-mcp-server",
    version: VERSION,
    authorizer: authorizerFromEnv(),
    tools: buildTools(http, adAccount),
  });

  const chargeable = OPERATIONS.filter((o) => o.action === "destructive").length;
  console.error(
    `Pinterest API v5: ${COVERED.length} of ${OPERATIONS.length} operations reachable, ` +
      `${chargeable} irreversible or chargeable.` +
      (adAccount ? ` Default ad account ${adAccount}.` : ""),
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
