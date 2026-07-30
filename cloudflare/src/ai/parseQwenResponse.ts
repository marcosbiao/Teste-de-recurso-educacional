import { AnalysisNormalizationError, normalizeAnalysisResponse } from '../../../src/domain/analysis/normalizeAnalysisResponse';
import { HttpError } from '../http/errors';

interface WorkersAiChoiceLike {
  message?: { content?: unknown };
  text?: unknown;
}
interface WorkersAiOutputLike {
  content?: Array<{ text?: unknown }>;
}
interface WorkersAiResponseLike {
  response?: unknown;
  text?: unknown;
  result?: unknown;
  output_text?: unknown;
  choices?: WorkersAiChoiceLike[];
  output?: WorkersAiOutputLike[];
  usage?: unknown;
  model?: unknown;
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}
function nonEmptyText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

/** Extracts only documented chat/completion text fields; never stringifies arbitrary objects. */
export function extractTextFromWorkersAiResponse(payload: unknown): string {
  const direct = nonEmptyText(payload);
  if (direct) return direct;
  const value = record(payload) as WorkersAiResponseLike | undefined;
  if (!value) throw new HttpError(502, 'MODEL_EMPTY_RESPONSE', 'O modelo não retornou conteúdo textual.');
  const candidates = [
    value.response, value.text, value.result, value.output_text,
    value.choices?.[0]?.message?.content, value.choices?.[0]?.text,
    value.output?.[0]?.content?.[0]?.text,
  ];
  for (const candidate of candidates) {
    const text = nonEmptyText(candidate);
    if (text) return text;
  }
  throw new HttpError(502, 'MODEL_EMPTY_RESPONSE', 'O modelo não retornou conteúdo textual.');
}

export interface WorkersAiResponseShape {
  responseType: 'string' | 'object' | 'other';
  topLevelKeys: string[];
  choicesCount?: number;
  hasMessageContent?: boolean;
  hasChoiceText?: boolean;
  hasReasoningContent?: boolean;
  contentLength?: number;
  reasoningContentLength?: number;
  finishReason?: string;
  choiceKeys?: string[];
  responseValueType?: string;
  hasUsage: boolean;
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  extractedTextLength?: number;
}

export function describeWorkersAiResponse(payload: unknown, extractedText?: string): WorkersAiResponseShape {
  const object = record(payload);
  if (!object) return { responseType: typeof payload === 'string' ? 'string' : 'other', topLevelKeys: [], hasUsage: false, extractedTextLength: extractedText?.length };
  const choices = Array.isArray(object.choices) ? object.choices : undefined;
  const firstChoice = record(choices?.[0]);
  const message = record(firstChoice?.message);
  const usage = record(object.usage);
  return {
    responseType: 'object', topLevelKeys: Object.keys(object).slice(0, 20), choicesCount: choices?.length,
    hasMessageContent: typeof message?.content === 'string', contentLength: typeof message?.content === 'string' ? message.content.length : undefined, reasoningContentLength: typeof message?.reasoning_content === 'string' ? message.reasoning_content.length : undefined, hasChoiceText: typeof firstChoice?.text === 'string', hasReasoningContent: typeof message?.reasoning_content === 'string', finishReason: typeof firstChoice?.finish_reason === 'string' ? firstChoice.finish_reason : undefined, choiceKeys: firstChoice ? Object.keys(firstChoice).slice(0, 12) : undefined, responseValueType: object.response === null ? 'null' : Array.isArray(object.response) ? 'array' : typeof object.response, hasUsage: object.usage !== undefined, promptTokens: typeof usage?.prompt_tokens === 'number' ? usage.prompt_tokens : typeof usage?.input_tokens === 'number' ? usage.input_tokens : undefined, completionTokens: typeof usage?.completion_tokens === 'number' ? usage.completion_tokens : typeof usage?.output_tokens === 'number' ? usage.output_tokens : undefined, totalTokens: typeof usage?.total_tokens === 'number' ? usage.total_tokens : undefined,
    model: typeof object.model === 'string' ? object.model : undefined, extractedTextLength: extractedText?.length,
  };
}

export function parseQwenResponse(response: unknown): unknown {
  let text: string;
  try { text = extractTextFromWorkersAiResponse(response); }
  catch (error) { throw error instanceof HttpError ? error : new HttpError(502, 'MODEL_EMPTY_RESPONSE', 'O modelo não retornou conteúdo textual.'); }
  try { return normalizeAnalysisResponse(text); }
  catch (error) {
    if (error instanceof AnalysisNormalizationError) throw new HttpError(502, 'MODEL_JSON_INVALID', 'O modelo não retornou JSON válido.');
    throw error;
  }
}
