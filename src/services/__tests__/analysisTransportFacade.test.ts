import { afterEach, describe, expect, it } from 'vitest';
import { createAnalysisResult } from '../../domain/pedagogicalDomain';
import type { AnalysisTransport } from '../../domain/analysis/analysisTransportContract';
import { WorkerTransportError } from '../transports/cloudflareWorkerTransport';
import { analyzeChallengeAttempt, setAnalysisTransportForTesting } from '../analysisService';

const result = createAnalysisResult({ category: 'tentativa inicial', studentFeedback: { positiveObservation: 'Tentativa.', primaryIssue: { hasIssue: true, type: 'logica', concept: 'fluxo', evidence: 'return', explanation: 'Revise.' }, guidingQuestion: 'O fluxo atende', nextAction: 'Revise.' }, teacherDiagnosis: { hypothesis: 'Teste', confidence: 'media' }, analysisMode: 'gemini_primary', modelUsed: 'mock', promptVersion: 'test' });
afterEach(() => setAnalysisTransportForTesting(undefined));
describe('fachada de análise', () => {
  it('depende do contrato de transporte, não do componente', async () => {
    const transport: AnalysisTransport = { analyze: async (request) => ({ result, requestId: 'transport-1', modelUsed: 'mock', durationMs: request.studentCode.length }) };
    setAnalysisTransportForTesting(transport);
    await expect(analyzeChallengeAttempt({ challengeId: 'desafio-condicional-basico', code: 'abc', userId: null })).resolves.toMatchObject({ analysisMode: 'gemini_primary', modelUsed: 'mock' });
  });
  it("não usa fallback quando o transporte informa autenticação ausente", async () => {
    const transport: AnalysisTransport = { analyze: async () => { throw new WorkerTransportError("UNAUTHORIZED", undefined, "auth", undefined, undefined, "auth_token", false); } };
    setAnalysisTransportForTesting(transport);
    await expect(analyzeChallengeAttempt({ challengeId: "desafio-condicional-basico", code: "int main() {}", userId: null })).resolves.toMatchObject({ analysisStatus: "authentication_error", analysisMode: "unknown", shouldPersistAttempt: false });
  });
});
