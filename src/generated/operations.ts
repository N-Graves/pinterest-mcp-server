/**
 * GENERATED FILE - do not edit by hand.
 *
 * Produced by scripts/generate-operations.mjs from vendor/pinterest-openapi.json
 * (Pinterest REST API v5.28.0, OpenAPI 3.0.3).
 *
 * 266 operations: 263 reachable, 3 excluded.
 *
 * Most of Pinterest's API is advertising, and it is all covered - an ad
 * account is something any business account can create, so excluding it would
 * deny the API to people who can genuinely use it. What IS excluded is the
 * OAuth token endpoints, for safety rather than access.
 *
 * 138 read, 91 write, 37 destructive, where destructive means
 * irreversible OR chargeable - an active campaign spends budget the moment it
 * exists.
 */
import type { Operation } from "@nasdigitaluk/mcp-server-core";

export interface CataloguedOperation extends Operation {
  tags: string[];
  summary: string;
  pathParams: string[];
  queryParams: string[];
  hasBody: boolean;
  /** Consequence, not HTTP verb: destructive means irreversible OR chargeable. */
  action: "read" | "write" | "destructive";
}

export const OPERATIONS: CataloguedOperation[] = [
  {
    "id": "ad_accounts/list",
    "method": "GET",
    "path": "/ad_accounts",
    "tags": [
      "ad_accounts"
    ],
    "summary": "List ad accounts",
    "pathParams": [],
    "queryParams": [
      "include_shared_accounts",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_accounts/create",
    "method": "POST",
    "path": "/ad_accounts",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Create ad account",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ad_accounts/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Get ad account",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ad_groups",
    "tags": [
      "ad_groups"
    ],
    "summary": "List ad groups",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "campaign_ids",
      "ad_group_ids",
      "entity_statuses",
      "translate_interests_to_names"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/ad_groups",
    "tags": [
      "ad_groups"
    ],
    "summary": "Update ad groups",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ad_groups/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/ad_groups",
    "tags": [
      "ad_groups"
    ],
    "summary": "Create ad groups",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ad_groups/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/{ad_group_id}",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get ad group",
    "pathParams": [
      "ad_group_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups_dynamic_titles/process_csv",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/{ad_group_id}/dynamic_titles",
    "tags": [
      "ad_groups"
    ],
    "summary": "Process dynamic titles CSV",
    "pathParams": [
      "ad_account_id",
      "ad_group_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ad_groups_dynamic_titles/download_csv",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/{ad_group_id}/dynamic_titles/csv",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get dynamic titles CSV download URL",
    "pathParams": [
      "ad_account_id",
      "ad_group_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups_dynamic_titles/get_status",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/{ad_group_id}/dynamic_titles/status",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get dynamic titles status",
    "pathParams": [
      "ad_account_id",
      "ad_group_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups_dynamic_titles/get_upload_url",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/{ad_group_id}/dynamic_titles/uploads",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get dynamic titles upload URL",
    "pathParams": [
      "ad_account_id",
      "ad_group_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups/analytics",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/analytics",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get ad group analytics",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "start_date",
      "end_date",
      "ad_group_ids",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "aggregate_report_rows",
      "reporting_timezone"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups/audience_sizing",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/audience_sizing",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get audience sizing",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ad_groups_targeting_analytics/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ad_groups/targeting_analytics",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get targeting analytics for ad groups",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "ad_group_ids",
      "start_date",
      "end_date",
      "targeting_types",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "attribution_types",
      "reporting_timezone",
      "sort_columns",
      "sort_ascending"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_previews/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/ad_previews",
    "tags": [
      "ads"
    ],
    "summary": "Create ad preview with pin or image",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ads/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ads",
    "tags": [
      "ads"
    ],
    "summary": "List ads",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "campaign_ids",
      "ad_group_ids",
      "ad_ids",
      "entity_statuses"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ads/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/ads",
    "tags": [
      "ads"
    ],
    "summary": "Update ads",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ads/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/ads",
    "tags": [
      "ads"
    ],
    "summary": "Create ads",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ads_credits_discounts/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ads_credit/discounts",
    "tags": [
      "billing"
    ],
    "summary": "Get ads credit discounts",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ads_credit/redeem",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/ads_credit/redeem",
    "tags": [
      "billing"
    ],
    "summary": "Redeem ad credits",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ads/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ads/{ad_id}",
    "tags": [
      "ads"
    ],
    "summary": "Get ad",
    "pathParams": [
      "ad_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ads/analytics",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ads/analytics",
    "tags": [
      "ads"
    ],
    "summary": "Get ad analytics",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "pin_ids",
      "start_date",
      "end_date",
      "ad_ids",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "campaign_ids",
      "reporting_timezone"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_targeting_analytics/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ads/targeting_analytics",
    "tags": [
      "ads"
    ],
    "summary": "Get targeting analytics for ads",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "ad_ids",
      "start_date",
      "end_date",
      "targeting_types",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "attribution_types",
      "reporting_timezone",
      "sort_columns",
      "sort_ascending"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "advertiser_defined_events/delete",
    "method": "DELETE",
    "path": "/ad_accounts/{ad_account_id}/advertiser_defined_events",
    "tags": [
      "conversions"
    ],
    "summary": "Delete advertiser defined events",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "event_names"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "advertiser_defined_events/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/advertiser_defined_events",
    "tags": [
      "conversions"
    ],
    "summary": "Get advertiser defined events",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "advertiser_defined_events/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/advertiser_defined_events",
    "tags": [
      "conversions"
    ],
    "summary": "Update advertiser defined events",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "advertiser_defined_events/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/advertiser_defined_events",
    "tags": [
      "conversions"
    ],
    "summary": "Create advertiser defined events",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ad_account/analytics",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/analytics",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Get ad account analytics",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "start_date",
      "end_date",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "reporting_timezone"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "audience_insights/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/audience_insights",
    "tags": [
      "audience_insights"
    ],
    "summary": "Get audience insights",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "audience_insight_type"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "audiences/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/audiences",
    "tags": [
      "audiences"
    ],
    "summary": "List audiences",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "ownership_type",
      "exclude_nca"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "audiences/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/audiences",
    "tags": [
      "audiences"
    ],
    "summary": "Create audience",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "audiences/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/audiences/{audience_id}",
    "tags": [
      "audiences"
    ],
    "summary": "Get audience",
    "pathParams": [
      "audience_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "audiences/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/audiences/{audience_id}",
    "tags": [
      "audiences"
    ],
    "summary": "Update audience",
    "pathParams": [
      "audience_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "update_ad_account_to_ad_account_shared_audience",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/audiences/ad_accounts/shared",
    "tags": [
      "audience_sharing"
    ],
    "summary": "Update audience sharing between ad accounts",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "update_ad_account_to_business_shared_audience",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/audiences/businesses/shared",
    "tags": [
      "audience_sharing"
    ],
    "summary": "Update audience sharing from an ad account to businesses",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ad_accounts_audiences_shared_accounts/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/audiences/shared/accounts",
    "tags": [
      "audience_sharing"
    ],
    "summary": "List accounts with access to an audience owned by an ad account",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "audience_id",
      "account_type",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_groups_bid_floor/get",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/bid_floor",
    "tags": [
      "ad_groups"
    ],
    "summary": "Get bid floors",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "billing_invoice_download/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/billing_invoice/{billing_invoice_id}/download",
    "tags": [
      "billing"
    ],
    "summary": "Get download url for a billing invoice",
    "pathParams": [
      "ad_account_id",
      "billing_invoice_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "billing_invoices/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/billing_invoices",
    "tags": [
      "billing"
    ],
    "summary": "Get billing invoices",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "sort",
      "status",
      "document_type",
      "start_due_date",
      "end_due_date"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "billing_profiles/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/billing_profiles",
    "tags": [
      "billing"
    ],
    "summary": "Get billing profiles",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "is_active",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "bulk_request/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/bulk/{bulk_request_id}",
    "tags": [
      "bulk"
    ],
    "summary": "Download advertiser entities in bulk",
    "pathParams": [
      "ad_account_id",
      "bulk_request_id"
    ],
    "queryParams": [
      "include_details"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "bulk_download/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/bulk/download",
    "tags": [
      "bulk"
    ],
    "summary": "Get advertiser entities in bulk",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "bulk_upsert/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/bulk/upsert",
    "tags": [
      "bulk"
    ],
    "summary": "Create/update ad entities in bulk",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "campaign_ad_preview/delete",
    "method": "DELETE",
    "path": "/ad_accounts/{ad_account_id}/campaign_ad_preview",
    "tags": [
      "ads"
    ],
    "summary": "Delete ad preview records for one or more ad groups",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "ad_group_ids"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "campaign_ad_preview/read",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/campaign_ad_preview",
    "tags": [
      "ads"
    ],
    "summary": "Fetch ad preview records for one or more ad groups",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "ad_group_ids"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "campaign_ad_preview/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/campaign_ad_preview",
    "tags": [
      "ads"
    ],
    "summary": "Create ad preview records for one or more ad groups",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "campaigns/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/campaigns",
    "tags": [
      "campaigns"
    ],
    "summary": "List campaigns",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "campaign_ids",
      "entity_statuses"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "campaigns/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/campaigns",
    "tags": [
      "campaigns"
    ],
    "summary": "Update campaigns",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "campaigns/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/campaigns",
    "tags": [
      "campaigns"
    ],
    "summary": "Create campaigns",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "campaigns/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/campaigns/{campaign_id}",
    "tags": [
      "campaigns"
    ],
    "summary": "Get campaign",
    "pathParams": [
      "campaign_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "campaigns/analytics",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/campaigns/analytics",
    "tags": [
      "campaigns"
    ],
    "summary": "Get campaign analytics",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "start_date",
      "end_date",
      "campaign_ids",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "aggregate_report_rows",
      "reporting_timezone"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "get_campaign_delivery_estimates",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/campaigns/delivery_estimates",
    "tags": [
      "campaigns"
    ],
    "summary": "Get campaign delivery estimates",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "campaign_targeting_analytics/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/campaigns/targeting_analytics",
    "tags": [
      "campaigns"
    ],
    "summary": "Get targeting analytics for campaigns",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "campaign_ids",
      "start_date",
      "end_date",
      "targeting_types",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "attribution_types",
      "reporting_timezone"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "conversion_deletion_request/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/conversion_deletion_requests",
    "tags": [
      "conversion_deletion_requests"
    ],
    "summary": "List conversion deletion requests",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "conversion_deletion_request/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/conversion_deletion_requests",
    "tags": [
      "conversion_deletion_requests"
    ],
    "summary": "Create a conversion deletion request",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "conversion_deletion_request/delete",
    "method": "DELETE",
    "path": "/ad_accounts/{ad_account_id}/conversion_deletion_requests/{request_id}",
    "tags": [
      "conversion_deletion_requests"
    ],
    "summary": "Delete a conversion deletion request",
    "pathParams": [
      "request_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "conversion_deletion_request/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/conversion_deletion_requests/{request_id}",
    "tags": [
      "conversion_deletion_requests"
    ],
    "summary": "Get a single conversion deletion request",
    "pathParams": [
      "request_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "conversion_eqs/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/conversion_eqs",
    "tags": [
      "conversion_eqs"
    ],
    "summary": "Get event quality score (EQS)",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "lookback_period",
      "source_platform",
      "ingestion_source"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "conversion_tags/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/conversion_tags",
    "tags": [
      "conversion_tags"
    ],
    "summary": "List conversion tags",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "filter_deleted"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "conversion_tags/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/conversion_tags",
    "tags": [
      "conversion_tags"
    ],
    "summary": "Create conversion tag",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "conversion_tags/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/conversion_tags/{conversion_tag_id}",
    "tags": [
      "conversion_tags"
    ],
    "summary": "Get conversion tag",
    "pathParams": [
      "ad_account_id",
      "conversion_tag_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ocpm_eligible_conversion_tags/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/conversion_tags/ocpm_eligible",
    "tags": [
      "conversion_tags"
    ],
    "summary": "Get Ocpm eligible conversion tags",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "page_visit_conversion_tags/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/conversion_tags/page_visit",
    "tags": [
      "conversion_tags"
    ],
    "summary": "Get page visit conversion tags",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "customer_lists/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/customer_lists",
    "tags": [
      "customer_lists"
    ],
    "summary": "Get customer lists",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "exclude_nca"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "customer_lists/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/customer_lists",
    "tags": [
      "customer_lists"
    ],
    "summary": "Create customer lists",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "customer_lists/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}",
    "tags": [
      "customer_lists"
    ],
    "summary": "Get customer list",
    "pathParams": [
      "ad_account_id",
      "customer_list_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "customer_lists/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}",
    "tags": [
      "customer_lists"
    ],
    "summary": "Update customer list",
    "pathParams": [
      "ad_account_id",
      "customer_list_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "customer_list_uploads/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}/uploads",
    "tags": [
      "customer_list_uploads"
    ],
    "summary": "Create customer list upload",
    "pathParams": [
      "ad_account_id",
      "customer_list_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "customer_list_uploads/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}/uploads/{customer_list_upload_id}",
    "tags": [
      "customer_list_uploads"
    ],
    "summary": "Get customer list upload",
    "pathParams": [
      "ad_account_id",
      "customer_list_id",
      "customer_list_upload_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "customer_list_uploads/run",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}/uploads/{customer_list_upload_id}/run",
    "tags": [
      "customer_list_uploads"
    ],
    "summary": "Run customer list upload",
    "pathParams": [
      "ad_account_id",
      "customer_list_id",
      "customer_list_upload_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "customer_segment/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/customer_segments",
    "tags": [
      "customer_segment"
    ],
    "summary": "List customer segments",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "include_sizing",
      "search_query"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "customer_segment/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/customer_segments",
    "tags": [
      "customer_segment"
    ],
    "summary": "Update customer segments",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "customer_segment/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/customer_segments",
    "tags": [
      "customer_segment"
    ],
    "summary": "Create customer segments",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "events/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/events",
    "tags": [
      "conversion_events"
    ],
    "summary": "Send conversions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "test"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "audience_insights_scope_and_type/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/insights/audiences",
    "tags": [
      "audience_insights"
    ],
    "summary": "Get audience insights scope and type",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "keywords/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/keywords",
    "tags": [
      "keywords"
    ],
    "summary": "Get keywords",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "campaign_id",
      "ad_group_id",
      "ad_group_ids",
      "match_types",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "keywords/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/keywords",
    "tags": [
      "keywords"
    ],
    "summary": "Update keywords",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "keywords/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/keywords",
    "tags": [
      "keywords"
    ],
    "summary": "Create keywords",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "country_keywords_metrics/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/keywords/metrics",
    "tags": [
      "keywords"
    ],
    "summary": "Get country's keyword metrics",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "country_code",
      "keywords"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "labels/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/labels",
    "tags": [
      "labels"
    ],
    "summary": "List labels",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "campaign_ids",
      "label_ids",
      "entity_statuses",
      "label_types",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "labels/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/labels",
    "tags": [
      "labels"
    ],
    "summary": "Update labels",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "labels/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/labels",
    "tags": [
      "labels"
    ],
    "summary": "Create labels",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "labels/apply",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/labels/{label_id}/apply",
    "tags": [
      "labels"
    ],
    "summary": "Apply label to entity",
    "pathParams": [
      "ad_account_id",
      "label_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "labels/remove",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/labels/{label_id}/remove",
    "tags": [
      "labels"
    ],
    "summary": "Remove label from entities",
    "pathParams": [
      "ad_account_id",
      "label_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "lead_forms/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/lead_forms",
    "tags": [
      "lead_forms"
    ],
    "summary": "List lead forms",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "lead_forms/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/lead_forms",
    "tags": [
      "lead_forms"
    ],
    "summary": "Update lead forms",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "lead_forms/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/lead_forms",
    "tags": [
      "lead_forms"
    ],
    "summary": "Create lead forms",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "lead_form/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/lead_forms/{lead_form_id}",
    "tags": [
      "lead_forms"
    ],
    "summary": "Get lead form by id",
    "pathParams": [
      "lead_form_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "lead_form_test/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/lead_forms/{lead_form_id}/test",
    "tags": [
      "lead_forms"
    ],
    "summary": "Create lead form test data",
    "pathParams": [
      "ad_account_id",
      "lead_form_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "leads_export/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/leads_export",
    "tags": [
      "leads_export"
    ],
    "summary": "Create a request to export leads collected from a lead ad",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "leads_export/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/leads_export/{leads_export_id}",
    "tags": [
      "leads_export"
    ],
    "summary": "Get the lead export from the lead export create call",
    "pathParams": [
      "ad_account_id",
      "leads_export_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_accounts_subscriptions/get_list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/leads/subscriptions",
    "tags": [
      "lead_ads"
    ],
    "summary": "Get lead ads subscriptions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_accounts_subscriptions/post",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/leads/subscriptions",
    "tags": [
      "lead_ads"
    ],
    "summary": "Create lead ads subscription",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ad_accounts_subscriptions/del_by_id",
    "method": "DELETE",
    "path": "/ad_accounts/{ad_account_id}/leads/subscriptions/{subscription_id}",
    "tags": [
      "lead_ads"
    ],
    "summary": "Delete lead ads subscription",
    "pathParams": [
      "ad_account_id",
      "subscription_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "ad_accounts_subscriptions/get_by_id",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/leads/subscriptions/{subscription_id}",
    "tags": [
      "lead_ads"
    ],
    "summary": "Get lead ads subscription by ID",
    "pathParams": [
      "ad_account_id",
      "subscription_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "analytics/get_mmm_report",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/mmm_reports",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Get advertiser Marketing Mix Modeling (MMM) report.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "token"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "analytics/create_mmm_report",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/mmm_reports",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Create a request for a Marketing Mix Modeling (MMM) report",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "msot_events/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/msot/events",
    "tags": [
      "msot_events"
    ],
    "summary": "Send Measurement Source Of Truth (MSOT) attributed conversion events",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "order_lines/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/order_lines",
    "tags": [
      "order_lines"
    ],
    "summary": "Get order lines.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "order_lines/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/order_lines/{order_line_id}",
    "tags": [
      "order_lines"
    ],
    "summary": "Get order line",
    "pathParams": [
      "order_line_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_pins/analytics",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/pins/analytics",
    "tags": [
      "campaigns"
    ],
    "summary": "Get pins analytics",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "campaign_id",
      "pin_ids",
      "start_date",
      "end_date",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "product_group_promotions/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/product_group_promotions",
    "tags": [
      "product_group_promotions"
    ],
    "summary": "Get product group promotions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "product_group_promotion_ids",
      "entity_statuses",
      "ad_group_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "product_group_promotions/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/product_group_promotions",
    "tags": [
      "product_group_promotions"
    ],
    "summary": "Update product group promotions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "product_group_promotions/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/product_group_promotions",
    "tags": [
      "product_group_promotions"
    ],
    "summary": "Create product group promotions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "product_group_promotions/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/product_group_promotions/{product_group_promotion_id}",
    "tags": [
      "product_group_promotions"
    ],
    "summary": "Get a product group promotion by id",
    "pathParams": [
      "ad_account_id",
      "product_group_promotion_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "product_groups/analytics",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/product_groups/analytics",
    "tags": [
      "product_group_promotions"
    ],
    "summary": "Get product group analytics",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "start_date",
      "end_date",
      "product_group_ids",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "reporting_timezone"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "get_ad_groups_by_promotion_ids/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/promotion_applied_entities",
    "tags": [
      "ad_groups"
    ],
    "summary": "List of ad groups using promotions IDs.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "promotion_ids"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "promotions/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/promotions",
    "tags": [
      "promotions"
    ],
    "summary": "Get promotions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "promotions/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/promotions",
    "tags": [
      "promotions"
    ],
    "summary": "Update promotions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "promotions/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/promotions",
    "tags": [
      "promotions"
    ],
    "summary": "Create promotions",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "promotions/delete",
    "method": "DELETE",
    "path": "/ad_accounts/{ad_account_id}/promotions/{promotion_id}",
    "tags": [
      "promotions"
    ],
    "summary": "Delete promotion by id",
    "pathParams": [
      "promotion_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "promotions/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/promotions/{promotion_id}",
    "tags": [
      "promotions"
    ],
    "summary": "Get promotion by id",
    "pathParams": [
      "promotion_id",
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "analytics/get_report",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/reports",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Get the account analytics report created by the async call",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "token"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "analytics/create_report",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/reports",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Create async request for an account analytics report",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "analytics/get_conversion_product_report",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/reports/brand_category_sku",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Get advertiser brand, category, SKU report",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "token"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "analytics/create_conversion_product_report",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/reports/brand_category_sku",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Create a request for a brand, category, SKU report",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "sandbox/delete",
    "method": "DELETE",
    "path": "/ad_accounts/{ad_account_id}/sandbox",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Delete ads data for ad account in API Sandbox",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "schedules/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/schedules",
    "tags": [
      "schedules"
    ],
    "summary": "Get Schedules",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "schedule_statuses",
      "schedule_type",
      "entity_ids"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "schedules/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/schedules",
    "tags": [
      "schedules"
    ],
    "summary": "Update schedules",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "schedules/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/schedules",
    "tags": [
      "schedules"
    ],
    "summary": "Create schedules",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ssio_accounts/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ssio/accounts",
    "tags": [
      "billing"
    ],
    "summary": "Get Salesforce account details including bill-to information.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ssio_insertion_order/edit",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/ssio/insertion_orders",
    "tags": [
      "billing"
    ],
    "summary": "Edit insertion order through SSIO.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ssio_insertion_order/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/ssio/insertion_orders",
    "tags": [
      "billing"
    ],
    "summary": "Create insertion order through SSIO.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "ssio_insertion_orders_status/get_by_pin_order_id",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ssio/insertion_orders/{pin_order_id}/status",
    "tags": [
      "billing"
    ],
    "summary": "Get insertion order status by pin order id.",
    "pathParams": [
      "ad_account_id",
      "pin_order_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ssio_insertion_orders_status/get_by_ad_account",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ssio/insertion_orders/status",
    "tags": [
      "billing"
    ],
    "summary": "Get insertion order status by ad account id.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ssio_order_lines/get_by_ad_account",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/ssio/order_lines",
    "tags": [
      "billing"
    ],
    "summary": "Get Salesforce order lines by ad account id.",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "pin_order_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_account_targeting_analytics/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/targeting_analytics",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Get targeting analytics for an ad account",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "start_date",
      "end_date",
      "targeting_types",
      "columns",
      "granularity",
      "click_window_days",
      "engagement_window_days",
      "view_window_days",
      "conversion_report_time",
      "attribution_types",
      "reporting_timezone"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "targeting_template/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/targeting_templates",
    "tags": [
      "targeting_template"
    ],
    "summary": "List targeting templates",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order",
      "include_sizing",
      "search_query"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "targeting_template/update",
    "method": "PATCH",
    "path": "/ad_accounts/{ad_account_id}/targeting_templates",
    "tags": [
      "targeting_template"
    ],
    "summary": "Update targeting templates",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "targeting_template/create",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/targeting_templates",
    "tags": [
      "targeting_template"
    ],
    "summary": "Create targeting templates",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "templates/list",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/templates",
    "tags": [
      "ad_accounts"
    ],
    "summary": "List templates",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "bookmark",
      "page_size",
      "order"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "analytics/create_template_report",
    "method": "POST",
    "path": "/ad_accounts/{ad_account_id}/templates/{template_id}/reports",
    "tags": [
      "ad_accounts"
    ],
    "summary": "Create async request for an analytics report using a template",
    "pathParams": [
      "ad_account_id",
      "template_id"
    ],
    "queryParams": [
      "start_date",
      "end_date",
      "granularity"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "terms_of_service/get",
    "method": "GET",
    "path": "/ad_accounts/{ad_account_id}/terms_of_service",
    "tags": [
      "terms_of_service"
    ],
    "summary": "Get terms of service",
    "pathParams": [
      "ad_account_id"
    ],
    "queryParams": [
      "include_html",
      "tos_type"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "advanced_auction_items_get/post",
    "method": "POST",
    "path": "/advanced_auction/items/get",
    "tags": [
      "advanced_auction"
    ],
    "summary": "Get item bid options (POST)",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "advanced_auction_items_submit/post",
    "method": "POST",
    "path": "/advanced_auction/items/submit",
    "tags": [
      "advanced_auction"
    ],
    "summary": "Operate on item level bid options",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "boards/list",
    "method": "GET",
    "path": "/boards",
    "tags": [
      "boards"
    ],
    "summary": "List boards",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "privacy",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "boards/create",
    "method": "POST",
    "path": "/boards",
    "tags": [
      "boards"
    ],
    "summary": "Create board",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "boards/delete",
    "method": "DELETE",
    "path": "/boards/{board_id}",
    "tags": [
      "boards"
    ],
    "summary": "Delete board",
    "pathParams": [
      "board_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "boards/get",
    "method": "GET",
    "path": "/boards/{board_id}",
    "tags": [
      "boards"
    ],
    "summary": "Get board",
    "pathParams": [
      "board_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "boards/update",
    "method": "PATCH",
    "path": "/boards/{board_id}",
    "tags": [
      "boards"
    ],
    "summary": "Update board",
    "pathParams": [
      "board_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "boards/list_pins",
    "method": "GET",
    "path": "/boards/{board_id}/pins",
    "tags": [
      "boards"
    ],
    "summary": "List Pins on board",
    "pathParams": [
      "board_id"
    ],
    "queryParams": [
      "creative_types",
      "ad_account_id",
      "pin_metrics",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "board_sections/list",
    "method": "GET",
    "path": "/boards/{board_id}/sections",
    "tags": [
      "boards"
    ],
    "summary": "List board sections",
    "pathParams": [
      "board_id"
    ],
    "queryParams": [
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "board_sections/create",
    "method": "POST",
    "path": "/boards/{board_id}/sections",
    "tags": [
      "boards"
    ],
    "summary": "Create board section",
    "pathParams": [
      "board_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "board_sections/delete",
    "method": "DELETE",
    "path": "/boards/{board_id}/sections/{section_id}",
    "tags": [
      "boards"
    ],
    "summary": "Delete board section",
    "pathParams": [
      "board_id",
      "section_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "board_sections/update",
    "method": "PATCH",
    "path": "/boards/{board_id}/sections/{section_id}",
    "tags": [
      "boards"
    ],
    "summary": "Update board section",
    "pathParams": [
      "board_id",
      "section_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "board_sections/list_pins",
    "method": "GET",
    "path": "/boards/{board_id}/sections/{section_id}/pins",
    "tags": [
      "boards"
    ],
    "summary": "List Pins on board section",
    "pathParams": [
      "board_id",
      "section_id"
    ],
    "queryParams": [
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "brand_accounts/create",
    "method": "POST",
    "path": "/business_access/business_hierarchy/{business_hierarchy_id}/brand_accounts",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Create a Brand Account",
    "pathParams": [
      "business_hierarchy_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "brand_accounts/update",
    "method": "PATCH",
    "path": "/business_access/business_hierarchy/{business_hierarchy_id}/brand_accounts/{brand_account_id}",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Update a Brand Account",
    "pathParams": [
      "brand_account_id",
      "business_hierarchy_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "asset_group/delete",
    "method": "DELETE",
    "path": "/businesses/{business_id}/asset_groups",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Delete asset groups.",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "asset_group/update",
    "method": "PATCH",
    "path": "/businesses/{business_id}/asset_groups",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Update asset groups.",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "asset_group/create",
    "method": "POST",
    "path": "/businesses/{business_id}/asset_groups",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Create a new asset group.",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "business_assets/get",
    "method": "GET",
    "path": "/businesses/{business_id}/assets",
    "tags": [
      "business_access_assets"
    ],
    "summary": "List business assets",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [
      "permissions",
      "child_asset_id",
      "asset_group_id",
      "asset_type",
      "start_index",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "business_asset_members/get",
    "method": "GET",
    "path": "/businesses/{business_id}/assets/{asset_id}/members",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Get members with access to asset",
    "pathParams": [
      "business_id",
      "asset_id"
    ],
    "queryParams": [
      "start_index",
      "fetch_system_users",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "business_asset_partners/get",
    "method": "GET",
    "path": "/businesses/{business_id}/assets/{asset_id}/partners",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Get partners with access to asset",
    "pathParams": [
      "business_id",
      "asset_id"
    ],
    "queryParams": [
      "start_index",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "shared_audiences_for_business/list",
    "method": "GET",
    "path": "/businesses/{business_id}/audiences",
    "tags": [
      "audience_sharing"
    ],
    "summary": "List received audiences for a business",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [
      "order",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "update_business_to_ad_account_shared_audience",
    "method": "PATCH",
    "path": "/businesses/{business_id}/audiences/ad_accounts/shared",
    "tags": [
      "audience_sharing"
    ],
    "summary": "Update audience sharing from a business to ad accounts",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "update_business_to_business_shared_audience",
    "method": "PATCH",
    "path": "/businesses/{business_id}/audiences/businesses/shared",
    "tags": [
      "audience_sharing"
    ],
    "summary": "Update audience sharing between businesses",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "business_account_audiences_shared_accounts/list",
    "method": "GET",
    "path": "/businesses/{business_id}/audiences/shared/accounts",
    "tags": [
      "audience_sharing"
    ],
    "summary": "List accounts with access to an audience owned by a business",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [
      "audience_id",
      "account_type",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "cancel_invites_or_requests",
    "method": "DELETE",
    "path": "/businesses/{business_id}/invites",
    "tags": [
      "business_access_invite"
    ],
    "summary": "Cancel invites/requests",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "get/invites",
    "method": "GET",
    "path": "/businesses/{business_id}/invites",
    "tags": [
      "business_access_invite"
    ],
    "summary": "Get invites/requests",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [
      "is_member",
      "invite_status",
      "invite_type",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "create_membership_or_partnership_invites",
    "method": "POST",
    "path": "/businesses/{business_id}/invites",
    "tags": [
      "business_access_invite"
    ],
    "summary": "Create invites or requests",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "create_asset_invites",
    "method": "POST",
    "path": "/businesses/{business_id}/invites/assets/access",
    "tags": [
      "business_access_invite"
    ],
    "summary": "Update invite/request with an asset permission",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "delete_business_membership",
    "method": "DELETE",
    "path": "/businesses/{business_id}/members",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Terminate business memberships",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "get/business_members",
    "method": "GET",
    "path": "/businesses/{business_id}/members",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Get business members",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [
      "fetch_system_users",
      "assets_summary",
      "business_roles",
      "member_ids",
      "start_index",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "update/business_memberships",
    "method": "PATCH",
    "path": "/businesses/{business_id}/members",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Update member's business role",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "business_member_assets/get",
    "method": "GET",
    "path": "/businesses/{business_id}/members/{member_id}/assets",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Get assets assigned to a member",
    "pathParams": [
      "business_id",
      "member_id"
    ],
    "queryParams": [
      "asset_type",
      "start_index",
      "sort_by",
      "sort_ascending",
      "search_by",
      "search_value",
      "asset_permission_type",
      "ad_account_statuses",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "business_members_asset_access/delete",
    "method": "DELETE",
    "path": "/businesses/{business_id}/members/assets/access",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Delete member access to asset",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "business_members_asset_access/update",
    "method": "PATCH",
    "path": "/businesses/{business_id}/members/assets/access",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Assign/Update member asset permissions",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "delete_business_partners",
    "method": "DELETE",
    "path": "/businesses/{business_id}/partners",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Terminate business partnerships",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "get/business_partners",
    "method": "GET",
    "path": "/businesses/{business_id}/partners",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Get business partners",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [
      "assets_summary",
      "partner_type",
      "partner_ids",
      "start_index",
      "sort_ascending",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "business_partner_asset_access/get",
    "method": "GET",
    "path": "/businesses/{business_id}/partners/{partner_id}/assets",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Get assets assigned to a partner or assets assigned by a partner",
    "pathParams": [
      "business_id",
      "partner_id"
    ],
    "queryParams": [
      "partner_type",
      "asset_type",
      "start_index",
      "sort_by",
      "sort_ascending",
      "search_by",
      "search_value",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "delete_partner_asset_access_handler_impl",
    "method": "DELETE",
    "path": "/businesses/{business_id}/partners/assets",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Delete partner access to asset",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "update_partner_asset_access_handler_impl",
    "method": "PATCH",
    "path": "/businesses/{business_id}/partners/assets",
    "tags": [
      "business_access_assets"
    ],
    "summary": "Assign/Update partner asset permissions",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "asset_access_requests/create",
    "method": "POST",
    "path": "/businesses/{business_id}/requests/assets/access",
    "tags": [
      "business_access_invite"
    ],
    "summary": "Create a request to access an existing partner's assets.",
    "pathParams": [
      "business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "system_user/update",
    "method": "PATCH",
    "path": "/businesses/{business_id}/system_users/{system_user_id}",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "Update a system user information.",
    "pathParams": [
      "business_id",
      "system_user_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "get/business_employers",
    "method": "GET",
    "path": "/businesses/employers",
    "tags": [
      "business_access_relationships"
    ],
    "summary": "List business employers for user",
    "pathParams": [],
    "queryParams": [
      "assets_summary",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "respond_business_access_invites",
    "method": "PATCH",
    "path": "/businesses/invites",
    "tags": [
      "business_access_invite"
    ],
    "summary": "Accept or decline an invite/request",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs/list",
    "method": "GET",
    "path": "/catalogs",
    "tags": [
      "catalogs"
    ],
    "summary": "List catalogs",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs/create",
    "method": "POST",
    "path": "/catalogs",
    "tags": [
      "catalogs"
    ],
    "summary": "Create catalog",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs_local_inventory_items_batch/operate",
    "method": "POST",
    "path": "/catalogs/{catalog_id}/local_inventory_items/batch",
    "tags": [
      "catalog_supplemental"
    ],
    "summary": "Operate on local inventory item batch",
    "pathParams": [
      "catalog_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs_local_inventory_items/post",
    "method": "POST",
    "path": "/catalogs/{catalog_id}/local_inventory_items/query",
    "tags": [
      "catalog_supplemental"
    ],
    "summary": "Get local inventory items (POST)",
    "pathParams": [
      "catalog_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs_local_stores/delete",
    "method": "DELETE",
    "path": "/catalogs/{catalog_id}/local_stores",
    "tags": [
      "catalog_supplemental"
    ],
    "summary": "Delete local stores",
    "pathParams": [
      "catalog_id"
    ],
    "queryParams": [
      "ids",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "catalogs_local_stores/list",
    "method": "GET",
    "path": "/catalogs/{catalog_id}/local_stores",
    "tags": [
      "catalog_supplemental"
    ],
    "summary": "List local stores",
    "pathParams": [
      "catalog_id"
    ],
    "queryParams": [
      "ids",
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs_local_stores/update",
    "method": "PATCH",
    "path": "/catalogs/{catalog_id}/local_stores",
    "tags": [
      "catalog_supplemental"
    ],
    "summary": "Update local stores",
    "pathParams": [
      "catalog_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs_local_stores/create",
    "method": "POST",
    "path": "/catalogs/{catalog_id}/local_stores",
    "tags": [
      "catalog_supplemental"
    ],
    "summary": "Create local stores",
    "pathParams": [
      "catalog_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs_supplemental_items_batch/get",
    "method": "GET",
    "path": "/catalogs/{catalog_id}/supplemental_items/batch/{batch_id}",
    "tags": [
      "catalog_supplemental"
    ],
    "summary": "Get supplemental items batch status",
    "pathParams": [
      "catalog_id",
      "batch_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs/available_filter_values",
    "method": "GET",
    "path": "/catalogs/available_filter_values",
    "tags": [
      "catalogs"
    ],
    "summary": "List available filter values",
    "pathParams": [],
    "queryParams": [
      "catalog_id",
      "feed_id",
      "country",
      "language",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "feeds/list",
    "method": "GET",
    "path": "/catalogs/feeds",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "List feeds",
    "pathParams": [],
    "queryParams": [
      "catalog_id",
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "feeds/create",
    "method": "POST",
    "path": "/catalogs/feeds",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "Create feed",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "feeds/delete",
    "method": "DELETE",
    "path": "/catalogs/feeds/{feed_id}",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "Delete feed",
    "pathParams": [
      "feed_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "feeds/get",
    "method": "GET",
    "path": "/catalogs/feeds/{feed_id}",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "Get feed",
    "pathParams": [
      "feed_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "feeds/update",
    "method": "PATCH",
    "path": "/catalogs/feeds/{feed_id}",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "Update feed",
    "pathParams": [
      "feed_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "feeds/ingest",
    "method": "POST",
    "path": "/catalogs/feeds/{feed_id}/ingest",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "Ingest feed items",
    "pathParams": [
      "feed_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "feed_processing_results/list",
    "method": "GET",
    "path": "/catalogs/feeds/{feed_id}/processing_results",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "List feed processing results",
    "pathParams": [
      "feed_id"
    ],
    "queryParams": [
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "items/post",
    "method": "POST",
    "path": "/catalogs/items",
    "tags": [
      "catalog_items"
    ],
    "summary": "Get catalogs items (POST)",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "items_batch/post",
    "method": "POST",
    "path": "/catalogs/items/batch",
    "tags": [
      "catalog_items"
    ],
    "summary": "Operate on item batch",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "items_batch/get",
    "method": "GET",
    "path": "/catalogs/items/batch/{batch_id}",
    "tags": [
      "catalog_items"
    ],
    "summary": "Get item batch status",
    "pathParams": [
      "batch_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "items_issues/list",
    "method": "GET",
    "path": "/catalogs/processing_results/{processing_result_id}/item_issues",
    "tags": [
      "catalog_feeds"
    ],
    "summary": "List item issues",
    "pathParams": [
      "processing_result_id"
    ],
    "queryParams": [
      "item_numbers",
      "item_validation_issue",
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs_product_groups/list",
    "method": "GET",
    "path": "/catalogs/product_groups",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "List product groups",
    "pathParams": [],
    "queryParams": [
      "id",
      "feed_id",
      "catalog_id",
      "ad_account_id",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs_product_groups/create",
    "method": "POST",
    "path": "/catalogs/product_groups",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "Create product group",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs_product_groups/delete",
    "method": "DELETE",
    "path": "/catalogs/product_groups/{product_group_id}",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "Delete product group",
    "pathParams": [
      "product_group_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "catalogs_product_groups/get",
    "method": "GET",
    "path": "/catalogs/product_groups/{product_group_id}",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "Get product group",
    "pathParams": [
      "product_group_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs_product_groups/update",
    "method": "PATCH",
    "path": "/catalogs/product_groups/{product_group_id}",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "Update single product group",
    "pathParams": [
      "product_group_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "catalogs_product_groups/product_counts_get",
    "method": "GET",
    "path": "/catalogs/product_groups/{product_group_id}/product_counts",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "Get product counts",
    "pathParams": [
      "product_group_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs_product_group_pins/list",
    "method": "GET",
    "path": "/catalogs/product_groups/{product_group_id}/products",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "List products by product group",
    "pathParams": [
      "product_group_id"
    ],
    "queryParams": [
      "ad_account_id",
      "pin_metrics",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "catalogs_product_groups/delete_many",
    "method": "DELETE",
    "path": "/catalogs/product_groups/multiple",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "Delete product groups",
    "pathParams": [],
    "queryParams": [
      "id",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "catalogs_product_groups/create_many",
    "method": "POST",
    "path": "/catalogs/product_groups/multiple",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "Create product groups",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "products_by_product_group_filter/list",
    "method": "POST",
    "path": "/catalogs/products/get_by_product_group_filters",
    "tags": [
      "catalog_product_groups"
    ],
    "summary": "List products by filter",
    "pathParams": [],
    "queryParams": [
      "bookmark",
      "page_size",
      "ad_account_id",
      "pin_metrics"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "reports/get",
    "method": "GET",
    "path": "/catalogs/reports",
    "tags": [
      "catalog_reports"
    ],
    "summary": "Get catalogs report",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "token"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "reports/create",
    "method": "POST",
    "path": "/catalogs/reports",
    "tags": [
      "catalog_reports"
    ],
    "summary": "Build catalogs report",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "reports/stats",
    "method": "GET",
    "path": "/catalogs/reports/stats",
    "tags": [
      "catalog_reports"
    ],
    "summary": "List report stats",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "parameters",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "integrations/get_list",
    "method": "GET",
    "path": "/integrations",
    "tags": [
      "integrations"
    ],
    "summary": "Get integration metadata list",
    "pathParams": [],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "integrations/get_by_id",
    "method": "GET",
    "path": "/integrations/{id}",
    "tags": [
      "integrations"
    ],
    "summary": "Get integration metadata",
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "integrations_commerce/post",
    "method": "POST",
    "path": "/integrations/commerce",
    "tags": [
      "integrations"
    ],
    "summary": "Create commerce integration",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "integrations_commerce/del",
    "method": "DELETE",
    "path": "/integrations/commerce/{external_business_id}",
    "tags": [
      "integrations"
    ],
    "summary": "Delete commerce integration",
    "pathParams": [
      "external_business_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "integrations_commerce/get",
    "method": "GET",
    "path": "/integrations/commerce/{external_business_id}",
    "tags": [
      "integrations"
    ],
    "summary": "Get commerce integration",
    "pathParams": [
      "external_business_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "integrations_commerce/patch",
    "method": "PATCH",
    "path": "/integrations/commerce/{external_business_id}",
    "tags": [
      "integrations"
    ],
    "summary": "Update commerce integration",
    "pathParams": [
      "external_business_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "integrations_logs/post",
    "method": "POST",
    "path": "/integrations/logs",
    "tags": [
      "integrations"
    ],
    "summary": "Receives batched logs from integration applications.",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "media/list",
    "method": "GET",
    "path": "/media",
    "tags": [
      "media"
    ],
    "summary": "List media uploads",
    "pathParams": [],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "media/create",
    "method": "POST",
    "path": "/media",
    "tags": [
      "media"
    ],
    "summary": "Register media upload",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "media/get",
    "method": "GET",
    "path": "/media/{media_id}",
    "tags": [
      "media"
    ],
    "summary": "Get media upload details",
    "pathParams": [
      "media_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "notification/post",
    "method": "POST",
    "path": "/notifications",
    "tags": [
      "notification"
    ],
    "summary": "Receive notifications from external partners.",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "oauth/conversion_token",
    "method": "POST",
    "path": "/oauth/conversion_token",
    "tags": [
      "oauth"
    ],
    "summary": "Generate OAuth access token for conversion API",
    "pathParams": [],
    "queryParams": [],
    "hasBody": false,
    "status": "excluded",
    "reason": "Authentication is handled by the server, not by the caller. Exposing the token endpoints would let a caller mint or revoke the credentials the server is running on. Set PINTEREST_ACCESS_TOKEN instead.",
    "action": "write"
  },
  {
    "id": "oauth/token",
    "method": "POST",
    "path": "/oauth/token",
    "tags": [
      "oauth"
    ],
    "summary": "Generate OAuth access token",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "excluded",
    "reason": "Authentication is handled by the server, not by the caller. Exposing the token endpoints would let a caller mint or revoke the credentials the server is running on. Set PINTEREST_ACCESS_TOKEN instead.",
    "action": "write"
  },
  {
    "id": "token/revoke",
    "method": "POST",
    "path": "/oauth/token/revoke",
    "tags": [
      "oauth"
    ],
    "summary": "Revoke a token",
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "status": "excluded",
    "reason": "Authentication is handled by the server, not by the caller. Exposing the token endpoints would let a caller mint or revoke the credentials the server is running on. Set PINTEREST_ACCESS_TOKEN instead.",
    "action": "write"
  },
  {
    "id": "pins/list",
    "method": "GET",
    "path": "/pins",
    "tags": [
      "pins"
    ],
    "summary": "List Pins",
    "pathParams": [],
    "queryParams": [
      "pin_filter",
      "pin_metrics",
      "include_protected_pins",
      "pin_type",
      "creative_types",
      "ad_account_id",
      "domain",
      "domains",
      "include_product_tag_obj",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "pins/create",
    "method": "POST",
    "path": "/pins",
    "tags": [
      "pins"
    ],
    "summary": "Create Pin",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "pins/delete",
    "method": "DELETE",
    "path": "/pins/{pin_id}",
    "tags": [
      "pins"
    ],
    "summary": "Delete Pin",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "pins/get",
    "method": "GET",
    "path": "/pins/{pin_id}",
    "tags": [
      "pins"
    ],
    "summary": "Get Pin",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [
      "ad_account_id",
      "pin_metrics"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "pins/update",
    "method": "PATCH",
    "path": "/pins/{pin_id}",
    "tags": [
      "pins"
    ],
    "summary": "Update Pin",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "pins/analytics",
    "method": "GET",
    "path": "/pins/{pin_id}/analytics",
    "tags": [
      "pins"
    ],
    "summary": "Get Pin analytics",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [
      "start_date",
      "end_date",
      "app_types",
      "metric_types",
      "split_field",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "product_tags/list",
    "method": "GET",
    "path": "/pins/{pin_id}/product_tags",
    "tags": [
      "product_tags"
    ],
    "summary": "Get product tags for pin",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "product_tags/bulk_add",
    "method": "POST",
    "path": "/pins/{pin_id}/product_tags",
    "tags": [
      "product_tags"
    ],
    "summary": "Add product tags to pin",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "product_tags/bulk_delete",
    "method": "POST",
    "path": "/pins/{pin_id}/product_tags/bulk-delete",
    "tags": [
      "product_tags"
    ],
    "summary": "Delete product tags from pin",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "pins/save",
    "method": "POST",
    "path": "/pins/{pin_id}/save",
    "tags": [
      "pins"
    ],
    "summary": "Save Pin",
    "pathParams": [
      "pin_id"
    ],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "multi_pins/analytics",
    "method": "GET",
    "path": "/pins/analytics",
    "tags": [
      "pins"
    ],
    "summary": "Get multiple Pin analytics",
    "pathParams": [],
    "queryParams": [
      "pin_ids",
      "start_date",
      "end_date",
      "app_types",
      "metric_types",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "ad_account_countries/get",
    "method": "GET",
    "path": "/resources/ad_account_countries",
    "tags": [
      "resources"
    ],
    "summary": "Get ad accounts countries",
    "pathParams": [],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "delivery_metrics/get",
    "method": "GET",
    "path": "/resources/delivery_metrics",
    "tags": [
      "resources"
    ],
    "summary": "Get available metrics' definitions",
    "pathParams": [],
    "queryParams": [
      "report_type"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "lead_form_questions/get",
    "method": "GET",
    "path": "/resources/lead_form_questions",
    "tags": [
      "resources"
    ],
    "summary": "Get lead form questions",
    "pathParams": [],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "metrics_ready_state/get",
    "method": "GET",
    "path": "/resources/metrics_ready_state",
    "tags": [
      "resources"
    ],
    "summary": "Get metrics ready state",
    "pathParams": [],
    "queryParams": [
      "date"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "targeting_options/get",
    "method": "GET",
    "path": "/resources/targeting/{targeting_type}",
    "tags": [
      "resources"
    ],
    "summary": "Get targeting options",
    "pathParams": [
      "targeting_type"
    ],
    "queryParams": [
      "ad_account_id",
      "client_id",
      "oauth_signature",
      "timestamp"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "interest_targeting_options/get",
    "method": "GET",
    "path": "/resources/targeting/interests/{interest_id}",
    "tags": [
      "resources"
    ],
    "summary": "Get interest details",
    "pathParams": [
      "interest_id"
    ],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "search_user_boards/get",
    "method": "GET",
    "path": "/search/boards",
    "tags": [
      "search"
    ],
    "summary": "Search user's boards",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "query",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "search_partner_pins",
    "method": "GET",
    "path": "/search/partner/pins",
    "tags": [
      "search"
    ],
    "summary": "Search pins by a given search term",
    "pathParams": [],
    "queryParams": [
      "term",
      "country_code",
      "bookmark",
      "locale",
      "limit"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "search_user_pins/list",
    "method": "GET",
    "path": "/search/pins",
    "tags": [
      "search"
    ],
    "summary": "Search user's Pins",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "query",
      "bookmark"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "terms_related/list",
    "method": "GET",
    "path": "/terms/related",
    "tags": [
      "terms"
    ],
    "summary": "List related terms",
    "pathParams": [],
    "queryParams": [
      "terms"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "terms_suggested/list",
    "method": "GET",
    "path": "/terms/suggested",
    "tags": [
      "terms"
    ],
    "summary": "List suggested terms",
    "pathParams": [],
    "queryParams": [
      "term",
      "limit"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "trends_editorial_articles/list",
    "method": "GET",
    "path": "/trends/editorial_articles",
    "tags": [
      "trends"
    ],
    "summary": "Returns editorial articles for a given region",
    "pathParams": [],
    "queryParams": [
      "region"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "trending_keywords/list",
    "method": "GET",
    "path": "/trends/keywords/{region}/top/{trend_type}",
    "tags": [
      "keywords"
    ],
    "summary": "List trending keywords",
    "pathParams": [
      "region",
      "trend_type"
    ],
    "queryParams": [
      "interests",
      "genders",
      "ages",
      "include_keywords",
      "normalize_against_group",
      "limit",
      "include_demographics"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "trends_product_categories_details/list",
    "method": "GET",
    "path": "/trends/product_categories/details",
    "tags": [
      "trends"
    ],
    "summary": "Get product category details",
    "pathParams": [],
    "queryParams": [
      "product_categories",
      "region",
      "lookback_window",
      "engagement_type"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "trends_product_categories_trending/list",
    "method": "GET",
    "path": "/trends/product_categories/trending",
    "tags": [
      "trends"
    ],
    "summary": "Get a list of growing Shopping Product Categories",
    "pathParams": [],
    "queryParams": [
      "region",
      "verticals",
      "ages",
      "genders",
      "engagement_type"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "trends_featured_topics/list",
    "method": "GET",
    "path": "/trends/topics/featured",
    "tags": [
      "trends"
    ],
    "summary": "Get featured topics",
    "pathParams": [],
    "queryParams": [
      "interest",
      "region"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "user_account/get",
    "method": "GET",
    "path": "/user_account",
    "tags": [
      "user_account"
    ],
    "summary": "Get user account",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "user_account/analytics",
    "method": "GET",
    "path": "/user_account/analytics",
    "tags": [
      "user_account"
    ],
    "summary": "Get user account analytics",
    "pathParams": [],
    "queryParams": [
      "start_date",
      "end_date",
      "from_claimed_content",
      "pin_format",
      "app_types",
      "content_type",
      "source",
      "metric_types",
      "split_field",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "user_account/analytics/top_pins",
    "method": "GET",
    "path": "/user_account/analytics/top_pins",
    "tags": [
      "user_account"
    ],
    "summary": "Get user account top pins analytics",
    "pathParams": [],
    "queryParams": [
      "start_date",
      "end_date",
      "sort_by",
      "from_claimed_content",
      "pin_format",
      "app_types",
      "content_type",
      "source",
      "metric_types",
      "num_of_pins",
      "created_in_last_n_days",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "user_account/analytics/top_video_pins",
    "method": "GET",
    "path": "/user_account/analytics/top_video_pins",
    "tags": [
      "user_account"
    ],
    "summary": "Get user account top video pins analytics",
    "pathParams": [],
    "queryParams": [
      "start_date",
      "end_date",
      "sort_by",
      "from_claimed_content",
      "pin_format",
      "app_types",
      "content_type",
      "source",
      "metric_types",
      "num_of_pins",
      "created_in_last_n_days",
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "linked_business_accounts/get",
    "method": "GET",
    "path": "/user_account/businesses",
    "tags": [
      "user_account"
    ],
    "summary": "List linked businesses",
    "pathParams": [],
    "queryParams": [],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "followers/list",
    "method": "GET",
    "path": "/user_account/followers",
    "tags": [
      "user_account"
    ],
    "summary": "List followers",
    "pathParams": [],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "user_following/get",
    "method": "GET",
    "path": "/user_account/following",
    "tags": [
      "user_account"
    ],
    "summary": "List following",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "explicit_following",
      "feed_type",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "follow_user/update",
    "method": "POST",
    "path": "/user_account/following/{username}",
    "tags": [
      "user_account"
    ],
    "summary": "Follow user",
    "pathParams": [
      "username"
    ],
    "queryParams": [],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "boards_user_follows/list",
    "method": "GET",
    "path": "/user_account/following/boards",
    "tags": [
      "user_account"
    ],
    "summary": "List following boards",
    "pathParams": [],
    "queryParams": [
      "ad_account_id",
      "explicit_following",
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "unverify_website/delete",
    "method": "DELETE",
    "path": "/user_account/websites",
    "tags": [
      "user_account"
    ],
    "summary": "Unverify website",
    "pathParams": [],
    "queryParams": [
      "website"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "destructive"
  },
  {
    "id": "user_websites/get",
    "method": "GET",
    "path": "/user_account/websites",
    "tags": [
      "user_account"
    ],
    "summary": "Get user websites",
    "pathParams": [],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "verify_website/update",
    "method": "POST",
    "path": "/user_account/websites",
    "tags": [
      "user_account"
    ],
    "summary": "Verify website",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": true,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "write"
  },
  {
    "id": "website_verification/get",
    "method": "GET",
    "path": "/user_account/websites/verification",
    "tags": [
      "user_account"
    ],
    "summary": "Get user verification code for website claiming",
    "pathParams": [],
    "queryParams": [
      "ad_account_id"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  },
  {
    "id": "user_account/followed_interests",
    "method": "GET",
    "path": "/users/{username}/interests/follow",
    "tags": [
      "user_account"
    ],
    "summary": "List following interests",
    "pathParams": [
      "username"
    ],
    "queryParams": [
      "bookmark",
      "page_size"
    ],
    "hasBody": false,
    "status": "covered",
    "tool": "pinterest_call",
    "action": "read"
  }
];

export const OPERATIONS_BY_ID = new Map(OPERATIONS.map((o) => [o.id, o]));
