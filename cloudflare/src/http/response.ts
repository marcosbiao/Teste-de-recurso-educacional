import { corsHeaders } from './cors';
import type { AnalysisErrorCode } from './errors';

export function json(body: unknown, status = 200, origin?: string, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin), ...extraHeaders },
  });
}

export function errorResponse(code: AnalysisErrorCode, message: string, requestId: string, status: number, origin?: string, retryAfterSeconds?: number): Response {
  const headers: HeadersInit = retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : {};
  return json({ error: { code, message, requestId, retryAfterSeconds } }, status, origin, headers);
}
