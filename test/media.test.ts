import { describe, it, expect, beforeEach } from "vitest";
import { mkdirSync, mkdtempSync, symlinkSync, truncateSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HttpClient } from "@nasdigitaluk/mcp-server-core";
import {
  IMAGE_MAX_BYTES,
  imageMediaSource,
  resolveLocal,
  sniff,
  uploadVideo,
  waitForMedia,
} from "../src/media.js";
import { buildTools } from "../src/tools.js";

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 1, 2, 3, 4]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const MP4 = Buffer.from([0, 0, 0, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 2, 0]);

let root: string;
let upload: string;
let outside: string;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "pin-media-"));
  upload = join(root, "upload");
  outside = join(root, "outside");
  mkdirSync(upload);
  mkdirSync(outside);
  writeFileSync(join(upload, "a.png"), PNG);
  writeFileSync(join(upload, "b.jpg"), JPEG);
  writeFileSync(join(upload, "clip.mp4"), MP4);
  writeFileSync(join(outside, "secret.png"), PNG);
});

describe("reading local files", () => {
  it("is off unless PINTEREST_UPLOAD_DIR is set", async () => {
    // The specific "switched off" refusal, not merely any message naming the
    // variable: without the guard, a missing folder fails with a different
    // message that ALSO names it, which is how this test once passed for the
    // wrong reason.
    await expect(resolveLocal(undefined, "a.png", "image")).rejects.toThrow(/switched off/);
  });

  it("reads a file inside the upload folder, by relative or absolute path", async () => {
    expect((await resolveLocal(upload, "a.png", "image")).contentType).toBe("image/png");
    expect((await resolveLocal(upload, join(upload, "b.jpg"), "image")).contentType).toBe("image/jpeg");
  });

  it("refuses an absolute path outside the folder", async () => {
    await expect(resolveLocal(upload, join(outside, "secret.png"), "image")).rejects.toThrow(/outside/);
  });

  it("refuses to climb out with ../", async () => {
    await expect(resolveLocal(upload, "../outside/secret.png", "image")).rejects.toThrow(/outside/);
  });

  it("refuses a symlink inside the folder that points out of it", async () => {
    symlinkSync(join(outside, "secret.png"), join(upload, "innocent.png"));
    await expect(resolveLocal(upload, "innocent.png", "image")).rejects.toThrow(/outside/);
  });

  it("judges the type by content, so a key renamed .png is refused", async () => {
    writeFileSync(join(upload, "id_rsa.png"), "-----BEGIN OPENSSH PRIVATE KEY-----\n");
    await expect(resolveLocal(upload, "id_rsa.png", "image")).rejects.toThrow(/not a PNG or JPEG/);
  });

  it("refuses an image over the size limit", async () => {
    writeFileSync(join(upload, "big.png"), PNG);
    truncateSync(join(upload, "big.png"), IMAGE_MAX_BYTES + 1);
    await expect(resolveLocal(upload, "big.png", "image")).rejects.toThrow(/limit/);
  });

  it("refuses an empty file and a directory", async () => {
    writeFileSync(join(upload, "empty.png"), "");
    mkdirSync(join(upload, "sub"));
    await expect(resolveLocal(upload, "empty.png", "image")).rejects.toThrow(/empty/);
    await expect(resolveLocal(upload, "sub", "image")).rejects.toThrow(/regular file/);
  });

  it("refuses the upload folder itself", async () => {
    await expect(resolveLocal(upload, ".", "image")).rejects.toThrow(/outside/);
  });

  it("does not echo the resolved absolute path in a refusal", async () => {
    const err = await resolveLocal(upload, "missing.png", "image").catch((e) => e as Error);
    expect(err.message).toContain("missing.png");
    expect(err.message).not.toContain(root);
  });

  it("recognises PNG, JPEG and MP4 by their first bytes and nothing else", () => {
    expect(sniff(PNG)).toBe("image/png");
    expect(sniff(JPEG)).toBe("image/jpeg");
    expect(sniff(MP4)).toBe("video");
    expect(sniff(Buffer.from("GIF89a"))).toBeUndefined();
  });
});

describe("image media source", () => {
  it("sends a local image as base64 with its real content type", async () => {
    const m = await imageMediaSource(upload, { image_path: "a.png" });
    expect(m).toEqual({ source_type: "image_base64", content_type: "image/png", data: PNG.toString("base64") });
  });

  it("builds a URL carousel", async () => {
    const m = await imageMediaSource(upload, { images: ["https://x.test/1.png", "https://x.test/2.png"] });
    expect(m).toEqual({
      source_type: "multiple_image_urls",
      items: [{ url: "https://x.test/1.png" }, { url: "https://x.test/2.png" }],
    });
  });

  it("builds a local carousel", async () => {
    const m = (await imageMediaSource(upload, { images: ["a.png", "b.jpg"] })) as {
      source_type: string;
      items: { content_type: string }[];
    };
    expect(m.source_type).toBe("multiple_image_base64");
    expect(m.items.map((i) => i.content_type)).toEqual(["image/png", "image/jpeg"]);
  });

  it("refuses a carousel mixing URLs and files", async () => {
    await expect(imageMediaSource(upload, { images: ["https://x.test/1.png", "a.png"] })).rejects.toThrow(/mix/);
  });

  it("holds a carousel to 2–5 images", async () => {
    await expect(imageMediaSource(upload, { images: ["a.png"] })).rejects.toThrow(/2 and 5/);
    await expect(imageMediaSource(upload, { images: Array(6).fill("a.png") })).rejects.toThrow(/2 and 5/);
  });

  it("takes exactly one image option", async () => {
    await expect(imageMediaSource(upload, {})).rejects.toThrow(/exactly one/);
    await expect(
      imageMediaSource(upload, { image_url: "https://x.test/a.png", image_path: "a.png" }),
    ).rejects.toThrow(/exactly one/);
  });
});

// ─── video ──────────────────────────────────────────────────────────────────

type Call = { url: string; method: string; headers: Record<string, string>; body: unknown };

/** A fake Pinterest: registration, a media status sequence, and pin creation. */
function fakePinterest(statuses: string[], uploadUrl = "https://uploads.test/") {
  const calls: Call[] = [];
  let i = 0;
  const fetchImpl = (async (url: string, init: RequestInit = {}) => {
    calls.push({ url, method: init.method ?? "GET", headers: init.headers as Record<string, string>, body: init.body });
    const u = new URL(url);
    let body: unknown = {};
    if (u.pathname.endsWith("/media") && init.method === "POST") {
      body = {
        media_id: "777",
        media_type: "video",
        upload_url: uploadUrl,
        upload_parameters: { key: "k1", policy: "p1", "x-amz-signature": "s1" },
      };
    } else if (u.pathname.endsWith("/media/777")) {
      body = { media_id: "777", status: statuses[Math.min(i++, statuses.length - 1)] };
    } else if (u.pathname.endsWith("/pins")) {
      body = { id: "pin-1" };
    }
    return new Response(JSON.stringify(body), { status: 200 });
  }) as unknown as typeof fetch;
  const http = new HttpClient({
    baseUrl: "https://api.pinterest.com/v5",
    headers: { Authorization: "Bearer PINTEREST-TOKEN" },
    fetchImpl,
  });
  return { http, calls };
}

function fakeS3(status = 204) {
  const calls: Call[] = [];
  const fetchImpl = (async (url: string, init: RequestInit = {}) => {
    calls.push({ url, method: init.method ?? "GET", headers: (init.headers ?? {}) as Record<string, string>, body: init.body });
    return new Response(null, { status });
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

const instant = { sleep: async () => {} };

describe("video upload", () => {
  it("sends the file to the storage URL with the signed fields and NO Pinterest token", async () => {
    const p = fakePinterest(["succeeded"]);
    const s3 = fakeS3();
    expect(await uploadVideo(p.http, upload, "clip.mp4", { fetchImpl: s3.fetchImpl })).toBe("777");

    expect(s3.calls).toHaveLength(1);
    expect(s3.calls[0]!.url).toBe("https://uploads.test/");
    expect(JSON.stringify(s3.calls[0]!.headers)).not.toContain("PINTEREST-TOKEN");
    const form = s3.calls[0]!.body as FormData;
    expect(form.get("key")).toBe("k1");
    expect(form.get("x-amz-signature")).toBe("s1");
    expect(form.get("file")).toBeInstanceOf(Blob);
  });

  it("refuses an unencrypted upload location", async () => {
    const p = fakePinterest(["succeeded"], "http://uploads.test/");
    await expect(uploadVideo(p.http, upload, "clip.mp4", { fetchImpl: fakeS3().fetchImpl })).rejects.toThrow(
      /unencrypted/,
    );
  });

  it("reports a refused upload", async () => {
    const p = fakePinterest(["succeeded"]);
    await expect(uploadVideo(p.http, upload, "clip.mp4", { fetchImpl: fakeS3(403).fetchImpl })).rejects.toThrow(
      /HTTP 403/,
    );
  });

  it("refuses a file that is not a video", async () => {
    const p = fakePinterest(["succeeded"]);
    await expect(uploadVideo(p.http, upload, "a.png", { fetchImpl: fakeS3().fetchImpl })).rejects.toThrow(
      /not an MP4 or MOV/,
    );
    expect(p.calls).toHaveLength(0); // nothing registered for a file we will not send
  });

  it("waits through processing to success", async () => {
    const p = fakePinterest(["registered", "processing", "succeeded"]);
    expect(await waitForMedia(p.http, "777", 60_000, instant)).toBe("succeeded");
    expect(p.calls.filter((c) => c.url.endsWith("/media/777"))).toHaveLength(3);
  });

  it("reports a failed video", async () => {
    const p = fakePinterest(["processing", "failed"]);
    await expect(waitForMedia(p.http, "777", 60_000, instant)).rejects.toThrow(/could not process/);
  });

  it("returns 'processing' when the budget runs out rather than waiting forever", async () => {
    const p = fakePinterest(["processing"]);
    let t = 0;
    const deps = { sleep: async (ms: number) => void (t += ms), now: () => t };
    expect(await waitForMedia(p.http, "777", 20_000, deps)).toBe("processing");
  });
});

describe("the video pin tool", () => {
  const tool = (http: HttpClient, s3: typeof fetch) =>
    buildTools(http, undefined, { uploadDir: upload, video: { fetchImpl: s3, sleep: async () => {} } }).find(
      (t) => t.name === "pinterest_create_video_pin",
    )!;

  it("uploads, waits, then pins with a key-frame cover by default", async () => {
    const p = fakePinterest(["processing", "succeeded"]);
    const res = await tool(p.http, fakeS3().fetchImpl).handler(
      tool(p.http, fakeS3().fetchImpl).input.parse({ board_id: "b1", video_path: "clip.mp4", title: "T" }),
    );
    expect(res).toEqual({ id: "pin-1" });
    const pin = p.calls.find((c) => c.url.endsWith("/pins"))!;
    expect(JSON.parse(pin.body as string)).toEqual({
      board_id: "b1",
      media_source: { source_type: "video_id", media_id: "777", cover_image_key_frame_time: 1 },
      title: "T",
    });
  });

  it("hands back the media id when processing outlasts the wait", async () => {
    const p = fakePinterest(["processing"]);
    const t = tool(p.http, fakeS3().fetchImpl);
    const res = await t.handler(t.input.parse({ board_id: "b1", video_path: "clip.mp4", wait_seconds: 0 }));
    expect(res).toMatchObject({ status: "processing", media_id: "777" });
    expect(p.calls.some((c) => c.url.endsWith("/pins"))).toBe(false);
  });

  it("resumes from a media id without uploading again", async () => {
    const p = fakePinterest(["succeeded"]);
    const s3 = fakeS3();
    const t = tool(p.http, s3.fetchImpl);
    await t.handler(t.input.parse({ board_id: "b1", media_id: "777", cover_image_url: "https://x.test/c.png" }));
    expect(s3.calls).toHaveLength(0);
    expect(p.calls.some((c) => c.method === "POST" && c.url.endsWith("/media"))).toBe(false);
    const pin = JSON.parse(p.calls.find((c) => c.url.endsWith("/pins"))!.body as string);
    expect(pin.media_source.cover_image_url).toBe("https://x.test/c.png");
  });

  it("uses a local cover image as base64", async () => {
    const p = fakePinterest(["succeeded"]);
    const t = tool(p.http, fakeS3().fetchImpl);
    await t.handler(t.input.parse({ board_id: "b1", media_id: "777", cover_image_path: "a.png" }));
    const pin = JSON.parse(p.calls.find((c) => c.url.endsWith("/pins"))!.body as string);
    expect(pin.media_source.cover_image_content_type).toBe("image/png");
    expect(pin.media_source.cover_image_data).toBe(PNG.toString("base64"));
  });

  it("takes exactly one of video_path and media_id, and at most one cover", () => {
    const t = tool(fakePinterest([]).http, fakeS3().fetchImpl);
    expect(t.input.safeParse({ board_id: "b" }).success).toBe(false);
    expect(t.input.safeParse({ board_id: "b", video_path: "v", media_id: "1" }).success).toBe(false);
    expect(
      t.input.safeParse({ board_id: "b", media_id: "1", cover_image_url: "https://x.test/c.png", cover_image_key_frame_time: 2 })
        .success,
    ).toBe(false);
    expect(t.input.safeParse({ board_id: "b", media_id: "1" }).success).toBe(true);
  });
});
