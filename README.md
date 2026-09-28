# pinterest-mcp-server

A [Model Context Protocol](https://modelcontextprotocol.io) server for the **Pinterest API v5**.

**263 of Pinterest's 266 published operations** are reachable. The three that are not are the OAuth token endpoints, excluded for a security reason rather than an access one. A test compares the catalogue against Pinterest's own OpenAPI spec, so when Pinterest ships an endpoint the build goes red.

It keeps itself authorised (Pinterest tokens expire after 30 days; this refreshes them), and it can pin local images, carousels and videos from one folder you choose.

MIT licensed.

## Install

```bash
npm install -g @nasdigitaluk/pinterest-mcp
```

## Authorise once

Create an app at [developers.pinterest.com/apps](https://developers.pinterest.com/apps) and add `http://localhost:3034/oauth/redirect` as a redirect URI. Then:

```bash
PINTEREST_APP_ID=your-app-id PINTEREST_APP_SECRET=your-app-secret pinterest-mcp-auth
```

Open the link it prints, sign in as the account the server should act as, and approve. It writes everything the server needs to `~/.pinterest-mcp-credentials` (mode `0600`) — the tokens, their expiry dates, and the app id and secret used to refresh them — and **prints no tokens**. It starts listening before it prints the link, so an occupied port fails at once instead of wasting the single-use code.

```json
{
  "mcpServers": {
    "pinterest": {
      "command": "pinterest-mcp",
      "env": {
        "PINTEREST_CREDENTIALS_FILE": "/home/you/.pinterest-mcp-credentials",
        "PINTEREST_UPLOAD_DIR": "/home/you/pinterest-uploads"
      }
    }
  }
}
```

`pinterest-mcp-auth --help` lists the options: `--port`, `--scopes`, `--add-scopes`. The default scopes cover reading and publishing organic content, including secret boards. They deliberately **leave out `ads:write`**: an active campaign spends money the moment it exists. Add `--add-scopes ads:read,catalogs:read` if you want ad reporting and catalogues.

### How long the tokens last

| | Lifetime | What happens |
|---|---|---|
| Access token | 30 days | Refreshed automatically five minutes before it expires. |
| Refresh token | 60 days, **renewed on every refresh** | So it never expires while the server is in use. Leave the server unused for more than 60 days and you need to run `pinterest-mcp-auth` again. |

Pinterest's refresh tokens rotate: each refresh returns a new one. Two MCP clients running at once is normal, and if both refreshed with the same stored token, one could save a token that has already been replaced — breaking the chain until somebody re-authorises by hand. So the refresh runs under a lock on the credentials file, re-reads the file inside the lock (another process may just have refreshed), and saves the new access token, the new refresh token and both expiries in **one atomic write**.

### Or a static token

`PINTEREST_ACCESS_TOKEN=...` still works, exactly as in 1.0.0 — a token generated in the developer portal. It does not refresh, so it stops working after 30 days, and the server says so when it starts.

## Configuration

| Variable | |
|---|---|
| `PINTEREST_CREDENTIALS_FILE` | The file `pinterest-mcp-auth` wrote. If unset, `~/.pinterest-mcp-credentials` is used when it exists. |
| `PINTEREST_APP_ID`, `PINTEREST_APP_SECRET` | Optional overrides for the app credentials stored in that file. |
| `PINTEREST_ACCESS_TOKEN` | A static token instead of the file. |
| `PINTEREST_UPLOAD_DIR` | Optional. The **one** folder local images and videos may be read from. Unset: local files are refused. |
| `PINTEREST_AD_ACCOUNT_ID` | Optional. 148 operations are scoped to an ad account; set this and it is filled in when omitted. |
| `PINTEREST_BASE_URL` | Defaults to `https://api.pinterest.com/v5`. Point at `https://api-sandbox.pinterest.com/v5` for the sandbox, which needs its own token. |
| `MCP_READ_ONLY=1` | Refuse anything that changes state. |
| `MCP_NO_DESTRUCTIVE=1` | Allow writes, refuse anything irreversible or chargeable — see below. |

The order is: an explicit `PINTEREST_CREDENTIALS_FILE`, then `PINTEREST_ACCESS_TOKEN`, then the default file.

## Tools

Ten tools for 263 operations. Every tool description is paid for in context on every turn, so the common path gets purpose-built tools and the rest goes through one dispatcher.

| Tool | |
|---|---|
| `pinterest_list_operations` | Browse the catalogue. Start here — try `search: "campaign"` or `"catalog"`. |
| `pinterest_call` | Call any operation by id. |
| `pinterest_get_me` | The authenticated account. |
| `pinterest_list_boards` | Your boards. |
| `pinterest_list_pins` | Your pins. |
| `pinterest_create_pin` | An image pin from a public URL, a local file, or a 2–5 image carousel. |
| `pinterest_create_video_pin` | A video pin from a local MP4 or MOV. |
| `pinterest_get_pin_analytics` | How one pin performed. |
| `pinterest_get_account_analytics` | How the account performed, or its top pins and top video pins. |
| `pinterest_search_my_pins` | Search your own pins. |

## Local images and videos

Pinterest accepts images as base64 and videos through an upload, so a local file can become a pin — as long as you have said which folder the server may read.

A tool that reads a path and publishes the contents is an exfiltration route: "make a pin from `~/.ssh/id_rsa`" is one prompt injection away. So:

- **Nothing is read unless `PINTEREST_UPLOAD_DIR` is set.**
- The folder and the file are both resolved with `realpath`, so neither `../` nor a symlink placed inside the folder can reach outside it.
- The file's type is decided by its **contents**, not its name: a key renamed `.png` is refused. Images must be PNG or JPEG (the only types Pinterest takes). Videos must be MP4 or MOV.
- Images are capped at 20 MB and videos at 2 GB.
- A refusal names your input, never the resolved path, so it cannot be used to map the filesystem.

A carousel is all URLs or all local files, not a mix: turning a URL into base64 would mean this server fetching arbitrary URLs.

**Video** is three steps, and the tool does all of them: register the upload with Pinterest, send the file (streamed, not loaded into memory) to the storage URL Pinterest returns, then wait for processing and create the pin. The storage URL is a signed upload form, so **your Pinterest token is never sent there**. If processing outlasts `wait_seconds`, you get `status: "processing"` and a `media_id`; call again with that `media_id` and it carries on without uploading twice. The cover is a URL, a local image, or a frame of the video (by default, the frame one second in). Pinterest's sandbox cannot do video.

**Pin images from a URL** must be publicly reachable: Pinterest fetches them itself. The schema refuses `file://`, `javascript:` and URLs with embedded credentials.

## Errors you can act on

Pinterest explains its refusals, and the explanation is often the only way to know what to do. A token missing a scope comes back as HTTP 401 — which a generic summary would call "rejected the credentials", sending you off to replace a token that is fine — while Pinterest's message says exactly which scope is missing:

```
The provider rejected the credentials. (HTTP 401) Pinterest says: … Missing: ['boards:write']
```

So Pinterest's `message` field is passed on, capped in length and with anything resembling a credential redacted. Nothing else from the response body is.

## Why the ads suite is covered, not excluded

Most of Pinterest's API is advertising: campaigns, ad groups, ads, audiences, billing, conversions, targeting. It is tempting to exclude the lot as "needs special access".

That would be **wrong**. Unlike an admin API key on a self-hosted Forem — which an ordinary account genuinely cannot obtain — a Pinterest ad account is something any business account can create. Excluding those endpoints would deny the API to people who can perfectly well use it, and dress a shortcut up as a safety measure.

So all 148 are covered. What they need is an ad account, which is a fact about your Pinterest setup rather than a limitation of this server.

## What is excluded, and why

Three operations: `POST /oauth/token`, `POST /oauth/token/revoke`, `POST /oauth/conversion_token`.

Authentication belongs to the server, not to the caller. The server refreshes its own token internally; exposing these endpoints as tools would let a model **mint itself fresh credentials or revoke the ones the server is running on**, which is not a feature.

This is enforced, not just documented: asking `pinterest_call` for a token operation returns that reason.

## ⚠️ Ads spend money

`destructive` here means **irreversible or chargeable**, not "deletes something".

A campaign created in `ACTIVE` status starts spending against its budget immediately. The same call with `PAUSED` spends nothing, and no static rule can tell them apart — so the conservative reading wins: anything that creates or changes an advertising entity, plus billing and order lines, is classified destructive.

**`MCP_NO_DESTRUCTIVE=1` therefore means "will not touch my ad budget".** Ad *reporting* stays a read, so analysis still works under it — there are 30+ ad-account GET endpoints and every one is available read-only.

Of 266 operations: **138 read, 91 write, 37 destructive**.

## Trial and Standard access

A new Pinterest app starts on **Trial** access. Pins and boards a Trial app creates are visible only to you, as sandbox content; publishing publicly needs **Standard** access, which you apply for from the app's page. The server behaves the same either way — what changes is who can see what you create.

## Refreshing the catalogue

Pinterest publishes YAML, so it is converted on the way in:

```bash
curl -sL https://raw.githubusercontent.com/pinterest/api-description/main/v5/openapi.yaml \
  | python3 -c 'import sys,yaml,json,datetime; json.dump(yaml.safe_load(sys.stdin), open("vendor/pinterest-openapi.json","w"), default=lambda o: o.isoformat())'
npm run generate && npm test
```

## Testing

```bash
npm test                     # unit tests, no network
npm run smoke                # real MCP over stdio, fake credentials
node scripts/live-check.mjs  # against your real account, read-only
```

`live-check.mjs --write` also does a full write round-trip: it creates a **secret** board, pins to it every way the server can (a public URL via `LIVE_IMAGE_URL`, a local image, a carousel, a video made with ffmpeg), reads each pin back, then deletes them and the board and checks your account is back where it started.

## Built on

[`@nasdigitaluk/mcp-server-core`](https://github.com/N-Graves/mcp-server-core).

## Licence

MIT.
