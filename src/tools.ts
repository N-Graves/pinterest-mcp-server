import { z } from "zod";
import {
  HttpClient,
  ToolError,
  httpUrl,
  pageSize,
  type ToolDefinition,
} from "@nasdigitaluk/mcp-server-core";
import { createDispatcher, COVERED } from "./dispatch.js";
import { withPinterestErrors } from "./errors.js";
import {
  imageBase64,
  imageMediaSource,
  uploadVideo,
  waitForMedia,
  type VideoDeps,
} from "./media.js";
import { OPERATIONS } from "./generated/operations.js";

const ADS_OPS = OPERATIONS.filter((o) => o.path.startsWith("/ad_accounts/")).length;

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD");

/** Pinterest requires metric_types on pin analytics; 1.0.0 left it optional and 400'd. */
export const DEFAULT_PIN_METRICS = "IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK";

export interface ToolOptions {
  /** The one folder local media may be read from. Unset: local files refused. */
  uploadDir?: string;
  video?: VideoDeps;
}

const pinText = {
  title: z.string().max(100).optional(),
  description: z.string().max(800).optional(),
  link: httpUrl.optional().describe("Where the pin sends people."),
  board_section_id: z.string().optional(),
};

const defined = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

export function buildTools(
  http: HttpClient,
  adAccountId?: string,
  opts: ToolOptions = {},
): ToolDefinition<any>[] {
  const d = createDispatcher(http, adAccountId);
  const localNote = opts.uploadDir
    ? "Local files are read from the configured upload folder only."
    : "Local files are switched off on this server (PINTEREST_UPLOAD_DIR is not set), so use public URLs.";

  const tools: ToolDefinition<any>[] = [
    {
      name: "pinterest_list_operations",
      description:
        `Browse the Pinterest API — ${COVERED.length} of ${OPERATIONS.length} operations are reachable here. ` +
        `${ADS_OPS} of them are advertising and need an ad account; the rest are the ` +
        `organic surface (pins, boards, media, search, analytics). Use this to find an ` +
        `operation id for pinterest_call.`,
      action: "read",
      input: z.object({
        search: z
          .string()
          .optional()
          .describe("Filter by id, path, tag or summary — try 'boards', 'catalog', 'campaign'."),
        include_excluded: z.boolean().optional().default(false),
      }),
      handler: async ({ search, include_excluded }) => d.browse(search, include_excluded),
    },

    {
      name: "pinterest_call",
      description:
        "Call any Pinterest operation by id. ad_account_id is filled in from " +
        "PINTEREST_AD_ACCOUNT_ID when you leave it out.",
      // Can reach an operation that spends ad budget, so a no-destructive
      // server must refuse it outright rather than inspect the id afterwards.
      action: "destructive",
      input: z.object({
        operation_id: z.string().min(1),
        params: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
        body: z.unknown().optional(),
      }),
      handler: ({ operation_id, params, body }) => d.call(operation_id, params ?? {}, body),
    },

    {
      name: "pinterest_get_me",
      description: "The authenticated Pinterest account.",
      action: "read",
      input: z.object({}),
      handler: () => http.get("/user_account"),
    },

    {
      name: "pinterest_list_boards",
      description: "Boards belonging to the authenticated account.",
      action: "read",
      input: z.object({
        page_size: pageSize(250, 25),
        bookmark: z.string().optional().describe("Cursor from a previous page."),
        privacy: z.enum(["ALL", "PROTECTED", "PUBLIC", "SECRET"]).optional(),
      }),
      handler: ({ page_size, bookmark, privacy }) =>
        http.get("/boards", { page_size, bookmark, privacy }),
    },

    {
      name: "pinterest_list_pins",
      description: "Pins belonging to the authenticated account.",
      action: "read",
      input: z.object({
        page_size: pageSize(250, 25),
        bookmark: z.string().optional(),
        pin_filter: z.enum(["exclude_native", "exclude_repins", "has_been_promoted"]).optional(),
      }),
      handler: ({ page_size, bookmark, pin_filter }) =>
        http.get("/pins", { page_size, bookmark, pin_filter }),
    },

    {
      name: "pinterest_create_pin",
      description:
        "Create an image pin on one of your boards. Give exactly one of: image_url (a public " +
        "URL Pinterest fetches), image_path (a local PNG or JPEG), or images (a 2–5 image " +
        `carousel, all URLs or all local files). ${localNote}`,
      action: "write",
      input: z
        .object({
          board_id: z.string().min(1),
          image_url: httpUrl.optional().describe("Publicly reachable image URL."),
          image_path: z.string().min(1).optional().describe("A PNG or JPEG in the upload folder."),
          images: z
            .array(z.string().min(1))
            .min(2)
            .max(5)
            .optional()
            .describe("Carousel: 2–5 public URLs, or 2–5 files in the upload folder."),
          alt_text: z
            .string()
            .max(500)
            .optional()
            .describe("Worth filling in; Pinterest is a visual search engine."),
          ...pinText,
        })
        .refine(
          (v) => [v.image_url, v.image_path, v.images].filter((x) => x !== undefined).length === 1,
          { message: "give exactly one of image_url, image_path or images" },
        ),
      handler: async ({ board_id, image_url, image_path, images, board_section_id, ...rest }) => {
        // A carousel entry with a scheme must be a usable public URL; the same
        // rule image_url gets from its schema (no file:, no credentials).
        for (const i of (images ?? []) as string[]) {
          if (/^[a-z][a-z0-9+.-]*:/i.test(i) && !httpUrl.safeParse(i).success) {
            throw new ToolError(`"${i}" is not a usable public URL.`);
          }
        }
        const media_source = await imageMediaSource(opts.uploadDir, { image_url, image_path, images });
        return http.post("/pins", {
          board_id,
          ...(board_section_id ? { board_section_id } : {}),
          media_source,
          ...defined(rest),
        });
      },
    },

    {
      name: "pinterest_create_video_pin",
      description:
        "Create a video pin: uploads a local MP4 or MOV, waits for Pinterest to process it, then " +
        "pins it with a cover. If processing outlasts wait_seconds you get status 'processing' " +
        "and a media_id — call again with that media_id instead of uploading twice. " +
        `${localNote} Not available in Pinterest's sandbox.`,
      action: "write",
      input: z
        .object({
          board_id: z.string().min(1),
          video_path: z.string().min(1).optional().describe("An MP4 or MOV in the upload folder."),
          media_id: z
            .string()
            .regex(/^\d+$/)
            .optional()
            .describe("Resume a previous upload rather than sending the file again."),
          cover_image_url: httpUrl.optional(),
          cover_image_path: z.string().min(1).optional().describe("A PNG or JPEG in the upload folder."),
          cover_image_key_frame_time: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe("Use the frame this many seconds in as the cover. The default when no cover is given is 1."),
          wait_seconds: z.number().int().min(0).max(300).optional().default(90),
          ...pinText,
        })
        .refine((v) => (v.video_path === undefined) !== (v.media_id === undefined), {
          message: "give exactly one of video_path or media_id",
        })
        .refine(
          (v) =>
            [v.cover_image_url, v.cover_image_path, v.cover_image_key_frame_time].filter(
              (x) => x !== undefined,
            ).length <= 1,
          { message: "give at most one cover option" },
        ),
      handler: async (a) => {
        const mediaId: string =
          a.media_id ?? (await uploadVideo(http, opts.uploadDir, a.video_path, opts.video));
        const status = await waitForMedia(http, mediaId, a.wait_seconds * 1000, opts.video);
        if (status === "processing") {
          return {
            status: "processing",
            media_id: mediaId,
            message: "Pinterest is still processing the video. Call again with this media_id.",
          };
        }

        let cover: Record<string, unknown>;
        if (a.cover_image_url) cover = { cover_image_url: a.cover_image_url };
        else if (a.cover_image_path) {
          const img = await imageBase64(opts.uploadDir, a.cover_image_path);
          cover = { cover_image_content_type: img.content_type, cover_image_data: img.data };
        } else cover = { cover_image_key_frame_time: a.cover_image_key_frame_time ?? 1 };

        return http.post("/pins", {
          board_id: a.board_id,
          ...(a.board_section_id ? { board_section_id: a.board_section_id } : {}),
          media_source: { source_type: "video_id", media_id: mediaId, ...cover },
          ...defined({ title: a.title, description: a.description, link: a.link }),
        });
      },
    },

    {
      name: "pinterest_get_pin_analytics",
      description: "How one of your pins has performed. Reads only, so it works under MCP_READ_ONLY.",
      action: "read",
      input: z.object({
        pin_id: z.string().min(1),
        start_date: date,
        end_date: date,
        metric_types: z
          .string()
          .optional()
          .describe(`Comma-separated. Defaults to ${DEFAULT_PIN_METRICS}.`),
      }),
      handler: ({ pin_id, metric_types, ...q }) =>
        http.get(`/pins/${encodeURIComponent(pin_id)}/analytics`, {
          ...q,
          metric_types: metric_types ?? DEFAULT_PIN_METRICS,
        }),
    },

    {
      name: "pinterest_get_account_analytics",
      description:
        "How the whole account is performing: totals and a daily series (view 'summary'), or " +
        "the best pins or video pins over a period ('top_pins', 'top_video_pins'). Reads only.",
      action: "read",
      input: z.object({
        start_date: date,
        end_date: date,
        view: z.enum(["summary", "top_pins", "top_video_pins"]).optional().default("summary"),
        sort_by: z
          .string()
          .optional()
          .describe("Top views only. e.g. IMPRESSION, SAVE, OUTBOUND_CLICK, PIN_CLICK. Default IMPRESSION."),
        num_of_pins: z.number().int().min(1).max(50).optional().describe("Top views only."),
        metric_types: z.string().optional().describe("Comma-separated metric names."),
        content_type: z.enum(["ALL", "PAID", "ORGANIC"]).optional(),
        source: z.enum(["ALL", "YOUR_PINS", "OTHER_PINS"]).optional(),
      }),
      handler: ({ view, sort_by, num_of_pins, ...q }) => {
        if (view === "summary") {
          if (sort_by !== undefined || num_of_pins !== undefined) {
            throw new ToolError(
              "sort_by and num_of_pins only apply to the top_pins and top_video_pins views.",
            );
          }
          return http.get("/user_account/analytics", q);
        }
        return http.get(`/user_account/analytics/${view}`, {
          ...q,
          sort_by: sort_by ?? "IMPRESSION",
          num_of_pins,
        });
      },
    },

    {
      name: "pinterest_search_my_pins",
      description:
        "Search your own pins by term. Pinterest requires the pins:read_secret and " +
        "boards:read_secret scopes for this, even to find public pins; pinterest-mcp-auth " +
        "requests them by default.",
      action: "read",
      input: z.object({
        query: z.string().min(1),
        page_size: pageSize(250, 25),
        bookmark: z.string().optional(),
      }),
      handler: ({ query, page_size, bookmark }) =>
        http.get("/search/pins", { query, page_size, bookmark }),
    },
  ];

  return tools.map((t) => ({ ...t, handler: withPinterestErrors(t.handler) }));
}
