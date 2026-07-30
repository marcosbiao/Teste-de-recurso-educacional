import { toSafeTechnicalError } from '../ai/qwenAnalysisService';
import { QWEN_MODEL } from '../ai/buildAnalysisPrompt';
import { describeWorkersAiResponse, extractTextFromWorkersAiResponse, parseQwenResponse, type WorkersAiResponseShape } from '../ai/parseQwenResponse';
import { HttpError } from '../http/errors';
import { json } from '../http/response';
import type { Env } from '../types/env';

const SMOKE_TIMEOUT_MS = 30_000;
function requestId(): string { return crypto.randomUUID(); }
async function withTimeout<T>(task: Promise<T>): Promise<T> { let timer: ReturnType<typeof setTimeout> | undefined; try { return await Promise.race([task, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new HttpError(504, 'TIMEOUT', 'O smoke test excedeu o tempo permitido.')), SMOKE_TIMEOUT_MS); })]); } finally { if (timer) clearTimeout(timer); } }
function record(value: unknown): Record<string, unknown> | undefined { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined; }

/** Development-only probe for Worker → AI binding → Qwen → shared parser. */
export async function qwenSmoke(_request: Request, env: Env): Promise<Response> {
  const id = requestId(); const startedAt = Date.now(); let stage = 'workers_ai_inference'; let raw: unknown; let shape: WorkersAiResponseShape | undefined;
  try {
    raw = await withTimeout(env.AI.run(QWEN_MODEL, { messages: [{ role: 'user', content: 'Responda apenas com o JSON {"status":"ok"}. /no_think' }], temperature: 0, max_tokens: 100 } as never));
    shape = describeWorkersAiResponse(raw);
    stage = 'response_extraction'; const text = extractTextFromWorkersAiResponse(raw); shape = describeWorkersAiResponse(raw, text);
    stage = 'json_parse'; const parsed = record(parseQwenResponse(raw));
    if (!parsed) throw new HttpError(502, 'MODEL_JSON_INVALID', 'O smoke test não encontrou um objeto JSON.');
    const parsedStatus = typeof parsed.status === 'string' ? parsed.status : undefined;
    if (env.ENVIRONMENT === 'development') console.info('[qwen-smoke]', { requestId: id, model: QWEN_MODEL, stage: 'completed', durationMs: Date.now() - startedAt, ...shape });
    return json({ success: true, requestId: id, model: QWEN_MODEL, durationMs: Date.now() - startedAt, ...shape, parserSucceeded: true, parsedStatus });
  } catch (error: unknown) {
    const typed = error instanceof HttpError ? error : new HttpError(503, 'MODEL_UNAVAILABLE', 'Não foi possível executar o smoke test do modelo.');
    if (env.ENVIRONMENT === 'development') console.info('[qwen-smoke]', { requestId: id, model: QWEN_MODEL, stage, durationMs: Date.now() - startedAt, ...shape, error: toSafeTechnicalError(typed) });
    return json({ success: false, requestId: id, code: typed.code, safeMessage: typed.message, stage, durationMs: Date.now() - startedAt, ...shape }, typed.status);
  }
}
