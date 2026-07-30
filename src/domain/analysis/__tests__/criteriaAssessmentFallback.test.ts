import { describe, expect, it } from 'vitest';
import { CHALLENGES } from '../../../challenges';
import { attachCriteriaAssessment } from '../criteriaAssessment';
import { createAnalysisResult } from '../../pedagogicalDomain';

describe('fallback por critérios', () => {
  it('usa a evidência concreta no reconhecimento positivo, sem texto literal de placeholder', () => {
    const challenge = CHALLENGES.find((item) => item.id === 'cci01-custo-viagem')!;
    const result = attachCriteriaAssessment(createAnalysisResult({ category: 'tentativa inicial', confidence: 'media', studentFeedback: { positiveObservation: 'Tentativa.', primaryIssue: { hasIssue: false, type: 'sem_erro_relevante', concept: '', evidence: '', explanation: '' }, guidingQuestion: 'Onde `litros` é apresentado?', nextAction: 'Revise `litros`.' }, teacherDiagnosis: { hypothesis: 'Teste.', confidence: 'media' }, analysisMode: 'local_fallback', modelUsed: 'test', promptVersion: 'test' }), challenge, 'float distancia, consumo, preco; scanf("%f", &distancia); scanf("%f", &consumo); scanf("%f", &preco);');
    expect(result.analysisMode).toBe('local_fallback');
    expect(result.studentFeedback.positiveObservation).not.toContain('evidence');
    expect(result.studentFeedback.positiveObservation).toContain('scanf');
  });
});
