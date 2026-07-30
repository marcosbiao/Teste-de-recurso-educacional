import { QWEN_MODEL, buildAnalysisMessages } from '../ai/buildAnalysisPrompt';
import { describeWorkersAiResponse, extractTextFromWorkersAiResponse, parseQwenResponse } from '../ai/parseQwenResponse';
import { getInternalChallenge } from '../catalog/challengeAnalysisCatalog';
import { HttpError } from '../http/errors';
import { json } from '../http/response';
import type { Env } from '../types/env';
import { validateWorkerAnalysis } from '../validation/validateAnalysisResult';

const FUEL_CODE = '#include <stdio.h>\nint main() { float distancia, consumo, preco, litros, valor; scanf("%f", &distancia); scanf("%f", &consumo); scanf("%f", &preco); litros = distancia / consumo; valor = litros * preco; return 0; }';
const TIMEOUT_MS = 35_000;
function id(): string { return crypto.randomUUID(); }
async function timeout<T>(task: Promise<T>): Promise<T> { let timer: ReturnType<typeof setTimeout> | undefined; try { return await Promise.race([task, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new HttpError(504, 'TIMEOUT', 'A análise excedeu o tempo permitido.')), TIMEOUT_MS); })]); } finally { if (timer) clearTimeout(timer); } }

/** Development-only fixed pipeline probe; it has no auth, persistence or fallback. */
export async function analyzePipelineDebug(request: Request, env: Env): Promise<Response> {
  const requestId = id(); const startedAt = Date.now(); let lastCompletedStage = 'worker_received'; let raw: unknown; let shape: ReturnType<typeof describeWorkersAiResponse> | undefined;
  try {
    const challenge = getInternalChallenge('cci01-custo-viagem');
    if (!challenge) throw new HttpError(404, 'CHALLENGE_NOT_FOUND', 'O desafio interno de diagnóstico não existe.');
    lastCompletedStage = 'challenge_loaded';
    const noThink = new URL(request.url).searchParams.get('mode') === 'no_think';
    const messages = buildAnalysisMessages(challenge, { challengeId: challenge.id, studentCode: FUEL_CODE });
    if (noThink) messages[1] = { ...messages[1], content: `${messages[1].content}\n/no_think` };
    lastCompletedStage = 'prompt_built';
    raw = await timeout(env.AI.run(QWEN_MODEL, { messages, temperature: 0.2, top_p: 0.9, max_tokens: 1800 } as never));
    shape = describeWorkersAiResponse(raw); lastCompletedStage = 'qwen_completed';
    if (shape.finishReason === 'length') throw new HttpError(502, 'MODEL_OUTPUT_TRUNCATED', 'O modelo atingiu o limite de saída antes de concluir.');
    const text = extractTextFromWorkersAiResponse(raw); shape = describeWorkersAiResponse(raw, text); lastCompletedStage = 'qwen_text_extracted';
    const parsed = parseQwenResponse(raw); lastCompletedStage = 'json_parsed';
    const result = validateWorkerAnalysis(parsed, challenge, FUEL_CODE); lastCompletedStage = 'pedagogy_validated';
    const issue = result.studentFeedback.primaryIssue;
    return json({ success: true, requestId, lastCompletedStage, model: QWEN_MODEL, durationMs: Date.now() - startedAt, noThink, ...shape, criteriaCountExpected: challenge.expectedEvidence.length, criteriaCountReceived: (result.criteriaAssessment || []).length, primaryCriterionId: issue.criterionId || null, hasIssue: issue.hasIssue });
  } catch (error: unknown) {
    const typed = error instanceof HttpError ? error : new HttpError(500, 'INTERNAL_ERROR', 'A execução do pipeline de diagnóstico falhou.');
    return json({ success: false, requestId, lastCompletedStage, failedStage: lastCompletedStage === 'qwen_completed' ? 'response_extraction' : lastCompletedStage, errorCode: typed.code, httpStatus: typed.status, durationMs: Date.now() - startedAt, finishReason: shape?.finishReason, contentLength: shape?.extractedTextLength, reasoningContentPresent: shape?.hasReasoningContent, choicesCount: shape?.choicesCount }, typed.status);
  }
}
