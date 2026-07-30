import { describe, expect, it } from 'vitest';
import { CHALLENGES } from '../../../challenges';
import { assessChallengeCriteria, assessmentsMatchChallenge } from '../criteriaAssessment';
import { generateLocalAnalysis } from '../../../services/localAnalysisService';
import { AnalysisValidationError, validateAnalysisResult } from '../validateAnalysisResult';

const travel = CHALLENGES.find(challenge => challenge.id === 'cci01-custo-viagem')!;
const codeWithoutOutput = `#include <stdio.h>
int main() {
  float distancia, consumo, preco, litros, valor;
  scanf("%f", &distancia);
  scanf("%f", &consumo);
  scanf("%f", &preco);
  litros = distancia / consumo;
  valor = litros * preco;
  return 0;
}`;

describe('diagnóstico por critérios verificáveis', () => {
  it('não marca entradas e cálculos presentes como ausentes e prioriza a saída ausente', () => {
    const assessments = assessChallengeCriteria(travel, codeWithoutOutput);
    expect(assessmentsMatchChallenge(travel, assessments)).toBe(true);
    expect(assessments.find(item => item.criterionId === 'crit1')).toMatchObject({ status: 'satisfied' });
    expect(assessments.find(item => item.criterionId === 'crit2')).toMatchObject({ status: 'satisfied' });
    expect(assessments.find(item => item.criterionId === 'crit8')).toMatchObject({ status: 'not_satisfied' });

    const result = generateLocalAnalysis({ challenge: travel, studentCode: codeWithoutOutput }).result;
    expect(result.analysisMode).toBe('local_fallback');
    expect(result.criteriaAssessment).toEqual(assessments);
    expect(result.studentFeedback.primaryIssue).toMatchObject({ criterionId: 'crit8', type: 'saida_incorreta' });
    expect(result.studentFeedback.primaryIssue.evidence).toContain('`litros`');
    expect(result.studentFeedback.nextAction).toContain('`printf`');
  });

  it('rejeita critério prioritário atendido, inexistente e evidência repetida', () => {
    const assessments = [
      { criterionId: 'read', status: 'satisfied' as const, evidence: 'Há uma leitura com `scanf`.' },
      { criterionId: 'show', status: 'not_satisfied' as const, evidence: 'Não há `printf`.' }
    ];
    const base = {
      category: 'tentativa inicial', confidence: 'media', criteriaAssessment: assessments,
      studentFeedback: { positiveObservation: 'Há uma leitura com `scanf`.', primaryIssue: { hasIssue: true, type: 'saida_incorreta', criterionId: 'show', concept: 'Saída', evidence: 'Não há `printf`.', explanation: 'Sem saída, o resultado não chega ao usuário.' }, guidingQuestion: 'Onde o resultado é mostrado com `printf`?', nextAction: 'Adicione `printf` para mostrar o resultado.' },
      teacherDiagnosis: { hypothesis: 'A saída está ausente.', confidence: 'media' }
    };
    expect(validateAnalysisResult(base).studentFeedback.primaryIssue.criterionId).toBe('show');
    expect(() => validateAnalysisResult({ ...base, studentFeedback: { ...base.studentFeedback, primaryIssue: { ...base.studentFeedback.primaryIssue, criterionId: 'read' } } })).toThrow(AnalysisValidationError);
    expect(() => validateAnalysisResult({ ...base, studentFeedback: { ...base.studentFeedback, primaryIssue: { ...base.studentFeedback.primaryIssue, criterionId: 'missing' } } })).toThrow(AnalysisValidationError);
  });
  it("mantém vínculo prioritário válido nos resultados locais de vários desafios", () => {
    for (const challenge of CHALLENGES.slice(0, 8)) {
      const result = generateLocalAnalysis({ challenge, studentCode: challenge.templateCode || "int main(){ return 0; }" }).result;
      if (result.studentFeedback.primaryIssue.hasIssue && result.criteriaAssessment?.length) {
        const linked = result.criteriaAssessment.find((item) => item.criterionId === result.studentFeedback.primaryIssue.criterionId);
        expect(linked).toBeDefined();
        expect(["partial", "not_satisfied"]).toContain(linked!.status);
      }
    }
  });
});
