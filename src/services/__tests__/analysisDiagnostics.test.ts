import { describe, expect, it, vi } from 'vitest';
import { exportLocalAnalysisMetrics, getLatestAnalysisDiagnostic, recordAnalysisDiagnostic, resetLocalAnalysisDiagnostics } from '../analysisDiagnostics';
describe('diagnóstico local de análise', () => {
  it('registra somente metadados seguros em desenvolvimento', () => {
    resetLocalAnalysisDiagnostics(); const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    recordAnalysisDiagnostic({ requestId: 'local-1', analysisMode: 'local_fallback', durationMs: 10, outcome: 'timeout', fallbackUsed: true, modelCalls: 2 });
    expect(getLatestAnalysisDiagnostic()).toMatchObject({ requestId: 'local-1', analysisMode: 'local_fallback', modelCalls: 2 });
    expect(exportLocalAnalysisMetrics()).toMatchObject({ fallbacks: 1, maxDurationMs: 10 });
    expect(JSON.stringify(spy.mock.calls)).not.toContain('apiKey'); spy.mockRestore();
  });
  it("preserva a falha principal quando o fallback falha", () => {
    resetLocalAnalysisDiagnostics();
    recordAnalysisDiagnostic({ requestId: "same-request", analysisMode: "cloudflare_qwen", outcome: "MODEL_RESPONSE_INVALID", status: "invalid_response", httpStatus: 502, durationMs: 31, fallbackUsed: true });
    recordAnalysisDiagnostic({ requestId: "same-request", analysisMode: "local_fallback", outcome: "LOCAL_FALLBACK_FAILED", fallbackOutcome: "LOCAL_FALLBACK_FAILED", fallbackUsed: true });
    expect(getLatestAnalysisDiagnostic()).toMatchObject({ requestId: "same-request", primaryAnalysisMode: "cloudflare_qwen", primaryOutcome: "MODEL_RESPONSE_INVALID", primaryStatus: "invalid_response", primaryHttpStatus: 502, primaryDurationMs: 31, fallbackUsed: true, fallbackOutcome: "LOCAL_FALLBACK_FAILED" });
  });
  it("mantém o estágio e indica que o Worker não foi iniciado quando falta autenticação", () => {
    resetLocalAnalysisDiagnostics();
    recordAnalysisDiagnostic({ requestId: "auth-request", analysisMode: "cloudflare_qwen", outcome: "UNAUTHORIZED", status: "authentication_error", stage: "auth_token", requestStarted: false, durationMs: 27, fallbackUsed: false });
    expect(getLatestAnalysisDiagnostic()).toMatchObject({ outcome: "UNAUTHORIZED", stage: "auth_token", requestStarted: false, durationMs: 27 });
  });
});
