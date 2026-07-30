import { analyze } from './routes/analyze';
import { health } from './routes/health';
import { qwenSmoke } from './routes/qwenSmoke';
import { analyzePipelineDebug } from './routes/analyzePipelineDebug';
import { assertAllowedOrigin, corsHeaders } from './http/cors';
import { errorResponse } from './http/response';
import { HttpError } from './http/errors';
import type { Env } from './types/env';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET') {
      try { return health(request, env, assertAllowedOrigin(request, env)); }
      catch (error) { const typed = error as HttpError; return errorResponse(typed.code, typed.message, crypto.randomUUID(), typed.status); }
    }
    if (url.pathname === '/debug/qwen-smoke' && env.ENVIRONMENT === 'development' && request.method === 'GET') return qwenSmoke(request, env);
    if (url.pathname === '/debug/analyze-pipeline' && env.ENVIRONMENT === 'development' && request.method === 'POST') return analyzePipelineDebug(request, env);
    if (url.pathname === '/api/analyze') return analyze(request, env);
    if (request.method === 'OPTIONS') {
      try { return new Response(null, { status: 204, headers: corsHeaders(assertAllowedOrigin(request, env)) }); }
      catch (error) { const typed = error as HttpError; return errorResponse(typed.code, typed.message, crypto.randomUUID(), typed.status); }
    }
    return errorResponse('INVALID_REQUEST', 'Rota não encontrada.', crypto.randomUUID(), 404);
  },
};
