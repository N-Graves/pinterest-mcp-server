/**
 * Live check against a real Pinterest account, over real MCP stdio.
 *
 *   PINTEREST_CREDENTIALS_FILE=~/.pinterest-mcp-credentials node scripts/live-check.mjs
 *   ... node scripts/live-check.mjs --write          # also the write round-trip
 *
 * Read-only by default. With --write it creates a SECRET board (visible only
 * to the account owner), pins to it every way the server can — a public URL,
 * a local image, a local carousel, a local video — reads each back, then
 * deletes the pins and the board and checks the account is back where it
 * started. Everything it creates carries the same timestamped board name, so
 * a run interrupted halfway is easy to find and remove by hand.
 *
 * Needs `npm run build` first. The video step needs ffmpeg; the images are
 * generated here, so nothing personal is uploaded.
 */
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

const WRITE = process.argv.includes("--write");
const IMAGE_URL = process.env.LIVE_IMAGE_URL; // optional: a public image for the URL pin
const cwd = new URL("..", import.meta.url).pathname;

// ─── fixtures ───────────────────────────────────────────────────────────────

/** A plain RGB PNG, built by hand so the check needs no image library. */
function png(width, height, [r, g, b]) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf) => {
    let c = 0xffffffff;
    for (const x of buf) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x++) {
    // A diagonal band, so the image is not a flat colour Pinterest might reject.
    const on = (x % 200) < 100;
    row[1 + x * 3] = on ? r : 255 - r;
    row[2 + x * 3] = on ? g : 255 - g;
    row[3 + x * 3] = on ? b : 255 - b;
  }
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ─── MCP session ────────────────────────────────────────────────────────────

function session(extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };
  delete env.FLEET_BOARD_URL;
  delete env.OPENCLAW_MCP_AGENT_ID;
  const child = spawn("node", ["dist/index.js"], { cwd, env, stdio: ["pipe", "pipe", "pipe"] });
  const s = { stderr: "" };
  child.stderr.on("data", (d) => (s.stderr += d.toString()));
  const pending = new Map();
  let buf = "";
  child.stdout.on("data", (chunk) => {
    buf += chunk.toString();
    let nl;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const msg = JSON.parse(line);
        pending.get(msg.id)?.(msg);
        pending.delete(msg.id);
      } catch { /* ignore */ }
    }
  });
  let id = 1;
  const send = (method, params, timeoutMs = 60_000) =>
    new Promise((resolve, reject) => {
      const n = id++;
      pending.set(n, resolve);
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: n, method, params }) + "\n");
      setTimeout(() => reject(new Error(`${method} timed out`)), timeoutMs);
    });
  s.init = () => send("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "live", version: "0" } });
  /** Call a tool; returns parsed JSON (or text), throws on isError. */
  s.call = async (name, args = {}, timeoutMs) => {
    const r = await send("tools/call", { name, arguments: args }, timeoutMs);
    const text = r.result?.content?.[0]?.text ?? JSON.stringify(r.error);
    if (r.result?.isError || r.error) throw new Error(`${name}: ${text}`);
    try { return JSON.parse(text); } catch { return text; }
  };
  s.close = () => child.kill();
  return s;
}

// ─── checks ─────────────────────────────────────────────────────────────────

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? `  — ${detail}` : ""}`);
};
const attempt = async (name, fn) => {
  try {
    const detail = await fn();
    check(name, true, typeof detail === "string" ? detail : "");
  } catch (e) {
    check(name, false, e.message.slice(0, 300));
  }
};

/** Every pin id on the account, following bookmarks — one page can come back short. */
async function allPinIds(s) {
  const ids = [];
  let bookmark;
  for (let page = 0; page < 40; page++) {
    const p = await s.call("pinterest_list_pins", { page_size: 250, ...(bookmark ? { bookmark } : {}) });
    ids.push(...p.items.map((x) => x.id));
    bookmark = p.bookmark;
    if (!bookmark) return ids;
  }
  throw new Error("more than 40 pages of pins; not counting further");
}

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const end = iso(new Date(today.getTime() - 86_400_000));
const start = iso(new Date(today.getTime() - 28 * 86_400_000));

const uploadDir = mkdtempSync(join(tmpdir(), "pinterest-live-"));
const s = session(WRITE ? { PINTEREST_UPLOAD_DIR: uploadDir } : {});
let boardsBefore, pinsBefore, boardId;
const created = [];

try {
  await s.init();
  console.log(s.stderr.trim().split("\n").filter((l) => /Auth:|ready/.test(l)).join("\n") + "\n");

  await attempt("get_me returns the business account", async () => {
    const me = await s.call("pinterest_get_me");
    if (!me.username) throw new Error("no username");
    return `${me.username} (${me.account_type})`;
  });

  await attempt("list_boards", async () => {
    const b = await s.call("pinterest_list_boards", { page_size: 100 });
    boardsBefore = b.items.length;
    return `${boardsBefore} boards`;
  });

  let aPin;
  await attempt("list_pins, following every page", async () => {
    const ids = await allPinIds(s);
    pinsBefore = ids.length;
    aPin = ids[0];
    return `${ids.length} pins`;
  });

  await attempt("search_my_pins", async () => {
    const r = await s.call("pinterest_search_my_pins", { query: "pet" });
    return `${r.items?.length ?? 0} results for "pet"`;
  });

  await attempt("pin analytics with the default metrics", async () => {
    if (!aPin) throw new Error("no pin to measure");
    const a = await s.call("pinterest_get_pin_analytics", { pin_id: aPin, start_date: start, end_date: end });
    return Object.keys(a).join(",") || "empty";
  });

  await attempt("account analytics summary", async () => {
    const a = await s.call("pinterest_get_account_analytics", { start_date: start, end_date: end });
    return Object.keys(a).join(",");
  });

  await attempt("account top pins", async () => {
    const a = await s.call("pinterest_get_account_analytics", {
      start_date: start, end_date: end, view: "top_pins", num_of_pins: 5,
    });
    return `${a.pins?.length ?? 0} top pins`;
  });

  await attempt("a read through pinterest_call", async () => {
    const r = await s.call("pinterest_call", { operation_id: "ad_accounts/list" });
    return `${r.items?.length ?? 0} ad accounts`;
  });

  if (WRITE) {
    console.log("\n— write round-trip on a SECRET board —");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const name = `pinterest-mcp live check ${stamp}`;

    writeFileSync(join(uploadDir, "one.png"), png(600, 900, [40, 120, 200]));
    writeFileSync(join(uploadDir, "two.png"), png(600, 900, [200, 80, 40]));

    await attempt("create a secret board", async () => {
      const b = await s.call("pinterest_call", {
        operation_id: "boards/create",
        body: { name, privacy: "SECRET", description: "Temporary. Created and deleted by an automated check." },
      });
      boardId = b.id;
      if (b.privacy !== "SECRET") throw new Error(`privacy is ${b.privacy}`);
      return boardId;
    });
    if (!boardId) throw new Error("no board; stopping before any pin is made");

    const pin = async (label, args, timeoutMs) =>
      attempt(label, async () => {
        const p = await s.call(args.video_path ? "pinterest_create_video_pin" : "pinterest_create_pin",
          { board_id: boardId, title: `${label} (${stamp})`, ...args }, timeoutMs);
        if (p.status === "processing") throw new Error(`video still processing, media ${p.media_id}`);
        created.push(p.id);
        const back = await s.call("pinterest_call", { operation_id: "pins/get", params: { pin_id: p.id } });
        if (back.board_id !== boardId) throw new Error("read back on the wrong board");
        return `${p.id}${back.media?.media_type ? ` (${back.media.media_type})` : ""}`;
      });

    if (IMAGE_URL) await pin("pin from a public URL", { image_url: IMAGE_URL });
    else check("pin from a public URL", false, "set LIVE_IMAGE_URL to a public image to run this");
    await pin("pin from a local PNG", { image_path: "one.png", alt_text: "Test pattern" });
    await pin("carousel of two local images", { images: ["one.png", "two.png"] });

    try {
      execFileSync("ffmpeg", [
        "-v", "error", "-f", "lavfi", "-i", "testsrc=size=720x1280:rate=30", "-t", "5",
        "-pix_fmt", "yuv420p", "-c:v", "libx264", "-movflags", "+faststart", join(uploadDir, "clip.mp4"),
      ]);
      await pin("video pin from a local MP4", { video_path: "clip.mp4", wait_seconds: 240 }, 600_000);
    } catch (e) {
      check("video pin from a local MP4", false, `ffmpeg unavailable: ${e.message}`);
    }

    await attempt("a local file outside the upload folder is refused", async () => {
      try {
        await s.call("pinterest_create_pin", { board_id: boardId, image_path: "/etc/hostname" });
      } catch (e) {
        if (/outside the upload folder|not a PNG/.test(e.message)) return "refused";
        throw e;
      }
      throw new Error("it was accepted");
    });
  }
} finally {
  if (WRITE) {
    console.log("\n— cleanup —");
    for (const id of created) {
      await attempt(`delete pin ${id}`, () =>
        s.call("pinterest_call", { operation_id: "pins/delete", params: { pin_id: id } }).then(() => "gone"));
    }
    if (boardId) {
      await attempt("delete the secret board", () =>
        s.call("pinterest_call", { operation_id: "boards/delete", params: { board_id: boardId } }).then(() => "gone"));
      await attempt("board count is back where it started", async () => {
        const b = await s.call("pinterest_list_boards", { page_size: 100 });
        if (b.items.length !== boardsBefore) throw new Error(`${b.items.length} boards, expected ${boardsBefore}`);
        if (b.items.some((x) => x.id === boardId)) throw new Error("the test board is still listed");
        return `${b.items.length} boards`;
      });
      await attempt("pin count is back where it started", async () => {
        const ids = await allPinIds(s);
        if (ids.some((id) => created.includes(id))) throw new Error("a test pin is still listed");
        if (ids.length !== pinsBefore) throw new Error(`${ids.length} pins, expected ${pinsBefore}`);
        return `${ids.length} pins`;
      });
    }
  }
  s.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} live checks passed`);
if (failed.length) process.exit(1);
