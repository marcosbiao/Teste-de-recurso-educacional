import type { Env } from '../types/env';
import { json } from '../http/response';

export function health(_request: Request, env: Env, origin?: string): Response {
  return json({ status: 'ok', service: 'desafio-guiado-analysis', environment: env.ENVIRONMENT || 'unknown' }, 200, origin);
}
