import { z } from "zod";
import {
  HttpClient,
  httpUrl,
  pageSize,
  type ToolDefinition,
} from "@nasdigital/mcp-server-core";
import { createDispatcher, COVERED } from "./dispatch.js";
import { OPERATIONS } from "./generated/operations.js";

const ADS_OPS = OPERATIONS.filter((o) => o.path.startsWith("/ad_accounts/")).length;

export function buildTools(http: HttpClient, adAccountId?: string): ToolDefinition<any>[] {
  const d = createDispatcher(http, adAccountId);

  return [
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
        "Create a pin on one of your boards. The image must be a publicly reachable URL — " +
        "Pinterest fetches it server-side, so a local file path will not work.",
      action: "write",
      input: z.object({
        board_id: z.string().min(1),
        image_url: httpUrl.describe("Publicly reachable image URL."),
        title: z.string().max(100).optional(),
        description: z.string().max(800).optional(),
        link: httpUrl.optional().describe("Where the pin sends people."),
        alt_text: z.string().max(500).optional().describe("Worth filling in; Pinterest is a visual search engine."),
        board_section_id: z.string().optional(),
      }),
      handler: ({ board_id, image_url, board_section_id, ...rest }) =>
        http.post("/pins", {
          board_id,
          ...(board_section_id ? { board_section_id } : {}),
          media_source: { source_type: "image_url", url: image_url },
          ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined)),
        }),
    },

    {
      name: "pinterest_get_pin_analytics",
      description: "How a pin has performed. Reads only, so it works under MCP_READ_ONLY.",
      action: "read",
      input: z.object({
        pin_id: z.string().min(1),
        start_date: z.string().describe("YYYY-MM-DD."),
        end_date: z.string().describe("YYYY-MM-DD."),
        metric_types: z
          .string()
          .optional()
          .describe("Comma-separated, e.g. IMPRESSION,PIN_CLICK,SAVE."),
      }),
      handler: ({ pin_id, ...q }) =>
        http.get(`/pins/${encodeURIComponent(pin_id)}/analytics`, q),
    },

    {
      name: "pinterest_search_my_pins",
      description: "Search your own pins by term.",
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
}
