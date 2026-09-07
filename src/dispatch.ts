/**
 * The Pinterest dispatcher.
 *
 * Generic behaviour lives in the shared Dispatcher. This adds the default ad
 * account: 148 of Pinterest's 266 operations are scoped to
 * /ad_accounts/{ad_account_id}/..., and anyone using them has one. Set
 * PINTEREST_AD_ACCOUNT_ID and it is filled in when omitted; an explicit value
 * always wins.
 */

import { Dispatcher, ToolError, type HttpClient } from "@nasdigital/mcp-server-core";
import { OPERATIONS, type CataloguedOperation } from "./generated/operations.js";

export const COVERED = OPERATIONS.filter((o) => o.status === "covered");

export class PinterestDispatcher extends Dispatcher<CataloguedOperation> {
  constructor(
    http: HttpClient,
    private readonly defaultAdAccountId?: string,
  ) {
    super(http, OPERATIONS, "pinterest_list_operations");
  }

  override async call(
    id: string,
    params: Record<string, unknown> = {},
    body?: unknown,
  ): Promise<unknown> {
    const op = this.resolve(id);
    const filled = { ...params };

    if (op.pathParams.includes("ad_account_id") && !filled.ad_account_id) {
      if (!this.defaultAdAccountId) {
        throw new ToolError(
          `${id} is scoped to an ad account, so it needs ad_account_id. Either pass it, ` +
            `or set PINTEREST_AD_ACCOUNT_ID so it is filled in automatically. ` +
            `The operation "ad_accounts/list" lists the ad accounts this token can reach.`,
        );
      }
      filled.ad_account_id = this.defaultAdAccountId;
    }

    return super.call(id, filled, body);
  }
}

export function createDispatcher(http: HttpClient, defaultAdAccountId?: string) {
  return new PinterestDispatcher(http, defaultAdAccountId);
}
