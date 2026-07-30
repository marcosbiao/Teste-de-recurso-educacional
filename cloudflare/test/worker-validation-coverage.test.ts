import { describe, expect, it } from 'vitest';
import { validateWorkerAnalysis } from '../src/validation/validateAnalysisResult';

const challenge = { id: 'coverage', competencyCode: 'entrada-saida', title: 'Saída', statement: 'Calcule e mostre valor.', objective: 'Apresentar valor.', requiredConcepts: ['printf'], expectedEvidence: [
  { criterionId: 'calculate', description: 'Calcular valor.', importance: 'essencial' as const },
  { criterionId: 'show', description: 'Apresentar valor.', importance: 'essencial' as const },
  { criterionId: 'format', description: 'Usar duas casas.', importance: 'desejável' as const },
  { criterionId: 'message', description: 'Explicar saída.', importance: 'desejável' as const },
], commonErrors: [], analysisGuidance: [] };
const code = 'float valor = a + b; printf("%f", valor);';
const feedback = { positiveObservation: 'A variável `valor` recebe o cálculo.', primaryIssue: { hasIssue: true, type: 'saida_incorreta', criterionId: 'show', concept: 'Apresentação de `valor`', evidence: '`valor` é calculado, mas não aparece em uma saída.', explanation: 'Sem a saída, o usuário não vê o resultado.' }, guidingQuestion: 'Em que instrução `valor` é mostrado?', nextAction: 'Adicione uma saída para `valor`.' };
function payload(assessments: unknown[], issue = feedback.primaryIssue) { return { category: 'parcialmente correta', confidence: 'media', studentFeedback: { ...feedback, primaryIssue: issue }, criteriaAssessment: assessments, teacherDiagnosis: { hypothesis: 'A saída precisa ser completada.', confidence: 'media' } }; }

describe('cobertura de critérios do Worker', () => {
  const essential = [{ criterionId: 'calculate', status: 'satisfied', evidence: '`valor` recebe a soma.' }, { criterionId: 'show', status: 'not_satisfied', evidence: 'Não há saída para `valor`.' }];
  it('aceita apenas os essenciais e completa desejáveis como não verificáveis', () => {
    expect(validateWorkerAnalysis(payload(essential), challenge, code).criteriaAssessment).toHaveLength(4);
  });
  it('rejeita essencial omitido, id desconhecido e prioridade satisfeita', () => {
    expect(() => validateWorkerAnalysis(payload([essential[0]]), challenge, code)).toThrow();
    expect(() => validateWorkerAnalysis(payload([...essential, { criterionId: 'outro', status: 'satisfied', evidence: 'x' }]), challenge, code)).toThrow();
    expect(() => validateWorkerAnalysis(payload([{ ...essential[0] }, { ...essential[1], status: 'satisfied' }]), challenge, code)).toThrow();
  });
  it('aceita solução correta sem problema prioritário', () => {
    const correct = { ...feedback.primaryIssue, hasIssue: false, type: 'sem_erro_relevante', criterionId: '', concept: 'Consolidação de `valor`', evidence: '`valor` é calculado e apresentado.', explanation: 'Os requisitos essenciais foram atendidos.' };
    const result = validateWorkerAnalysis(payload([{ criterionId: 'calculate', status: 'satisfied', evidence: '`valor` recebe a soma.' }, { criterionId: 'show', status: 'satisfied', evidence: '`valor` aparece em printf.' }], correct), challenge, code);
    expect(result.studentFeedback.primaryIssue.hasIssue).toBe(false);
  });
});
