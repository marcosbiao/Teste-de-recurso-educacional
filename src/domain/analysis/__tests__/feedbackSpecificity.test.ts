import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../../types';
import { evaluateFeedbackSpecificity, GENERIC_FEEDBACK_PATTERNS } from '../feedbackSpecificity';

function challenge(criterion: string): Challenge {
  return {
    id: 'specificity-test', title: 'Teste de feedback', subtitle: '', challengeVersion: '1',
    metadata: { content: '', language: 'C', level: 'Iniciante', time: '', requirements: criterion, skill: 'Programação em C', version: '1' },
    pedagogicalMetadata: { learningObjective: criterion, pedagogicalGoal: '', expectedDifficulty: 'baixa', cognitiveOperation: '', prerequisites: [] },
    domainTags: { skillTags: [], topicTags: [], difficultyTag: '', prerequisiteTags: [] },
    problem: criterion, guidingQuestions: [], orientation: { input: '', output: '', cases: '', structure: '', expectedLogic: '' }, examples: [], concepts: [criterion], tips: [], commonErrors: [], solution: '', finalSummary: [], expectedCriteria: [{ id: 'c', description: criterion, importance: 'essencial' }], probableErrors: [], templateCode: '', analyzeLocally: undefined as any
  };
}

const cases = [
  ['entrada', 'Leia distancia antes do cálculo.', 'int main(){ float distancia; }', 'Não há leitura de `distancia` com scanf.', 'Sem essa leitura, distancia não recebe o dado pedido.', 'Qual valor deve ser lido em `distancia` com scanf?', 'Adicione a leitura de `distancia` com scanf.'],
  ['expressão', 'Calcule a média real.', 'int main(){ int media; }', '`media` foi declarada como int.', 'A média pode perder casas decimais nesse tipo.', 'Como `media` deve guardar um resultado com casas decimais?', 'Troque o tipo de `media` por um tipo real.'],
  ['condicional', 'Trate idade igual a 18.', 'if (idade > 18) {}', 'A condição usa `idade > 18` e exclui o limite 18.', 'O caso limite fica fora da regra solicitada.', 'O que deve acontecer quando `idade` for exatamente 18?', 'Ajuste a condição de `idade` para incluir o limite 18.'],
  ['repetição', 'Atualize contador no laço.', 'while (contador < 10) { }', '`contador` não é atualizado dentro do while.', 'Sem atualização, o laço pode não atingir sua condição de parada.', 'Em que momento `contador` precisa mudar para o while terminar?', 'Inclua a atualização de `contador` dentro do while.'],
  ['vetor', 'Acesse apenas índices válidos do vetor.', 'for (i = 0; i <= 10; i++) valores[i] = 0;', '`i` pode chegar a 10 ao acessar valores[i].', 'Esse índice ultrapassa a última posição válida do vetor.', 'Qual é o maior valor válido de `i` nesse vetor?', 'Ajuste o limite de `i` para não ultrapassar o vetor.'],
  ['função', 'Envie os dois argumentos para calcular.', 'float calcular(float a, float b); calcular(a);', 'A chamada de `calcular` fornece apenas `a`.', 'A função não recebe todos os dados definidos em seus parâmetros.', 'Qual argumento falta enviar para `calcular`?', 'Adicione o argumento que corresponde ao segundo parâmetro de `calcular`.'],
  ['arquivo', 'Preserve dados existentes no arquivo.', 'FILE *arquivo = fopen("dados.txt", "w");', 'O arquivo é aberto com modo `w`.', 'Esse modo substitui o conteúdo existente antes de gravar.', 'O que acontece com os dados quando `arquivo` usa o modo `w`?', 'Troque o modo de abertura de `arquivo` por um que preserve os dados existentes.']
] as const;

describe('evaluateFeedbackSpecificity', () => {
  it.each(cases)('aceita feedback específico de %s', (_area, criterion, code, evidence, explanation, guidingQuestion, nextAction) => {
    const result = {
      studentFeedback: {
        positiveObservation: 'A tentativa contém uma estrutura observável.',
        primaryIssue: { hasIssue: true, type: 'logica' as const, concept: 'Ponto prioritário', evidence, explanation },
        guidingQuestion,
        nextAction
      }
    };
    const evaluation = evaluateFeedbackSpecificity(result, { challenge: challenge(criterion), studentCode: code });
    expect(evaluation.isSpecific).toBe(true);
    expect(evaluation.issues).not.toContain('EVIDENCE_EXPLANATION_REPETITION');
    expect(GENERIC_FEEDBACK_PATTERNS.some(pattern => pattern.test(guidingQuestion) || pattern.test(nextAction))).toBe(false);
  });

  it('detecta pergunta, ação e repetição genéricas sem exigir ponto de interrogação', () => {
    const result = {
      studentFeedback: {
        positiveObservation: 'Há uma tentativa.',
        primaryIssue: { hasIssue: true, type: 'logica' as const, concept: 'Condição', evidence: '`idade` exclui o limite 18.', explanation: '`idade` exclui o limite 18.' },
        guidingQuestion: 'Qual parte do enunciado merece mais atenção nesta tentativa?',
        nextAction: 'Revise o enunciado e tente novamente.'
      }
    };
    const evaluation = evaluateFeedbackSpecificity(result, { challenge: challenge('Trate idade igual a 18.'), studentCode: 'if (idade > 18) {}' });
    expect(evaluation.isSpecific).toBe(false);
    expect(evaluation.issues).toEqual(expect.arrayContaining(['GENERIC_GUIDING_QUESTION', 'GENERIC_NEXT_ACTION', 'EVIDENCE_EXPLANATION_REPETITION']));
  });
});
