import type { AnalysisMode, AnalysisStatus } from '../domain/analysis/analysisTypes';

export interface AnalysisDiagnostic {
  requestId: string;
  analysisMode?: AnalysisMode;
  model?: string;
  attempt?: 1 | 2;
  durationMs?: number;
  status?: AnalysisStatus;
  outcome?: string;
  finishReason?: string;
  normalized?: boolean;
  fallbackUsed?: boolean;
  inputLength?: number;
  modelCalls?: number;
  httpStatus?: number;
  stage?: "auth_token" | "fetch" | "worker_response";
  requestStarted?: boolean;
  primaryStage?: "auth_token" | "fetch" | "worker_response";
  primaryRequestStarted?: boolean;
  primaryAnalysisMode?: AnalysisMode;
  primaryOutcome?: string;
  primaryStatus?: AnalysisStatus;
  primaryHttpStatus?: number;
  primaryDurationMs?: number;
  fallbackOutcome?: string;
  fallbackStatus?: AnalysisStatus;
}
const metrics = { analyses: 0, primarySuccesses: 0, secondaryUses: 0, fallbacks: 0, invalidResponses: 0, durations: [] as number[], errors: {} as Record<string, number> };
let latestDiagnostic: AnalysisDiagnostic | null = null;
const copy = (value: AnalysisDiagnostic) => ({ ...value });
function mergeDiagnostic(previous: AnalysisDiagnostic | null, next: AnalysisDiagnostic): AnalysisDiagnostic {
  if (next.analysisMode === "local_fallback" && previous?.requestId === next.requestId) {
    return { requestId: next.requestId, primaryAnalysisMode: previous.primaryAnalysisMode || previous.analysisMode, primaryOutcome: previous.primaryOutcome || previous.outcome, primaryStatus: previous.primaryStatus || previous.status, primaryHttpStatus: previous.primaryHttpStatus || previous.httpStatus, primaryDurationMs: previous.primaryDurationMs || previous.durationMs, primaryStage: previous.primaryStage || previous.stage, primaryRequestStarted: previous.primaryRequestStarted ?? previous.requestStarted, fallbackUsed: true, fallbackOutcome: next.fallbackOutcome || next.outcome, fallbackStatus: next.fallbackStatus || next.status, analysisMode: next.analysisMode, model: next.model, durationMs: next.durationMs, outcome: next.outcome, status: next.status, httpStatus: next.httpStatus, modelCalls: next.modelCalls };
  }
  return copy(next);
}
export function recordAnalysisDiagnostic(diagnostic: AnalysisDiagnostic): void {
  if (import.meta.env.DEV !== true) return;
  latestDiagnostic = mergeDiagnostic(latestDiagnostic, diagnostic);
  if (diagnostic.durationMs !== undefined) metrics.durations.push(diagnostic.durationMs);
  if (diagnostic.outcome === 'success') { metrics.analyses += 1; if (diagnostic.analysisMode === 'cloudflare_qwen') metrics.primarySuccesses += 1; }

  if (diagnostic.fallbackUsed) metrics.fallbacks += 1;
  if (diagnostic.outcome === 'invalid_json' || diagnostic.outcome === 'invalid_schema') metrics.invalidResponses += 1;
  if (diagnostic.outcome && diagnostic.outcome !== 'success') metrics.errors[diagnostic.outcome] = (metrics.errors[diagnostic.outcome] || 0) + 1;
  console.info('[analysis-worker]', copy(diagnostic));
}
export function getLatestAnalysisDiagnostic(): AnalysisDiagnostic | null { return import.meta.env.DEV === true && latestDiagnostic ? copy(latestDiagnostic) : null; }
export function exportLocalAnalysisMetrics(): Record<string, unknown> | null {
  if (import.meta.env.DEV !== true) return null;
  const durations = metrics.durations;
  return { analyses: metrics.analyses, primarySuccesses: metrics.primarySuccesses, secondaryUses: metrics.secondaryUses, fallbacks: metrics.fallbacks, invalidResponses: metrics.invalidResponses, averageDurationMs: durations.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : 0, maxDurationMs: durations.length ? Math.max(...durations) : 0, errors: { ...metrics.errors } };
}
export function resetLocalAnalysisDiagnostics(): void { latestDiagnostic = null; metrics.analyses = 0; metrics.primarySuccesses = 0; metrics.secondaryUses = 0; metrics.fallbacks = 0; metrics.invalidResponses = 0; metrics.durations = []; metrics.errors = {}; }
