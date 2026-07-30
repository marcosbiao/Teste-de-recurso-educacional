import { createAnalysisResult } from '../../../src/domain/pedagogicalDomain';
import type { AnalysisResult } from '../../../src/domain/analysis/analysisTypes';
import type { Env } from '../types/env';
import type { InternalChallenge } from '../catalog/challengeAnalysisCatalog';
import type { WorkerAnalyzeRequest } from '../validation/validateRequest';
import { ANALYSIS_LIMITS } from '../../../src/domain/analysis/analysisLimits';
import { HttpError } from '../http/errors';
import { buildAnalysisMessages, QWEN_MODEL } from './buildAnalysisPrompt';
import { describeWorkersAiResponse, extractTextFromWorkersAiResponse, parseQwenResponse } from './parseQwenResponse';
import { validateWorkerAnalysis } from '../validation/validateAnalysisResult';

export function toSafeTechnicalError(error: unknown): Record<string, unknown> {
  if (error instanceof HttpError) return { name: error.name, code: error.code, status: error.status, message: error.message.slice(0, 240) };
  if (error instanceof Error) return { name: error.name, message: 'Erro não classificado do binding ou runtime.' };
  if (error && typeof error === 'object') {
    const value = error as Record<string, unknown>;
    return { name: typeof value.name === 'string' ? value.name : 'UnknownError', code: typeof value.code === 'string' || typeof value.code === 'number' ? value.code : undefined, status: typeof value.status === 'number' ? value.status : undefined, message: typeof value.message === 'string' ? 'Erro estruturado do binding ou runtime.' : undefined };
  }
  return { name: typeof error };
}

function devLog(env: Env, event: string, metadata: Record<string, unknown>): void {
  if (env.ENVIRONMENT === 'development') console.info('[qwen-analysis]', { event, ...metadata });
}

export async function runQwenAnalysis(env: Env, challenge: InternalChallenge, request: WorkerAnalyzeRequest, requestId?: string): Promise<AnalysisResult> {
  const startedAt = Date.now();
  const messages = buildAnalysisMessages(challenge, request);
  const promptCharacterLength = messages.reduce((total, message) => total + message.content.length, 0);
  const safeMetrics = { requestId, challengeId: challenge.id, model: QWEN_MODEL, studentCodeLength: request.studentCode.length, requestBodyBytes: request.requestBodyBytes, promptCharacterLength };
  let raw: unknown;
  devLog(env, 'qwen_started', safeMetrics);
  try {
    raw = await env.AI.run(QWEN_MODEL, { messages, temperature: 0.2, top_p: 0.9, max_tokens: ANALYSIS_LIMITS.maxModelOutputTokens } as never);
  } catch (error: unknown) {
    devLog(env, 'inference_failed', { ...safeMetrics, durationMs: Date.now() - startedAt, error: toSafeTechnicalError(error) });
    throw new HttpError(503, 'MODEL_UNAVAILABLE', 'O modelo de análise está indisponível no momento.');
  }
  devLog(env, 'qwen_completed', { ...safeMetrics, durationMs: Date.now() - startedAt });
  try {
    const initialShape = describeWorkersAiResponse(raw);
    if (initialShape.finishReason === 'length') throw new HttpError(502, 'MODEL_OUTPUT_TRUNCATED', 'O modelo atingiu o limite de saída antes de concluir.');
    let extractedText: string | undefined;
    try { extractedText = extractTextFromWorkersAiResponse(raw); }
    finally { devLog(env, 'response_shape', { ...safeMetrics, durationMs: Date.now() - startedAt, maxTokensConfigured: ANALYSIS_LIMITS.maxModelOutputTokens, ...describeWorkersAiResponse(raw, extractedText) }); }
    const parsed = parseQwenResponse(raw);
    devLog(env, 'json_parsed', safeMetrics);
    const payload = validateWorkerAnalysis(parsed, challenge, request.studentCode);
    devLog(env, 'pedagogy_validated', safeMetrics);
    return createAnalysisResult({
      ...payload,
      analysisMode: 'cloudflare_qwen', analysisStatus: 'success', modelUsed: QWEN_MODEL, promptVersion: 'cloudflare-qwen-v1',
      shouldPersistAttempt: true, shouldCountAnalysisRequest: true,
    });
  } catch (error: unknown) {
    const typed = error instanceof HttpError ? error : new HttpError(500, 'INTERNAL_ERROR', 'Não foi possível validar a resposta do modelo.');
    devLog(env, 'response_failed', { ...safeMetrics, durationMs: Date.now() - startedAt, error: toSafeTechnicalError(typed) });
    throw typed;
  }
}
