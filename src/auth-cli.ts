#!/usr/bin/env node
/**
 * pinterest-mcp-auth — authorise the server once, in a browser.
 *
 *   PINTEREST_APP_ID=... PINTEREST_APP_SECRET=... npx -p @nasdigitaluk/pinterest-mcp pinterest-mcp-auth
 *
 * Register http://localhost:3034/oauth/redirect (or your --port) as a redirect
 * URI on your app at https://developers.pinterest.com/apps first.
 *
 * What it does, and the three things it is careful about:
 *
 *  1. It starts listening BEFORE it prints the consent link. An authorisation
 *     code is single use; a helper that prints first and binds after can have
 *     the redirect land on whatever already holds the port, which spends the
 *     code on somebody else's 404 page and means doing the consent again.
 *
 *  2. It writes the tokens to the credentials file (mode 0600, atomically) and
 *     never prints them. A token printed to a terminal ends up in scrollback,
 *     logs and, when an agent drives this, transcripts.
 *
 *  3. The `state` it sends is 24 random bytes, compared in constant time, so a
 *     redirect it did not start cannot plant somebody else's code.
 *
 * The app id and secret are stored in the same file, so afterwards the file is
 * all the server needs: PINTEREST_CREDENTIALS_FILE=<file> pinterest-mcp.
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomBytes } from "node:crypto";
import { TokenStore } from "@nasdigitaluk/mcp-server-core";
import { basicAuth, KEYS, tokenFields, tokenUrl } from "./auth.js";
import { DEFAULT_BASE_URL, defaultCredentialsFile, expandHome } from "./config.js";
import { DEFAULT_SCOPES, authorizeUrl, parseArgs, sameState, summary } from "./consent.js";

const TIMEOUT_MS = 10 * 60_000;

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

async function listen(port: number, host: string, handler: Handler) {
  const server = createServer(handler);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });
  return server;
}

/**
 * Loopback only, and both address families, because browsers resolve
 * "localhost" to either. An address family this machine lacks is skipped; a
 * port already taken on either is fatal, since the redirect could land there.
 */
async function listenLoopback(port: number, handler: Handler) {
  const servers: Server[] = [];
  for (const host of ["127.0.0.1", "::1"]) {
    try {
      servers.push(await listen(port, host, handler));
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (host === "::1" && (code === "EADDRNOTAVAIL" || code === "EAFNOSUPPORT")) continue;
      for (const s of servers) s.close();
      if (code === "EADDRINUSE") {
        throw new Error(
          `Port ${port} is already in use on ${host}. Stop whatever holds it, or pass --port ` +
            `with another port registered as a redirect URI on your app.`,
        );
      }
      throw err;
    }
  }
  return servers;
}

const page = (title: string, body: string) =>
  `<!doctype html><meta charset="utf-8"><title>${title}</title>` +
  `<body style="font-family:system-ui;max-width:32rem;margin:4rem auto;line-height:1.5">` +
  `<h1>${title}</h1><p>${body}</p></body>`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(
      "pinterest-mcp-auth [--port 3034] [--scopes a,b,c] [--add-scopes a,b]\n\n" +
        "Reads PINTEREST_APP_ID and PINTEREST_APP_SECRET from the environment or the credentials\n" +
        "file, and writes tokens to PINTEREST_CREDENTIALS_FILE (default ~/.pinterest-mcp-credentials).\n" +
        `Default scopes: ${DEFAULT_SCOPES.join(",")}`,
    );
    return;
  }

  const file = expandHome(process.env.PINTEREST_CREDENTIALS_FILE ?? defaultCredentialsFile());
  const store = new TokenStore(file);
  const existing = store.read();
  const appId = process.env.PINTEREST_APP_ID || existing[KEYS.appId];
  const appSecret = process.env.PINTEREST_APP_SECRET || existing[KEYS.appSecret];
  if (!appId || !appSecret) {
    throw new Error(
      "Set PINTEREST_APP_ID and PINTEREST_APP_SECRET (from https://developers.pinterest.com/apps), " +
        "or put them in the credentials file.",
    );
  }
  if (args.scopes.includes("ads:write")) {
    console.error("Warning: ads:write lets the server create campaigns, which can spend money.");
  }

  const baseUrl = process.env.PINTEREST_BASE_URL || DEFAULT_BASE_URL;
  const redirectUri = `http://localhost:${args.port}/oauth/redirect`;
  const state = randomBytes(24).toString("hex");

  let finish!: (err?: Error) => void;
  const done = new Promise<void>((resolve, reject) => {
    finish = (err) => (err ? reject(err) : resolve());
  });
  let exchanging = false;

  const handler: Handler = (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname !== "/oauth/redirect") {
      res.writeHead(404).end();
      return;
    }
    const reply = (status: number, title: string, body: string) =>
      res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" }).end(page(title, body));

    if (!sameState(state, url.searchParams.get("state"))) {
      // Not ours. Keep waiting for the real redirect rather than giving up.
      reply(400, "Not this request", "This redirect was not started by pinterest-mcp-auth.");
      return;
    }
    if (url.searchParams.get("error")) {
      reply(200, "Not authorised", "Authorisation was declined. You can close this tab.");
      finish(new Error("Authorisation was declined in the browser."));
      return;
    }
    const code = url.searchParams.get("code");
    if (!code || exchanging) {
      reply(400, "Missing code", "Pinterest did not include an authorisation code.");
      return;
    }
    exchanging = true;

    void (async () => {
      const r = await fetch(tokenUrl(baseUrl), {
        method: "POST",
        headers: {
          Authorization: basicAuth(appId, appSecret),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          // Apps created before 25 Sep 2025 need this for a continuous
          // refresh token; newer apps get one regardless and ignore it.
          continuous_refresh: "true",
        }).toString(),
      });
      if (!r.ok) {
        // The body can echo the code and credentials. Status only.
        throw new Error(`Pinterest refused the code exchange (HTTP ${r.status}).`);
      }
      const now = Date.now();
      const fields = tokenFields((await r.json()) as Parameters<typeof tokenFields>[0], now);
      await store.withLock(async () =>
        store.write({ [KEYS.appId]: appId, [KEYS.appSecret]: appSecret, ...fields }),
      );
      reply(200, "Done", "The server is authorised. You can close this tab.");
      console.log(`\nWrote ${file}\n${summary(fields, now).map((l) => "  " + l).join("\n")}`);
      finish();
    })().catch((err: Error) => {
      reply(500, "Failed", "The token exchange failed; see the terminal.");
      finish(err);
    });
  };

  const servers = await listenLoopback(args.port, handler);
  const timer = setTimeout(
    () => finish(new Error("Timed out after 10 minutes waiting for the browser.")),
    TIMEOUT_MS,
  );

  console.log(
    `Listening on localhost:${args.port}. Open this link, sign in to the Pinterest account ` +
      `the server should act as, and approve:\n\n${authorizeUrl(appId, redirectUri, args.scopes, state)}\n`,
  );

  try {
    await done;
  } finally {
    clearTimeout(timer);
    for (const s of servers) s.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
