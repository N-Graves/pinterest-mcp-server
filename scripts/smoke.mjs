/**
 * End-to-end proof, over real MCP stdio, that the built server stands up on
 * somebody else's machine.
 *
 *   npm run smoke
 *
 * FLEET_BOARD_URL and OPENCLAW_MCP_AGENT_ID are explicitly cleared: in the
 * server this replaced, every write tool called a private task board and
 * FAILED CLOSED when it was not there.
 *
 * The credentials are deliberately fake: every assertion is about the server's
 * own behaviour, so nothing here touches Pinterest or needs an account. The
 * live check against a real account is scripts/live-check.mjs.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const cwd = new URL("..", import.meta.url).pathname;

function session(extraEnv) {
  const env = { ...process.env, ...extraEnv };
  for (const k of [
    "FLEET_BOARD_URL",
    "OPENCLAW_MCP_AGENT_ID",
    "PINTEREST_UPLOAD_DIR",
    "PINTEREST_ACCESS_TOKEN",
    "PINTEREST_CREDENTIALS_FILE",
  ]) {
    if (!(k in extraEnv)) delete env[k];
  }
  const child = spawn("node", ["dist/index.js"], { cwd, env, stdio: ["pipe", "pipe", "pipe"] });
  const s = { stderr: "", leftover: "" };
  child.stderr.on("data", (d) => (s.stderr += d.toString()));
  const pending = new Map();
  child.stdout.on("data", (chunk) => {
    s.leftover += chunk.toString();
    let nl;
    while ((nl = s.leftover.indexOf("\n")) !== -1) {
      const line = s.leftover.slice(0, nl).trim();
      s.leftover = s.leftover.slice(nl + 1);
      if (!line) continue;
      try {
        const msg = JSON.parse(line);
        const resolve = pending.get(msg.id);
        if (resolve) { pending.delete(msg.id); resolve(msg); }
      } catch { /* not a protocol line */ }
    }
  });
  let nextId = 1;
  s.send = (method, params) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, resolve);
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
      setTimeout(() => reject(new Error(`${method} timed out`)), 10_000);
    });
  s.init = () =>
    s.send("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "smoke", version: "0" },
    });
  s.close = () => child.kill();
  return s;
}

const checks = [];
const check = (name, ok, detail = "") => {
  checks.push({ name, ok });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail && !ok ? `\n    ${detail}` : ""}`);
};

let stderr = "";
const a = session({ PINTEREST_ACCESS_TOKEN: "smoke-token" });
try {
  const init = await a.init();
  check("initializes with no fleet board reachable", Boolean(init.result?.serverInfo));
  check("reports version " + pkg.version, init.result?.serverInfo?.version === pkg.version);

  const tools = (await a.send("tools/list", {})).result?.tools ?? [];
  check("advertises ten tools", tools.length === 10, `got ${tools.length}`);

  const withAgentId = tools.filter(
    (t) => JSON.stringify(t.inputSchema).includes("agent_id") || /agent_id/.test(t.description ?? ""),
  );
  check("no tool asks for agent_id", withAgentId.length === 0, withAgentId.map((t) => t.name).join(", "));

  const leaky = tools.filter((t) =>
    /fleet board|with_nate|nas_digital|misaki|\bjoel\b|HERALD|ECHO|LEDGER|NEXUS|ORACLE|FORGE/i.test(
      `${t.name} ${t.description} ${JSON.stringify(t.inputSchema)}`,
    ),
  );
  check("no private vocabulary in the advertised surface", leaky.length === 0, leaky.map((t) => t.name).join(", "));

  const ops = await a.send("tools/call", { name: "pinterest_list_operations", arguments: {} });
  check("the catalogue is readable", !ops.result?.isError && (ops.result?.content?.[0]?.text ?? "").includes("route"));

  const unknown = await a.send("tools/call", {
    name: "pinterest_call",
    arguments: { operation_id: "definitelyNotAnOperation" },
  });
  check(
    "an unknown operation is refused, not attempted",
    unknown.result?.isError === true && /no operation/i.test(unknown.result.content[0].text),
  );

  const local = await a.send("tools/call", {
    name: "pinterest_create_pin",
    arguments: { board_id: "b", image_path: "/etc/passwd" },
  });
  check(
    "a local path is refused when no upload folder is configured",
    local.result?.isError === true && /switched off/.test(local.result.content[0].text),
    local.result?.content?.[0]?.text,
  );

  check("static mode says it will not refresh", /does not refresh/.test(a.stderr), a.stderr);
  check("nothing was written to stdout that is not protocol", !a.leftover.trim());
} finally {
  stderr += a.stderr;
  a.close();
}

// Refreshing mode: a credentials file holding a still-valid token.
const dir = mkdtempSync(join(tmpdir(), "pin-smoke-"));
const creds = join(dir, "creds");
writeFileSync(
  creds,
  `PINTEREST_APP_ID=1\nPINTEREST_APP_SECRET=s\nPINTEREST_ACCESS_TOKEN=smoke\n` +
    `PINTEREST_REFRESH_TOKEN=r\nPINTEREST_TOKEN_EXPIRES_AT=${Date.now() + 86_400_000}\n`,
  { mode: 0o600 },
);
const b = session({ PINTEREST_CREDENTIALS_FILE: creds, PINTEREST_UPLOAD_DIR: dir });
try {
  const init = await b.init();
  check("initializes from a credentials file", Boolean(init.result?.serverInfo));
  await b.send("tools/list", {});
  check("refreshing mode is reported", /refreshing automatically/.test(b.stderr), b.stderr);
  check("the upload folder is reported as enabled", /Local files: enabled/.test(b.stderr), b.stderr);
} finally {
  stderr += b.stderr;
  b.close();
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed  (${pkg.name})`);
if (failed.length) {
  console.log("\nserver stderr:\n" + stderr.split("\n").slice(0, 20).join("\n"));
  process.exit(1);
}
