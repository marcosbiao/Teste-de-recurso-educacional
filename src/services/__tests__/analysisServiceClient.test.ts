import { describe, expect, it, vi } from 'vitest';
import { createAnalysisResult } from '../../domain/pedagogicalDomain';
import { analyzeChallengeAttempt, setAnalysisTransportForTesting } from '../analysisService';
import type { AnalysisTransport } from '../../domain/analysis/analysisTransportContract';

const result = createAnalysisResult({
  category: 'parcialmente correta', confidence: 'media',
  studentFeedback: { positiveObservation: 'Você leu `distancia`.', primaryIssue: { hasIssue: true, type: 'saida_incorreta', criterionId: 'show_result', concept: 'Apresentação do resultado', evidence: 'Não há saída para `litros`.', explanation: 'O valor calculado não chega ao usuário.' }, guidingQuestion: 'Em que momento `litros` é apresentado?', nextAction: 'Adicione uma saída para `litros` antes de retornar.' },
  teacherDiagnosis: { hypothesis: 'A saída exigida está ausente.', confidence: 'media' }, criteriaAssessment: [{ criterionId: 'show_result', status: 'not_satisfied', evidence: 'Não há saída.' }],
  analysisMode: 'cloudflare_qwen', modelUsed: '@cf/qwen/qwen3-30b-a3b-fp8', promptVersion: 'test',
});

describe('analysisService Worker facade', () => {
  it('propaga a resposta canônica do transporte Worker', async () => {
    const transport: AnalysisTransport = { analyze: vi.fn().mockResolvedValue({ result, requestId: 'worker-request', modelUsed: result.modelUsed, analysisMode: 'cloudflare_qwen', durationMs: 12 }) };
    setAnalysisTransportForTesting(transport);
    await expect(analyzeChallengeAttempt({ challengeId: 'desafio-condicional-basico', code: 'int main() {}', userId: null })).resolves.toMatchObject({ analysisMode: 'cloudflare_qwen', requestId: 'worker-request' });
    setAnalysisTransportForTesting(undefined);
  });
});
