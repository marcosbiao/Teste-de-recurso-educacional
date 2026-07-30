import { describe, expect, it } from 'vitest';
import { ANALYSIS_LIMITS } from '../analysisLimits';
import { CHALLENGE_ANALYSIS_CATALOG } from '../challengeAnalysisCatalog';
import type { AnalyzeChallengeRequest, AnalyzeChallengeResponse, AnalysisTransportErrorPayload } from '../analysisTransportContract';
import { createAnalysisResult } from '../../pedagogicalDomain';

describe('contrato de transporte de análise', () => {
  const request: AnalyzeChallengeRequest = { challengeId: 'desafio-condicional-basico', studentCode: 'int main(){return 0;}', clientVersion: 'local-test' };
  const result = createAnalysisResult({ category: 'tentativa inicial', studentFeedback: { positiveObservation: 'Há uma tentativa.', primaryIssue: { hasIssue: true, type: 'logica', concept: 'fluxo', evidence: 'return', explanation: 'Revise.' }, guidingQuestion: 'O fluxo atende ao enunciado', nextAction: 'Revise o fluxo.' }, teacherDiagnosis: { hypothesis: 'Teste', confidence: 'media' }, analysisMode: 'gemini_primary', modelUsed: 'test', promptVersion: 'test' });
  it('mantém request e response serializáveis sem credenciais', () => {
    const response: AnalyzeChallengeResponse = { result, requestId: 'request-1', modelUsed: 'test', durationMs: 20 };
    expect(JSON.parse(JSON.stringify(request))).toEqual(request);
    expect(JSON.parse(JSON.stringify(response))).toMatchObject({ requestId: 'request-1', result: { analysisMode: 'gemini_primary' } });
    expect(JSON.stringify(request)).not.toContain('apiKey');
    expect(JSON.stringify(request)).not.toContain('prompt');
  });
  it('define payload de erro estável', () => {
    const error: AnalysisTransportErrorPayload = { code: 'timeout', message: 'Tempo esgotado', requestId: 'request-1', retryAfterSeconds: 1 };
    expect(JSON.parse(JSON.stringify(error))).toEqual(error);
  });
  it('centraliza limites e catálogo serializável sem soluções', () => {
    expect(ANALYSIS_LIMITS.maxCodeLength).toBe(30_000);
    expect(ANALYSIS_LIMITS.workerTimeoutMs).toBe(45_000);
    expect(ANALYSIS_LIMITS.clientTimeoutMs).toBeGreaterThan(ANALYSIS_LIMITS.workerTimeoutMs);
    expect(CHALLENGE_ANALYSIS_CATALOG.length).toBeGreaterThan(0);
    const serialized = JSON.stringify(CHALLENGE_ANALYSIS_CATALOG);
    expect(serialized).not.toContain('templateCode');
    expect(serialized).not.toContain('solution');
    expect(JSON.parse(serialized)[0]).toHaveProperty('id');
  });
});
