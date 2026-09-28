/**
 * Local files as pin media, and the video upload flow.
 *
 * ── Local files are opt-in, and confined ──────────────────────────────────
 * Pinterest accepts images as base64 (`image_base64`, `multiple_image_base64`)
 * and videos through a registered upload, so a local file genuinely can become
 * a pin. 1.0.0's README said it could not; that was wrong.
 *
 * But a tool that reads a path and publishes the bytes is an exfiltration
 * route: "make a pin from ~/.ssh/id_rsa" is one prompt injection away. So:
 *
 *   - nothing is read unless PINTEREST_UPLOAD_DIR is set;
 *   - the folder and the file are both resolved with realpath, so a symlink
 *     inside the folder cannot point out of it;
 *   - the type is decided by the file's first bytes, not its name — a key
 *     renamed to .png is refused;
 *   - sizes are capped.
 *
 * ── Video ──────────────────────────────────────────────────────────────────
 * Register the upload, POST the file to the storage URL Pinterest returns,
 * wait for processing, then create the pin. The storage URL is a presigned
 * S3 form: the Pinterest bearer token is never sent there.
 */

import { openAsBlob } from "node:fs";
import { open, readFile, realpath, stat } from "node:fs/promises";
import { basename, isAbsolute, join, relative } from "node:path";
import { ToolError, type HttpClient } from "@nasdigitaluk/mcp-server-core";

export const IMAGE_MAX_BYTES = 20 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 2 * 1024 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 10 * 60_000;

export type ImageType = "image/png" | "image/jpeg";

export interface LocalFile {
  path: string;
  size: number;
  contentType: ImageType | "video";
}

/** Decide a file's type from its first bytes. */
export function sniff(head: Uint8Array): ImageType | "video" | undefined {
  const b = head;
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) {
    return "image/png";
  }
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  // ISO base media (MP4, MOV, M4V): a box size, then "ftyp".
  if (b.length >= 8 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    return "video";
  }
  return undefined;
}

/**
 * Resolve a caller-supplied path inside the upload folder, or refuse.
 *
 * Messages name the caller's own input, never the resolved absolute path, so
 * a refusal cannot be used to map the filesystem.
 */
export async function resolveLocal(
  uploadDir: string | undefined,
  requested: string,
  kind: "image" | "video",
): Promise<LocalFile> {
  if (!uploadDir) {
    throw new ToolError(
      "Local files are switched off. Set PINTEREST_UPLOAD_DIR to the one folder this " +
        "server may read media from, or pass a public URL instead.",
    );
  }

  let dir: string;
  try {
    dir = await realpath(uploadDir);
  } catch {
    throw new ToolError("PINTEREST_UPLOAD_DIR does not exist or cannot be read.");
  }

  let file: string;
  try {
    file = await realpath(isAbsolute(requested) ? requested : join(dir, requested));
  } catch {
    throw new ToolError(`"${requested}" was not found in the upload folder.`);
  }

  const rel = relative(dir, file);
  if (!rel || rel.startsWith("..") || isAbsolute(rel)) {
    throw new ToolError(`"${requested}" is outside the upload folder, so it will not be read.`);
  }

  const st = await stat(file);
  if (!st.isFile()) throw new ToolError(`"${requested}" is not a regular file.`);

  const cap = kind === "image" ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES;
  if (st.size > cap) {
    throw new ToolError(
      `"${requested}" is ${st.size} bytes; the limit for a ${kind} is ${cap} bytes.`,
    );
  }
  if (st.size === 0) throw new ToolError(`"${requested}" is empty.`);

  const fh = await open(file, "r");
  const head = new Uint8Array(16);
  try {
    await fh.read(head, 0, 16, 0);
  } finally {
    await fh.close();
  }
  const type = sniff(head);

  if (kind === "image" && type !== "image/png" && type !== "image/jpeg") {
    throw new ToolError(
      `"${requested}" is not a PNG or JPEG (judged by its contents, not its name). ` +
        "Those are the only image types Pinterest accepts.",
    );
  }
  if (kind === "video" && type !== "video") {
    throw new ToolError(`"${requested}" is not an MP4 or MOV video (judged by its contents).`);
  }

  return { path: file, size: st.size, contentType: type! };
}

export async function imageBase64(
  uploadDir: string | undefined,
  requested: string,
): Promise<{ content_type: ImageType; data: string }> {
  const f = await resolveLocal(uploadDir, requested, "image");
  return {
    content_type: f.contentType as ImageType,
    data: (await readFile(f.path)).toString("base64"),
  };
}

const isUrl = (s: string) => /^https?:\/\//i.test(s);

/**
 * The media_source for an image pin: one URL, one local file, or a 2–5 image
 * carousel of either — but not a mix, since Pinterest's carousel is one or
 * the other and fetching a URL here to convert it would make this server a
 * proxy for arbitrary requests.
 */
export async function imageMediaSource(
  uploadDir: string | undefined,
  input: { image_url?: string; image_path?: string; images?: string[] },
): Promise<Record<string, unknown>> {
  const given = [input.image_url, input.image_path, input.images].filter((v) => v !== undefined);
  if (given.length !== 1) {
    throw new ToolError("Give exactly one of image_url, image_path or images.");
  }

  if (input.image_url) return { source_type: "image_url", url: input.image_url };
  if (input.image_path) {
    return { source_type: "image_base64", ...(await imageBase64(uploadDir, input.image_path)) };
  }

  const images = input.images!;
  if (images.length < 2 || images.length > 5) {
    throw new ToolError("A carousel takes between 2 and 5 images.");
  }
  const urls = images.filter(isUrl);
  if (urls.length === images.length) {
    return { source_type: "multiple_image_urls", items: images.map((url) => ({ url })) };
  }
  if (urls.length > 0) {
    throw new ToolError("A carousel must be all public URLs or all local files, not a mix.");
  }
  const items = [];
  for (const p of images) items.push(await imageBase64(uploadDir, p));
  return { source_type: "multiple_image_base64", items };
}

// ─── video ──────────────────────────────────────────────────────────────────

export interface VideoDeps {
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
}

interface Registration {
  media_id?: string;
  upload_url?: string;
  upload_parameters?: Record<string, string>;
}

/** Register the upload and send the file to the storage URL Pinterest returns. */
export async function uploadVideo(
  http: HttpClient,
  uploadDir: string | undefined,
  videoPath: string,
  deps: VideoDeps = {},
): Promise<string> {
  const file = await resolveLocal(uploadDir, videoPath, "video");
  const reg = await http.post<Registration>("/media", { media_type: "video" });
  if (!reg?.media_id || !reg.upload_url) {
    throw new ToolError("Pinterest did not return an upload location for the video.");
  }

  let target: URL;
  try {
    target = new URL(reg.upload_url);
  } catch {
    throw new ToolError("Pinterest returned an upload location that is not a URL.");
  }
  if (target.protocol !== "https:") {
    throw new ToolError("Refusing to upload the video over an unencrypted connection.");
  }

  const form = new FormData();
  for (const [k, v] of Object.entries(reg.upload_parameters ?? {})) form.append(k, String(v));
  // Streamed from disk rather than read into memory: videos can be 2 GB.
  form.append("file", await openAsBlob(file.path), basename(file.path));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  let res: Response;
  try {
    // Deliberately no Authorization header: the form's own signature is the
    // credential, and a Pinterest token has no business going to S3.
    res = await (deps.fetchImpl ?? globalThis.fetch)(target.toString(), {
      method: "POST",
      body: form,
      signal: controller.signal,
    });
  } catch {
    throw new ToolError("The video upload did not complete. Try again.");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    throw new ToolError(`The video upload was refused (HTTP ${res.status}).`);
  }
  return reg.media_id;
}

/**
 * Wait until Pinterest has processed an upload. Returns "succeeded", or
 * "processing" if the budget ran out first — the caller can resume with the
 * media id rather than uploading again.
 */
export async function waitForMedia(
  http: HttpClient,
  mediaId: string,
  budgetMs: number,
  deps: VideoDeps = {},
): Promise<"succeeded" | "processing"> {
  const sleep = deps.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));
  const now = deps.now ?? Date.now;
  const deadline = now() + budgetMs;
  let delay = 2_000;

  for (;;) {
    const m = await http.get<{ status?: string }>(`/media/${encodeURIComponent(mediaId)}`);
    if (m?.status === "succeeded") return "succeeded";
    if (m?.status === "failed") {
      throw new ToolError(
        `Pinterest could not process video ${mediaId}. Check it is 4 seconds to 15 minutes ` +
          "long and an MP4 or MOV, then upload it again.",
      );
    }
    if (now() + delay > deadline) return "processing";
    await sleep(delay);
    delay = Math.min(delay * 2, 10_000);
  }
}
