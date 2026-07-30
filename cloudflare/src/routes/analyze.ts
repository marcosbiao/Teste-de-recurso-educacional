import { assertAllowedOrigin } from '../http/cors';
import { HttpError } from '../http/errors';
import { errorResponse, json } from '../http/response';
import { verifyFirebaseToken } from '../auth/verifyFirebaseToken';
import { getInternalChallenge } from '../catalog/challengeAnalysisCatalog';
import { runQwenAnalysis } from '../ai/qwenAnalysisService';
import { validateAnalyzeRequest } from '../validation/validateRequest';
import { ANALYSIS_LIMITS } from '../../../src/domain/analysis/analysisLimits';
import type { Env } from '../types/env';

function requestId(request: Request): string { const value = request.headers.get("X-Analysis-Request-Id")?.trim(); return value && /^[A-Za-z0-9_-]{8,100}$/.test(value) ? value : crypto.randomUUID(); }
function devStage(env: Env, requestId: string, stage: string, metadata: Record<string, unknown> = {}): void { if (env.ENVIRONMENT === 'development') console.info('[analysis-stage]', { requestId, stage, ...metadata }); }

export async function withinWorkerTimeout<T>(task: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new HttpError(504, 'TIMEOUT', 'A análise excedeu o tempo permitido.')), ANALYSIS_LIMITS.workerTimeoutMs); }),
    ]);
  } finally { if (timer) clearTimeout(timer); }
}

export async function analyze(request: Request, env: Env): Promise<Response> {
  const id = requestId(request);
  const receivedAt = Date.now();
  let origin: string | undefined;
  try {
    origin = assertAllowedOrigin(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...((await import('../http/cors')).corsHeaders(origin)) } });
    if (request.method !== 'POST') throw new HttpError(405, 'INVALID_REQUEST', 'Método não permitido.');
    const identity = await verifyFirebaseToken(request, env);
    devStage(env, id, 'auth_ok', {});
    const rate = await env.ANALYSIS_RATE_LIMITER.limit({ key: identity.uid });
    if (!rate.success) throw new HttpError(429, 'RATE_LIMITED', 'O limite temporário de análises foi atingido.', 60);
    const payload = await validateAnalyzeRequest(request);
    devStage(env, id, 'request_validated', { studentCodeLength: payload.studentCode.length, requestBodyBytes: payload.requestBodyBytes });
    const challenge = getInternalChallenge(payload.challengeId);
    if (!challenge) throw new HttpError(404, 'CHALLENGE_NOT_FOUND', 'O desafio solicitado não existe.');
    devStage(env, id, 'challenge_loaded', { challengeId: challenge.id });
    const startedAt = Date.now();
    devStage(env, id, 'prompt_built', { challengeId: challenge.id });
    const result = await withinWorkerTimeout(runQwenAnalysis(env, challenge, payload, id));
    devStage(env, id, 'response_ready', { challengeId: challenge.id });
    const durationMs = Date.now() - startedAt;
    if (env.ENVIRONMENT === 'development') console.info('[analysis-worker]', { requestId: id, challengeId: challenge.id, criterionId: result.studentFeedback.primaryIssue.criterionId, analysisMode: result.analysisMode, durationMs, fallbackUsed: false, studentCodeLength: payload.studentCode.length, requestBodyBytes: payload.requestBodyBytes });
    return json({ result: { ...result, requestId: id, durationMs, modelCalls: 1 }, requestId: id, modelUsed: result.modelUsed, analysisMode: 'cloudflare_qwen', durationMs }, 200, origin);
  } catch (error) {
    const typed = error instanceof HttpError ? error : new HttpError(500, 'INTERNAL_ERROR', 'Não foi possível concluir a análise.');
    if (env.ENVIRONMENT === 'development') console.info('[analysis-worker]', { requestId: id, code: typed.code, status: typed.status, durationMs: Date.now() - receivedAt, ...typed.diagnostics });
    return errorResponse(typed.code, typed.message, id, typed.status, origin, typed.retryAfterSeconds);
  }
}
