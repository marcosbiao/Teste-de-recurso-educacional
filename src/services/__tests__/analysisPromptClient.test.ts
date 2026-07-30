import { describe, expect, it } from 'vitest';
import { CHALLENGES } from '../../challenges';
import type { Challenge } from '../../types';
import {
  ANALYSIS_SYSTEM_INSTRUCTION,
  buildAnalysisPromptClient,
  buildAnalysisPromptPayload,
  compactPreviousAttemptContext,
  compactText,
  createAnalysisPromptMetrics,
  normalizeEssentialConcepts,
  selectRelevantCriteria
} from '../analysisPromptClient';

const baseChallenge = CHALLENGES.find((item) => item.id === 'desafio1_condicionais_basico') ?? CHALLENGES[0];

function createChallenge(overrides?: Partial<Challenge>): Challenge {
  return {
    ...baseChallenge,
    concepts: [
      'estrutura condicional - identificar casos',
      'leitura de entrada: scanf e parsing',
      'estrutura condicional - identificar casos',
      'comparação numérica',
      'saída formatada',
      'validação de fluxo',
      'organização do programa'
    ],
    expectedCriteria: [
      { id: 'c1', description: 'Ler corretamente a entrada principal.', importance: 'essencial' },
      { id: 'c2', description: 'Produzir a saída pedida pelo enunciado.', importance: 'essencial' },
      { id: 'c3', description: 'Tratar separadamente o caso zero.', importance: 'essencial' },
      { id: 'c4', description: 'Usar condicionais coerentes com o problema.', importance: 'essencial' },
      { id: 'c5', description: 'Evitar mensagens extras.', importance: 'desejável' },
      { id: 'c6', description: 'Manter nomes consistentes.', importance: 'desejável' },
      { id: 'c7', description: 'Organizar a saída final.', importance: 'desejável' },
      { id: 'c8', description: 'Evitar repetições desnecessárias.', importance: 'desejável' }
    ],
    probableErrors: [
      { id: 'caso_nao_tratado', description: 'Descrição longa que não deve ir inteira ao prompt.', likelyCause: 'causa 1' },
      { id: 'saida_incorreta', description: 'Outra descrição extensa.', likelyCause: 'causa 2' },
      { id: 'logica', description: 'Mais uma descrição extensa.', likelyCause: 'causa 3' },
      { id: 'condicao_incompleta', description: 'Excesso que deve ser cortado.', likelyCause: 'causa 4' }
    ],
    tips: [
      { id: 1, text: 'Dica longa que não deve aparecer no prompt.', pedagogicalGoal: 'meta' }
    ],
    commonErrors: [
      { title: 'Erro comum', description: 'Descrição longa de erro comum.', pedagogicalAdvice: 'orientação' }
    ],
    solution: 'int main() { /* solução de referência */ return 0; }',
    ...overrides
  };
}

function countOccurrences(text: string, target: string): number {
  if (!target) return 0;
  return text.split(target).length - 1;
}

describe('analysisPromptClient', () => {
  it('compacta espaços sem reescrever o conteúdo', () => {
    expect(compactText('  linha 1\n\n\n  linha   2  ')).toBe('linha 1\n\nlinha 2');
  });

  it('envia no máximo 5 conceitos curtos e sem duplicação', () => {
    const concepts = normalizeEssentialConcepts(createChallenge().concepts);

    expect(concepts).toHaveLength(5);
    expect(concepts[0]).toBe('estrutura condicional');
    expect(new Set(concepts).size).toBe(concepts.length);
  });

  it('preserva todos os critérios essenciais mesmo quando excedem o limite nominal', () => {
    const criteria = selectRelevantCriteria([
      { id: 'c1', description: 'Critério 1', importance: 'essencial' },
      { id: 'c2', description: 'Critério 2', importance: 'essencial' },
      { id: 'c3', description: 'Critério 3', importance: 'essencial' },
      { id: 'c4', description: 'Critério 4', importance: 'essencial' },
      { id: 'c5', description: 'Critério 5', importance: 'essencial' },
      { id: 'c6', description: 'Critério 6', importance: 'essencial' },
      { id: 'c7', description: 'Critério 7', importance: 'essencial' },
      { id: 'c8', description: 'Opcional', importance: 'desejável' }
    ]);

    expect(criteria).toHaveLength(8);
    expect(criteria.filter((criterion) => criterion.importance === "essencial")).toHaveLength(7);
  });

  it('limita critérios opcionais quando há espaço menor', () => {
    const criteria = selectRelevantCriteria(createChallenge().expectedCriteria);

    expect(criteria).toHaveLength(8);
    expect(criteria.filter((criterion) => criterion.importance === 'essencial')).toHaveLength(4);
  });

  it('mantém o contexto anterior compacto e sem código anterior', () => {
    const previous = compactPreviousAttemptContext({
      attemptNumber: 2,
      previousCategory: 'tentativa inicial',
      previousPrimaryIssue: {
        type: 'caso_nao_tratado',
        concept: 'estrutura condicional com explicação muito extensa '.repeat(8),
        explanation: 'explicação antiga'
      },
      previousGuidingQuestion: 'Qual caso falta?',
      previousNextAction: 'Crie um caso separado para o valor zero e revise a condição principal com calma.'.repeat(4),
      codeChanged: false,
      openedTipIds: [1, 2, 3]
    });

    expect(previous).toMatchObject({
      category: 'tentativa inicial',
      issueType: 'caso_nao_tratado',
      codeChanged: false
    });
    expect(previous?.concept?.length ?? 0).toBeLessThanOrEqual(100);
    expect(previous?.nextAction?.length ?? 0).toBeLessThanOrEqual(180);
    expect(JSON.stringify(previous)).not.toContain('openedTipIds');
    expect(JSON.stringify(previous)).not.toContain('previousGuidingQuestion');
  });

  it('gera um JSON compacto sem indentação e sem incluir dicas, erros comuns ou solução', () => {
    const challenge = createChallenge();
    const prompt = buildAnalysisPromptClient({
      challenge,
      code: 'int main() { return 0; }',
      previousAttemptContext: {
        attemptNumber: 2,
        previousCategory: 'tentativa inicial',
        previousPrimaryIssue: {
          type: 'caso_nao_tratado',
          concept: 'estrutura condicional',
          explanation: 'O zero foi agrupado com negativos.'
        },
        previousGuidingQuestion: 'Qual valor não é positivo nem negativo?',
        previousNextAction: 'Crie um caso separado para zero.',
        codeChanged: true,
        openedTipIds: [1, 2]
      }
    });

    const parsed = JSON.parse(prompt);

    expect(prompt.startsWith('{')).toBe(true);
    expect(prompt).not.toContain('\n  "');
    expect(prompt).not.toContain('Dica longa que não deve aparecer no prompt');
    expect(prompt).toContain('Descrição longa de erro comum');
    expect(prompt).not.toContain('solução de referência');
    expect(prompt).not.toContain('userId');
    expect(prompt).not.toContain('timestamp');
    expect(prompt).not.toContain('processMetrics');
    expect(parsed.attempt.previous).toEqual({
      category: 'tentativa inicial',
      issueType: 'caso_nao_tratado',
      concept: 'estrutura condicional',
      nextAction: 'Crie um caso separado para zero.',
      codeChanged: true
    });
  });

  it('envia o enunciado apenas uma vez quando orientation duplica o problema', () => {
    const duplicatedProblem = 'Leia um número e informe se ele é positivo, negativo ou zero.';
    const challenge = createChallenge({
      problem: duplicatedProblem,
      orientation: {
        ...createChallenge().orientation,
        expectedLogic: duplicatedProblem,
        structure: duplicatedProblem
      }
    });

    const prompt = buildAnalysisPromptClient({
      challenge,
      code: 'int main() { return 0; }'
    });

    expect(countOccurrences(prompt, duplicatedProblem)).toBe(1);
  });

  it('mantém o overhead dinâmico dentro do orçamento para um desafio representativo', () => {
    const challenge = createChallenge({
      problem: `${createChallenge().problem}\n\n${createChallenge().problem}`,
      orientation: {
        ...createChallenge().orientation,
        structure: `${createChallenge().orientation.structure} `.repeat(10),
        expectedLogic: `${createChallenge().orientation.expectedLogic} `.repeat(10)
      }
    });

    const payload = buildAnalysisPromptPayload({
      challenge,
      code: 'int main() { return 0; }',
      previousAttemptContext: {
        attemptNumber: 2,
        previousCategory: 'tentativa inicial',
        previousPrimaryIssue: {
          type: 'caso_nao_tratado',
          concept: 'estrutura condicional '.repeat(20),
          explanation: 'explicação anterior'
        },
        previousNextAction: 'Crie um caso separado para zero e revise a condição principal.'.repeat(8),
        codeChanged: false,
        openedTipIds: [1, 2, 3]
      }
    });

    const metrics = createAnalysisPromptMetrics({ payload, systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION });

    expect(metrics.dynamicContextCharacters).toBeLessThanOrEqual(6000);
  });

  it('mantém systemInstruction curto e sem duplicar o schema textual', () => {
    expect(ANALYSIS_SYSTEM_INSTRUCTION.length).toBeLessThanOrEqual(2200);
    expect(ANALYSIS_SYSTEM_INSTRUCTION).not.toContain('studentFeedback');
    expect(ANALYSIS_SYSTEM_INSTRUCTION).not.toContain('teacherDiagnosis');
    expect(ANALYSIS_SYSTEM_INSTRUCTION).not.toContain('primaryIssue');
  });
});
