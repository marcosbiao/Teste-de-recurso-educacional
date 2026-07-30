import { describe, expect, it } from 'vitest';
import { validateWorkerAnalysis } from '../src/validation/validateAnalysisResult';

const challenge = { id: 'generic', competencyCode: 'saida', title: 'Teste', statement: 'Apresente valor.', objective: 'Usar saída.', requiredConcepts: ['printf'], expectedEvidence: [{ criterionId: 'show_result', description: 'Apresentar o resultado calculado.', importance: 'essencial' as const }], commonErrors: [], analysisGuidance: [] };
const response = { category: 'parcialmente correta', confidence: 'media', studentFeedback: { positiveObservation: 'Você calculou `valor`.', primaryIssue: { hasIssue: true, type: 'saida_incorreta', criterionId: 'show_result', concept: 'Apresentação do resultado', evidence: '`valor` é calculado, mas não aparece em uma saída.', explanation: 'O usuário não recebe o resultado calculado.' }, guidingQuestion: 'Em que saída `valor` é mostrado ao usuário?', nextAction: 'Adicione uma instrução de saída para `valor`.' }, criteriaAssessment: [{ criterionId: 'show_result', status: 'not_satisfied', evidence: 'Não há printf para o resultado.' }], teacherDiagnosis: { hypothesis: 'A saída obrigatória está ausente.', confidence: 'media' } };

describe('validação pedagógica do Worker', () => {
  it('aceita problema ligado ao critério pendente e rejeita vínculo inexistente', () => {
    expect(validateWorkerAnalysis(response, challenge, 'float valor;')).toMatchObject({ studentFeedback: { primaryIssue: { criterionId: 'show_result' } } });
    expect(() => validateWorkerAnalysis({ ...response, studentFeedback: { ...response.studentFeedback, primaryIssue: { ...response.studentFeedback.primaryIssue, criterionId: 'inventado' } } }, challenge, 'float valor;')).toThrow();
  });
});
