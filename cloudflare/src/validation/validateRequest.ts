import { HttpError } from '../http/errors';
import { ANALYSIS_LIMITS } from '../../../src/domain/analysis/analysisLimits';

export { ANALYSIS_LIMITS };

export interface WorkerAnalyzeRequest {
  challengeId: string;
  studentCode: string;
  representation?: Record<string, unknown>;
  previousAttemptContext?: Record<string, unknown>;
  clientVersion?: string;
  /** Byte size of the JSON request; used only for safe development diagnostics. */
  requestBodyBytes?: number;
}

function text(value: unknown, field: string, maximum: number, requestBodyBytes: number): string {
  if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, 'INVALID_REQUEST', `${field} é inválido.`, undefined, { requestBodyBytes });
  if (value.length > maximum) {
    const code = field === 'studentCode' ? 'CODE_TOO_LARGE' : 'INVALID_REQUEST';
    throw new HttpError(413, code, field === 'studentCode' ? 'O código excede o limite permitido para análise.' : `${field} é inválido.`, undefined, { requestBodyBytes, studentCodeLength: field === 'studentCode' ? value.length : undefined });
  }
  return value;
}
function optionalObject(value: unknown, field: string, maxLength: number, requestBodyBytes: number): Record<string, unknown> | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value) || JSON.stringify(value).length > maxLength) throw new HttpError(400, 'INVALID_REQUEST', `${field} é inválido.`, undefined, { requestBodyBytes });
  return value as Record<string, unknown>;
}

export async function validateAnalyzeRequest(request: Request): Promise<WorkerAnalyzeRequest> {
  if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) throw new HttpError(415, 'INVALID_REQUEST', 'A solicitação deve usar Content-Type application/json.');
  const contentLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(contentLength) && contentLength > ANALYSIS_LIMITS.maxRequestBodyBytes) throw new HttpError(413, 'INVALID_REQUEST', 'A solicitação excede o limite permitido.', undefined, { requestBodyBytes: contentLength });
  const bodyText = await request.text();
  const requestBodyBytes = new TextEncoder().encode(bodyText).byteLength;
  if (requestBodyBytes > ANALYSIS_LIMITS.maxRequestBodyBytes) throw new HttpError(413, 'INVALID_REQUEST', 'A solicitação excede o limite permitido.', undefined, { requestBodyBytes });
  let body: Record<string, unknown>;
  try { body = JSON.parse(bodyText) as Record<string, unknown>; } catch { throw new HttpError(400, 'INVALID_REQUEST', 'O corpo da solicitação deve ser JSON válido.'); }
  if (!body || Array.isArray(body) || typeof body !== 'object') throw new HttpError(400, 'INVALID_REQUEST', 'O corpo da solicitação é inválido.');
  const allowed = new Set(['challengeId', 'studentCode', 'representation', 'previousAttemptContext', 'clientVersion']);
  if (Object.keys(body).some((key) => !allowed.has(key))) throw new HttpError(400, 'INVALID_REQUEST', 'A solicitação contém campos não permitidos.');
  const previousAttemptContext = optionalObject(body.previousAttemptContext, 'previousAttemptContext', ANALYSIS_LIMITS.maxContextLength, requestBodyBytes);
  if (Array.isArray(previousAttemptContext?.openedTipIds) && previousAttemptContext.openedTipIds.length > ANALYSIS_LIMITS.maxHints) throw new HttpError(400, 'INVALID_REQUEST', 'O histórico de dicas excede o limite permitido.');
  return {
    challengeId: text(body.challengeId, 'challengeId', 120, requestBodyBytes),
    studentCode: text(body.studentCode, 'studentCode', ANALYSIS_LIMITS.maxCodeLength, requestBodyBytes),
    representation: optionalObject(body.representation, 'representation', ANALYSIS_LIMITS.maxRepresentationLength, requestBodyBytes),
    previousAttemptContext,
    clientVersion: body.clientVersion === undefined ? undefined : text(body.clientVersion, 'clientVersion', 80, requestBodyBytes),
    requestBodyBytes,
  };
}
