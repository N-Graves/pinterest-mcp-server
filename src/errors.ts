/**
 * Pinterest's own explanation of a failure, when it is worth passing on.
 *
 * The shared HTTP layer summarises every failure by status alone, because
 * provider bodies often echo request context. Pinterest's bodies are a small
 * `{code, message}` object, and the message is frequently the only way to
 * know what to do. A token missing a scope, for instance, comes back as a
 * 401 — which the summary calls "rejected the credentials", sending you off to
 * replace a perfectly good token — while Pinterest's message says exactly
 * which scope is missing: "Missing: ['boards:write']".
 *
 * So the message field alone is appended: never the whole body, capped in
 * length, and with anything that looks like a credential redacted.
 */

import { HttpError, ToolError } from "@nasdigitaluk/mcp-server-core";

const MAX_MESSAGE = 300;

export function explainPinterestError(err: unknown): unknown {
  if (!(err instanceof HttpError) || !err.providerBody) return err;

  let message: unknown;
  try {
    message = (JSON.parse(err.providerBody) as { message?: unknown })?.message;
  } catch {
    return err;
  }
  if (typeof message !== "string" || !message.trim()) return err;

  const clean = message
    .replace(/\b(?:Bearer\s+)?[A-Za-z0-9_.-]{32,}\b/g, "[redacted]")
    .slice(0, MAX_MESSAGE);
  return new ToolError(`${err.message} Pinterest says: ${clean}`);
}

/** Wrap a tool handler so Pinterest's explanation reaches the caller. */
export function withPinterestErrors<A, R>(fn: (args: A) => Promise<R>): (args: A) => Promise<R> {
  return async (args: A) => {
    try {
      return await fn(args);
    } catch (err) {
      throw explainPinterestError(err);
    }
  };
}
