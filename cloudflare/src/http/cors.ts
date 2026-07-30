import { HttpError } from './errors';
import type { Env } from '../types/env';

function allowedOrigins(env: Env): Set<string> {
  return new Set((env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean));
}

export function assertAllowedOrigin(request: Request, env: Env): string | undefined {
  const origin = request.headers.get('Origin') || undefined;
  if (!origin) return undefined;
  if (!allowedOrigins(env).has(origin)) throw new HttpError(403, 'FORBIDDEN_ORIGIN', 'A origem da solicitação não é permitida.');
  return origin;
}

export function corsHeaders(origin?: string): HeadersInit {
  if (!origin) return { Vary: 'Origin' };
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Analysis-Request-Id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}
