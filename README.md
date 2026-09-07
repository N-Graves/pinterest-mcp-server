# pinterest-mcp-server

A [Model Context Protocol](https://modelcontextprotocol.io) server for the **Pinterest API v5**.

**263 of Pinterest's 266 published operations** are reachable. The three that are not are the OAuth token endpoints, excluded for a security reason rather than an access one. A test compares the catalogue against Pinterest's own OpenAPI spec, so when Pinterest ships an endpoint the build goes red.

MIT licensed.

## Install

```bash
npm install -g @nasdigitaluk/pinterest-mcp
```

```json
{
  "mcpServers": {
    "pinterest": {
      "command": "pinterest-mcp",
      "env": {
        "PINTEREST_ACCESS_TOKEN": "your-oauth2-token",
        "PINTEREST_AD_ACCOUNT_ID": "549755885175"
      }
    }
  }
}
```

## Configuration

| Variable | |
|---|---|
| `PINTEREST_ACCESS_TOKEN` | **Required.** An OAuth2 access token for your app. |
| `PINTEREST_AD_ACCOUNT_ID` | Optional. 148 operations are scoped to an ad account; set this and it is filled in when omitted. |
| `PINTEREST_BASE_URL` | Defaults to `https://api.pinterest.com/v5`. Point at `https://api-sandbox.pinterest.com/v5` for the sandbox. |
| `MCP_READ_ONLY=1` | Refuse anything that changes state. |
| `MCP_NO_DESTRUCTIVE=1` | Allow writes, refuse anything irreversible or chargeable — see below. |

## Why the ads suite is covered, not excluded

Most of Pinterest's API is advertising: campaigns, ad groups, ads, audiences, billing, conversions, targeting. It is tempting to exclude the lot as "needs special access".

That would be **wrong**. Unlike an admin API key on a self-hosted Forem — which an ordinary account genuinely cannot obtain — a Pinterest ad account is something any business account can create. Excluding those endpoints would deny the API to people who can perfectly well use it, and dress a shortcut up as a safety measure.

So all 148 are covered. What they need is an ad account, which is a fact about your Pinterest setup rather than a limitation of this server.

## What is excluded, and why

Three operations: `POST /oauth/token`, `POST /oauth/token/revoke`, `POST /oauth/conversion_token`.

Authentication belongs to the server, not to the caller. Exposing these as tools would let a model **mint itself fresh credentials or revoke the ones the server is running on** — which is not a feature. Obtain a token out of band and set `PINTEREST_ACCESS_TOKEN`.

This is enforced, not just documented: asking `pinterest_call` for the token operation returns that reason.

## ⚠️ Ads spend money

`destructive` here means **irreversible or chargeable**, not "deletes something".

A campaign created in `ACTIVE` status starts spending against its budget immediately. The same call with `PAUSED` spends nothing, and no static rule can tell them apart — so the conservative reading wins: anything that creates or changes an advertising entity, plus billing and order lines, is classified destructive.

**`MCP_NO_DESTRUCTIVE=1` therefore means "will not touch my ad budget".** Ad *reporting* stays a read, so analysis still works under it — there are 30+ ad-account GET endpoints and every one is available read-only.

Of 266 operations: **138 read, 91 write, 37 destructive**.

## Tools

Eight tools for 263 operations. Every tool description is paid for in context on every turn, so the common path gets purpose-built tools and the rest goes through one dispatcher.

| Tool | |
|---|---|
| `pinterest_list_operations` | Browse the catalogue. Start here — try `search: "campaign"` or `"catalog"`. |
| `pinterest_call` | Call any operation by id. |
| `pinterest_get_me` | The authenticated account. |
| `pinterest_list_boards` | Your boards. |
| `pinterest_list_pins` | Your pins. |
| `pinterest_create_pin` | Create a pin. |
| `pinterest_get_pin_analytics` | How a pin performed. |
| `pinterest_search_my_pins` | Search your own pins. |

**Pin images must be publicly reachable URLs.** Pinterest fetches them server-side, so a local file path cannot work — and the schema refuses `file://`, `javascript:` and URLs with embedded credentials rather than letting it fail confusingly at the provider.

## Refreshing the catalogue

Pinterest publishes YAML, so it is converted on the way in:

```bash
curl -sL https://raw.githubusercontent.com/pinterest/api-description/main/v5/openapi.yaml \
  | python3 -c 'import sys,yaml,json,datetime; json.dump(yaml.safe_load(sys.stdin), open("vendor/pinterest-openapi.json","w"), default=lambda o: o.isoformat())'
npm run generate && npm test
```

## Testing

```bash
npm test                                       # 14 tests
PINTEREST_ACCESS_TOKEN=x npm run smoke         # real MCP over stdio
```

## Built on

[`@nasdigitaluk/mcp-server-core`](https://github.com/N-Graves/mcp-server-core).

## Licence

MIT.
