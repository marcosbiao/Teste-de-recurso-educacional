import type { AnalysisRequest } from '../types';
import type { AnalysisResult, AnalysisStatus } from '../domain/analysis/analysisTypes';
import type { AnalysisTransport, AnalyzeChallengeRequest } from '../domain/analysis/analysisTransportContract';
import { appConfig } from '../config/appConfig';
import { getChallengeById } from '../challenges';
import { createAnalysisResult } from '../domain/pedagogicalDomain';
import { generateLocalAnalysis } from './localAnalysisService';
import { ANALYSIS_LIMITS } from '../domain/analysis/analysisLimits';
import { recordAnalysisDiagnostic } from './analysisDiagnostics';
import { CloudflareWorkerTransport, WorkerTransportError } from './transports/cloudflareWorkerTransport';

function technicalResult(status: AnalysisStatus, code: string, retryAfterSeconds?: number): AnalysisResult {
  const labels: Record<string, [string, string]> = {
    UNAUTHORIZED: ['Autenticação necessária', 'Entre novamente para solicitar uma análise automática.'],
    FORBIDDEN_ORIGIN: ['Origem não autorizada', 'A análise automática não está disponível nesta origem.'],
    INVALID_REQUEST: ['Solicitação inválida', 'Revise os dados enviados antes de tentar novamente.'],
    CHALLENGE_NOT_FOUND: ['Desafio indisponível', 'O desafio solicitado não foi encontrado.'],
    CONFIGURATION_ERROR: ['Serviço de análise indisponível', 'A configuração do serviço precisa ser revisada.'],
    RATE_LIMITED: ['Limite temporário de análises atingido', 'Aguarde antes de solicitar uma nova análise.'],
    TIMEOUT: ['A análise demorou mais que o esperado', 'Seu código foi preservado.'],
    CODE_TOO_LARGE: ['Código acima do limite de análise', 'O código está maior que o limite suportado para análise automática. Reduza a tentativa antes de solicitar uma nova análise.'],
  };
  const [title, message] = labels[code] || ['Não foi possível concluir a análise agora', 'Sua tentativa foi preservada. Tente novamente em alguns instantes.'];
  return createAnalysisResult({
    category: 'tentativa inicial', confidence: 'baixa',
    studentFeedback: { positiveObservation: title, primaryIssue: { hasIssue: false, type: 'sem_erro_relevante', concept: '', evidence: '', explanation: '' }, guidingQuestion: '', nextAction: message },
    teacherDiagnosis: { hypothesis: `Falha técnica do Worker: ${code}.`, confidence: 'baixa' },
    analysisMode: 'unknown', analysisStatus: status, modelUsed: 'cloudflare-worker', promptVersion: appConfig.analysis.promptVersion,
    analysisSummary: message, retryAfterSeconds, isTransientFailure: ['rate_limit', 'timeout', 'temporarily_unavailable'].includes(status), shouldPersistAttempt: false, shouldCountAnalysisRequest: false,
  });
}

function errorDetails(error: unknown): { code: string; status: AnalysisStatus; fallback: boolean; retryAfterSeconds?: number } {
  if (error instanceof WorkerTransportError) {
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN_ORIGIN') return { code: error.code, status: 'authentication_error', fallback: false };
    if (error.code === 'CODE_TOO_LARGE') return { code: error.code, status: 'code_too_large', fallback: false };
    if (error.code === 'INVALID_REQUEST') return { code: error.code, status: 'invalid_input', fallback: false };
    if (error.code === 'CHALLENGE_NOT_FOUND' || error.code === 'CONFIGURATION_ERROR') return { code: error.code, status: 'configuration_error', fallback: false };
    if (error.code === 'RATE_LIMITED') return { code: error.code, status: 'rate_limit', fallback: true, retryAfterSeconds: error.retryAfterSeconds || 60 };
    if (error.code === 'AUTH_TOKEN_FAILED') return { code: error.code, status: 'temporarily_unavailable', fallback: true };
    if (error.code === 'TIMEOUT') return { code: error.code, status: 'timeout', fallback: true };
    if (['MODEL_EMPTY_RESPONSE', 'MODEL_JSON_INVALID', 'MODEL_OUTPUT_TRUNCATED', 'MODEL_RESPONSE_INVALID', 'MODEL_PEDAGOGICAL_INVALID'].includes(error.code)) return { code: error.code, status: 'invalid_response', fallback: true };
    if (error.code === 'MODEL_UNAVAILABLE') return { code: error.code, status: 'temporarily_unavailable', fallback: true };
    return { code: error.code, status: 'unknown_error', fallback: true };
  }
  return { code: 'UNKNOWN', status: 'unknown_error', fallback: true };
}

function localFallback(request: AnalysisRequest, requestId: string, reason: string): AnalysisResult | undefined {
  const challenge = getChallengeById(request.challengeId);
  if (!challenge) return undefined;
  try {
    const result = generateLocalAnalysis({ challenge, studentCode: request.code, representation: request.problemRepresentation }).result;
    recordAnalysisDiagnostic({ requestId, analysisMode: 'local_fallback', model: result.modelUsed, outcome: 'success', fallbackOutcome: 'success', fallbackUsed: true });
    return { ...result, requestId, modelCalls: 1 };
  } catch (error: unknown) {
    if (import.meta.env.DEV === true) console.info("[analysis-fallback]", { requestId, reason, error: error instanceof Error ? { name: error.name, message: error.message.slice(0, 180) } : { name: typeof error } });
    recordAnalysisDiagnostic({ requestId, analysisMode: "local_fallback", outcome: "LOCAL_FALLBACK_FAILED", fallbackOutcome: "LOCAL_FALLBACK_FAILED", fallbackUsed: true });
    return undefined;
  }
}

let activeAnalysisTransport: AnalysisTransport = new CloudflareWorkerTransport();
export function setAnalysisTransportForTesting(transport: AnalysisTransport | undefined): void { activeAnalysisTransport = transport || new CloudflareWorkerTransport(); }

export async function callAnalyzeApi(request: AnalysisRequest): Promise<AnalysisResult> {
  const requestId = `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = Date.now();
  const transportRequest: AnalyzeChallengeRequest = { challengeId: request.challengeId, studentCode: request.code, representation: request.problemRepresentation, previousAttemptContext: request.previousAttemptContext, clientVersion: appConfig.version, requestId };
  if (request.code.length > ANALYSIS_LIMITS.maxCodeLength) {
    recordAnalysisDiagnostic({ requestId, analysisMode: 'cloudflare_qwen', outcome: 'CODE_TOO_LARGE', status: 'code_too_large', inputLength: request.code.length, fallbackUsed: false });
    return { ...technicalResult('code_too_large', 'CODE_TOO_LARGE'), requestId };
  }
  try {
    const response = await activeAnalysisTransport.analyze(transportRequest);
    return { ...response.result, requestId: response.requestId, durationMs: response.durationMs, modelCalls: 1 };
  } catch (error) {
    const details = errorDetails(error);
    const workerError = error instanceof WorkerTransportError ? error : undefined;
    const diagnosticRequestId = workerError?.requestId || requestId;
    recordAnalysisDiagnostic({ requestId: diagnosticRequestId, analysisMode: 'cloudflare_qwen', model: '@cf/qwen/qwen3-30b-a3b-fp8', outcome: details.code, status: details.status, durationMs: Date.now() - startedAt, fallbackUsed: details.fallback, httpStatus: workerError?.status, stage: workerError?.stage, requestStarted: workerError?.requestStarted });
    const fallback = details.fallback && localFallback(request, diagnosticRequestId, details.code);
    return fallback || { ...technicalResult(details.status, details.code, details.retryAfterSeconds), requestId: diagnosticRequestId };
  }
}

export const analyzeChallengeAttempt = callAnalyzeApi;
