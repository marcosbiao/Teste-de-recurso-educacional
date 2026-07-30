import { describe, expect, it } from 'vitest';
import { getInternalChallenge } from '../src/catalog/challengeAnalysisCatalog';
import { validateWorkerAnalysis } from '../src/validation/validateAnalysisResult';

const code = `#include <stdio.h>
int main() {
 float distancia, consumo, preco, litros, valor;
 scanf("%f", &distancia); scanf("%f", &consumo); scanf("%f", &preco);
 litros = distancia / consumo; valor = litros * preco; return 0;
}`;

describe('combustível sem saídas', () => {
  it('mantém entradas e cálculos satisfeitos e prioriza a apresentação', () => {
    const challenge = getInternalChallenge('cci01-custo-viagem')!;
    const criteriaAssessment = challenge.expectedEvidence
      .filter((criterion) => criterion.importance === 'essencial')
      .map((criterion) => ({ criterionId: criterion.criterionId, status: criterion.criterionId === 'crit8' ? 'not_satisfied' as const : 'satisfied' as const, evidence: criterion.criterionId === 'crit8' ? 'Após calcular `litros` e `valor`, o programa segue para `return 0` sem saída.' : 'Há evidência observável do requisito na tentativa.' }));
    const response = { category: 'parcialmente correta', confidence: 'alta', studentFeedback: { positiveObservation: 'As três entradas são lidas com `scanf` e os cálculos usam `litros` e `valor`.', primaryIssue: { hasIssue: true, type: 'saida_incorreta', criterionId: 'crit8', concept: 'Apresentação dos resultados', evidence: 'Após calcular `litros` e `valor`, o programa segue para `return 0` sem mostrar esses valores.', explanation: 'Os resultados ficam armazenados, mas não chegam ao usuário.' }, guidingQuestion: 'Em que instrução `litros` e `valor` são apresentados antes de `return 0`?', nextAction: 'Adicione saídas para `litros` e `valor` antes de `return 0`.' }, criteriaAssessment, teacherDiagnosis: { hypothesis: 'A saída obrigatória está ausente.', confidence: 'alta' } };
    const result = validateWorkerAnalysis(response, challenge, code);
    expect(result.studentFeedback.primaryIssue).toMatchObject({ criterionId: 'crit8', concept: 'Apresentação dos resultados' });
  });
});
