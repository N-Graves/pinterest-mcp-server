/**
 * Generate src/generated/operations.ts from the vendored Pinterest OpenAPI spec.
 *
 *   npm run generate
 *
 * To refresh (Pinterest publish YAML; convert it to JSON first):
 *   curl -sL https://raw.githubusercontent.com/pinterest/api-description/main/v5/openapi.yaml \
 *     | python3 -c 'import sys,yaml,json,datetime; json.dump(yaml.safe_load(sys.stdin), open("vendor/pinterest-openapi.json","w"), default=lambda o: o.isoformat() if isinstance(o,(datetime.date,datetime.datetime)) else None)'
 *   npm run generate && npm test
 *
 * ── On coverage ────────────────────────────────────────────────────────────
 * Pinterest publishes 266 operations and most of them are advertising. It is
 * tempting to exclude the whole ads suite as "needs special access", and that
 * would be WRONG: unlike an admin API key on a self-hosted Forem, a Pinterest
 * ad account is something any business account can create. Excluding them
 * would deny the API to people who can genuinely use it.
 *
 * So everything is covered except the three OAuth endpoints, which are
 * excluded for a security reason rather than an access one - see below.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { buildCatalogue, renderCatalogue, reportBuild } from "@nasdigital/mcp-server-core/generate";

const ROOT = new URL("..", import.meta.url).pathname;
const spec = JSON.parse(readFileSync(join(ROOT, "vendor/pinterest-openapi.json"), "utf8"));

const exclusions = [
  {
    label: "oauth token endpoints",
    /**
     * The server owns authentication. Exposing /oauth/token and
     * /oauth/token/revoke as tools would let a model mint itself fresh
     * credentials or revoke the ones it was given - neither of which is a
     * thing a caller should be able to do to the process hosting it.
     *
     * This is the one exclusion here that is about safety rather than access.
     */
    match: (op) => op.path.startsWith("/oauth/"),
    reason:
      "Authentication is handled by the server, not by the caller. Exposing the token " +
      "endpoints would let a caller mint or revoke the credentials the server is running " +
      "on. Set PINTEREST_ACCESS_TOKEN instead.",
  },
];

/**
 * Pinterest ads spend real money.
 *
 * A campaign created in ACTIVE status starts spending against its budget
 * immediately; the same call with status PAUSED spends nothing. No static
 * classification can tell those apart, so the conservative reading wins:
 * anything that creates or changes an advertising entity is treated as
 * chargeable, and MCP_NO_DESTRUCTIVE therefore means "will not touch my ad
 * budget". Reads are unaffected, so reporting still works under it.
 */
const SPENDS_MONEY = [
  /^\/ad_accounts\/\{[^}]+\}\/(campaigns|ad_groups|ads|product_group_promotions|promotions)/,
  /^\/ad_accounts\/\{[^}]+\}\/bulk/,
  /^\/ad_accounts\/\{[^}]+\}\/(billing|order_lines)/,
];

const actionFor = (op) => {
  if (op.method === "GET") return "read";
  if (op.method === "DELETE") return "destructive";
  if (SPENDS_MONEY.some((re) => re.test(op.path))) return "destructive";
  return "write";
};

const result = buildCatalogue(spec, { exclusions, toolFor: () => "pinterest_call", actionFor });
const counts = result.operations.reduce((a, o) => ({ ...a, [o.action]: (a[o.action] ?? 0) + 1 }), {});

const header = `/**
 * GENERATED FILE - do not edit by hand.
 *
 * Produced by scripts/generate-operations.mjs from vendor/pinterest-openapi.json
 * (Pinterest REST API v${spec.info?.version ?? "5"}, OpenAPI ${spec.openapi}).
 *
 * ${result.operations.length} operations: ${result.covered} reachable, ${result.excluded} excluded.
 *
 * Most of Pinterest's API is advertising, and it is all covered - an ad
 * account is something any business account can create, so excluding it would
 * deny the API to people who can genuinely use it. What IS excluded is the
 * OAuth token endpoints, for safety rather than access.
 *
 * ${counts.read ?? 0} read, ${counts.write ?? 0} write, ${counts.destructive ?? 0} destructive, where destructive means
 * irreversible OR chargeable - an active campaign spends budget the moment it
 * exists.
 */`;

mkdirSync(join(ROOT, "src/generated"), { recursive: true });
writeFileSync(join(ROOT, "src/generated/operations.ts"), renderCatalogue(result, header), "utf8");
reportBuild(result);
console.log(`  by consequence: ${JSON.stringify(counts)}`);
