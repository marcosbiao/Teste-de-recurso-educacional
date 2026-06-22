import type { CodeOrderingChallenge, WorkshopActivity } from '../types/workshop';

export const progressiveIncomeTaxOrderingChallenge: CodeOrderingChallenge = {
  id: 'imposto-progressivo-condicionais',
  slug: 'imposto-progressivo-condicionais',
  title: 'Calculando o imposto progressivo',
  statement:
    'Organize os blocos de código para construir um programa que leia um salário e calcule o imposto progressivo. Salários de até R$ 2.000,00 são isentos. Para a parcela entre R$ 2.000,01 e R$ 3.000,00, aplica-se 8%. Para a parcela entre R$ 3.000,01 e R$ 4.500,00, aplica-se 18%, além do imposto da faixa anterior. Para a parcela acima de R$ 4.500,00, aplica-se 28%, além dos valores das faixas anteriores. Imprima "Isento" ou o imposto no formato "R$ XX.XX".',
  categoryId: 'ordenacao-de-codigo',
  categoryLabel: 'Ordenação de Código',
  competencyId: 'CCI04',
  competencyLabel: 'Controlar o fluxo por decisões condicionais e expressões lógicas corretas',
  difficulty: 3,
  language: 'c',
  learningObjective:
    'Organizar corretamente declarações, entrada, decisões condicionais encadeadas, cálculos progressivos e saída formatada para construir um programa de cálculo de imposto.',
  prerequisites: [
    'Declaração de variáveis do tipo double',
    'Leitura com scanf',
    'Saída com printf',
    'Estruturas if, else if e else',
    'Operadores relacionais',
    'Expressões aritméticas',
    'Escopo delimitado por chaves'
  ],
  inputDescription: 'Um único valor real, maior ou igual a zero, representando o salário.',
  outputDescription:
    'Imprima "Isento" quando o salário for de até R$ 2.000,00. Nos demais casos, imprima o imposto no formato "R$ XX.XX", com exatamente duas casas decimais e quebra de linha.',
  exampleInput: '4520.00',
  exampleOutput: 'R$ 355.60',
  solutionCode: `#include <stdio.h>

int main(void) {
    double salario, imposto;

    scanf("%lf", &salario);

    if (salario <= 2000.00) {
        printf("Isento\\n");
        return 0;
    }

    if (salario <= 3000.00) {
        imposto = (salario - 2000.00) * 0.08;
    } else if (salario <= 4500.00) {
        imposto = 80.00 + (salario - 3000.00) * 0.18;
    } else {
        imposto = 350.00 + (salario - 4500.00) * 0.28;
    }

    printf("R$ %.2f\\n", imposto);

    return 0;
}`,
  blocks: [
    {
      id: 'program-start',
      code: `#include <stdio.h>

int main(void) {`,
      category: 'structure',
      indentationLevel: 0,
      scopeGroupId: 'main-scope',
      explanation: 'Inclui a biblioteca de entrada e saída e inicia a função principal.',
      canonicalPosition: 1
    },
    {
      id: 'declare-values',
      code: 'double salario, imposto;',
      category: 'declaration',
      indentationLevel: 1,
      scopeGroupId: 'main-scope',
      explanation: 'Declara a variável de entrada e a variável que armazenará o imposto.',
      canonicalPosition: 2
    },
    {
      id: 'read-salary',
      code: 'scanf("%lf", &salario);',
      category: 'input-output',
      indentationLevel: 1,
      scopeGroupId: 'main-scope',
      explanation: 'Lê o salário antes de ele ser utilizado pelas condições.',
      canonicalPosition: 3
    },
    {
      id: 'exempt-guard',
      code: `if (salario <= 2000.00) {
    printf("Isento\\n");
    return 0;
}`,
      category: 'control-flow',
      indentationLevel: 1,
      scopeGroupId: 'exempt-scope',
      explanation: 'Trata a faixa isenta e encerra a execução para evitar um cálculo posterior.',
      canonicalPosition: 4
    },
    {
      id: 'first-band-open',
      code: 'if (salario <= 3000.00) {',
      category: 'control-flow',
      indentationLevel: 1,
      scopeGroupId: 'first-tax-band',
      explanation: 'Inicia a primeira faixa tributável após a situação de isenção.',
      canonicalPosition: 5
    },
    {
      id: 'calc-first-band',
      code: 'imposto = (salario - 2000.00) * 0.08;',
      category: 'processing',
      indentationLevel: 2,
      scopeGroupId: 'first-tax-band',
      explanation: 'Aplica 8% somente à parcela do salário que excede R$ 2.000,00.',
      canonicalPosition: 6
    },
    {
      id: 'second-band-open',
      code: '} else if (salario <= 4500.00) {',
      category: 'control-flow',
      indentationLevel: 1,
      scopeGroupId: 'second-tax-band',
      explanation: 'Encerra a primeira faixa e inicia a segunda faixa tributável.',
      canonicalPosition: 7
    },
    {
      id: 'calc-second-band',
      code: 'imposto = 80.00 + (salario - 3000.00) * 0.18;',
      category: 'processing',
      indentationLevel: 2,
      scopeGroupId: 'second-tax-band',
      explanation: 'Soma o imposto da faixa anterior e aplica 18% à parcela excedente.',
      canonicalPosition: 8
    },
    {
      id: 'top-band-open',
      code: '} else {',
      category: 'control-flow',
      indentationLevel: 1,
      scopeGroupId: 'top-tax-band',
      explanation: 'Inicia o tratamento dos salários acima de R$ 4.500,00.',
      canonicalPosition: 9
    },
    {
      id: 'calc-top-band',
      code: 'imposto = 350.00 + (salario - 4500.00) * 0.28;',
      category: 'processing',
      indentationLevel: 2,
      scopeGroupId: 'top-tax-band',
      explanation: 'Soma o imposto das faixas anteriores e aplica 28% à parcela excedente.',
      canonicalPosition: 10
    },
    {
      id: 'progressive-chain-close',
      code: '}',
      category: 'control-flow',
      indentationLevel: 1,
      scopeGroupId: 'progressive-tax-chain',
      explanation: 'Encerra a cadeia de decisões tributárias.',
      canonicalPosition: 11
    },
    {
      id: 'show-tax',
      code: 'printf("R$ %.2f\\n", imposto);',
      category: 'input-output',
      indentationLevel: 1,
      scopeGroupId: 'main-scope',
      explanation: 'Apresenta o imposto após a conclusão do processamento.',
      canonicalPosition: 12
    },
    {
      id: 'program-end',
      code: `return 0;
}`,
      category: 'termination',
      indentationLevel: 1,
      scopeGroupId: 'main-scope',
      explanation: 'Finaliza a função principal e encerra o programa corretamente.',
      canonicalPosition: 13
    }
  ],
  initialBlockOrder: [
    'show-tax',
    'calc-second-band',
    'program-start',
    'top-band-open',
    'read-salary',
    'calc-top-band',
    'declare-values',
    'first-band-open',
    'program-end',
    'exempt-guard',
    'progressive-chain-close',
    'calc-first-band',
    'second-band-open'
  ],
  acceptedOrders: [
    [
      'program-start',
      'declare-values',
      'read-salary',
      'exempt-guard',
      'first-band-open',
      'calc-first-band',
      'second-band-open',
      'calc-second-band',
      'top-band-open',
      'calc-top-band',
      'progressive-chain-close',
      'show-tax',
      'program-end'
    ]
  ],
  dependencies: [
    {
      beforeBlockId: 'program-start',
      afterBlockId: 'declare-values',
      feedback: 'A função principal precisa ser iniciada antes que as variáveis sejam declaradas.'
    },
    {
      beforeBlockId: 'declare-values',
      afterBlockId: 'read-salary',
      feedback: 'A variável salario precisa ser declarada antes de receber a entrada.'
    },
    {
      beforeBlockId: 'read-salary',
      afterBlockId: 'exempt-guard',
      feedback: 'O salário precisa ser lido antes da verificação de isenção.'
    },
    {
      beforeBlockId: 'exempt-guard',
      afterBlockId: 'first-band-open',
      feedback: 'A faixa isenta deve ser tratada antes das faixas tributáveis.'
    },
    {
      beforeBlockId: 'first-band-open',
      afterBlockId: 'calc-first-band',
      feedback: 'O cálculo de 8% deve ficar dentro da primeira faixa tributável.'
    },
    {
      beforeBlockId: 'calc-first-band',
      afterBlockId: 'second-band-open',
      feedback: 'Conclua o cálculo da primeira faixa antes do else if.'
    },
    {
      beforeBlockId: 'second-band-open',
      afterBlockId: 'calc-second-band',
      feedback: 'O cálculo de 18% deve ficar dentro da segunda faixa tributável.'
    },
    {
      beforeBlockId: 'calc-second-band',
      afterBlockId: 'top-band-open',
      feedback: 'Conclua o cálculo da segunda faixa antes do bloco else.'
    },
    {
      beforeBlockId: 'top-band-open',
      afterBlockId: 'calc-top-band',
      feedback: 'O cálculo de 28% deve ficar dentro do bloco else.'
    },
    {
      beforeBlockId: 'calc-top-band',
      afterBlockId: 'progressive-chain-close',
      feedback: 'Calcule a última faixa antes de fechar a cadeia condicional.'
    },
    {
      beforeBlockId: 'progressive-chain-close',
      afterBlockId: 'show-tax',
      feedback: 'Conclua a cadeia condicional antes de apresentar o imposto.'
    },
    {
      beforeBlockId: 'show-tax',
      afterBlockId: 'program-end',
      feedback: 'Apresente o resultado antes de encerrar a função principal.'
    }
  ],
  equivalentGroups: [],
  scopeRelationships: [
    {
      parentBlockId: 'first-band-open',
      childBlockIds: ['calc-first-band'],
      closingBlockId: 'second-band-open'
    },
    {
      parentBlockId: 'second-band-open',
      childBlockIds: ['calc-second-band'],
      closingBlockId: 'top-band-open'
    },
    {
      parentBlockId: 'top-band-open',
      childBlockIds: ['calc-top-band'],
      closingBlockId: 'progressive-chain-close'
    }
  ],
  hints: [
    'Pense nas faixas salariais em ordem crescente. Antes de calcular qualquer imposto, o programa precisa verificar se o salário está na faixa isenta.',
    'Depois da leitura, trate primeiro a isenção. Em seguida, organize uma cadeia com if, else if e else, mantendo cada cálculo dentro da faixa correspondente.',
    'O cálculo com 8% fica dentro da condição até R$ 3.000,00; o cálculo com 18% fica dentro da condição até R$ 4.500,00; e o cálculo com 28% fica dentro do else.'
  ],
  feedbackRules: [
    {
      id: 'declaration-after-read',
      condition: "indexOf('read-salary') < indexOf('declare-values')",
      relatedBlockIds: ['declare-values', 'read-salary'],
      priority: 100,
      message:
        'A leitura utiliza a variável salario. Verifique onde essa variável precisa ser declarada antes de receber um valor.'
    },
    {
      id: 'condition-before-input',
      condition: "indexOf('exempt-guard') < indexOf('read-salary') || indexOf('first-band-open') < indexOf('read-salary')",
      relatedBlockIds: ['read-salary', 'exempt-guard', 'first-band-open'],
      priority: 95,
      message:
        'Uma condição está utilizando salario antes que o valor tenha sido lido. Organize primeiro a entrada de dados.'
    },
    {
      id: 'tax-chain-before-exemption',
      condition: "indexOf('first-band-open') < indexOf('exempt-guard')",
      relatedBlockIds: ['exempt-guard', 'first-band-open'],
      priority: 90,
      message: 'Antes de calcular imposto, o programa precisa decidir se o salário está na faixa isenta.'
    },
    {
      id: 'first-calculation-outside-scope',
      condition: "notBetween('calc-first-band', 'first-band-open', 'second-band-open')",
      relatedBlockIds: ['first-band-open', 'calc-first-band', 'second-band-open'],
      priority: 88,
      message:
        'O cálculo de 8% precisa permanecer dentro da condição que trata a primeira faixa tributável.'
    },
    {
      id: 'second-branch-without-first-calculation',
      condition: "indexOf('second-band-open') < indexOf('calc-first-band')",
      relatedBlockIds: ['calc-first-band', 'second-band-open'],
      priority: 86,
      message: 'O else if inicia uma nova faixa. Conclua primeiro o processamento da faixa anterior.'
    },
    {
      id: 'second-calculation-outside-scope',
      condition: "notBetween('calc-second-band', 'second-band-open', 'top-band-open')",
      relatedBlockIds: ['second-band-open', 'calc-second-band', 'top-band-open'],
      priority: 84,
      message:
        'O cálculo que utiliza 18% deve ficar no escopo da condição para salários de até R$ 4.500,00.'
    },
    {
      id: 'else-before-second-calculation',
      condition: "indexOf('top-band-open') < indexOf('calc-second-band')",
      relatedBlockIds: ['calc-second-band', 'top-band-open'],
      priority: 82,
      message: 'O bloco else representa a faixa seguinte. Antes dele, finalize o cálculo da faixa de 18%.'
    },
    {
      id: 'top-calculation-outside-scope',
      condition: "notBetween('calc-top-band', 'top-band-open', 'progressive-chain-close')",
      relatedBlockIds: ['top-band-open', 'calc-top-band', 'progressive-chain-close'],
      priority: 80,
      message:
        'O cálculo de 28% deve permanecer dentro do else destinado aos salários acima de R$ 4.500,00.'
    },
    {
      id: 'chain-closed-too-early',
      condition: "indexOf('progressive-chain-close') < indexOf('calc-top-band')",
      relatedBlockIds: ['top-band-open', 'calc-top-band', 'progressive-chain-close'],
      priority: 78,
      message: 'A cadeia condicional foi fechada antes que o processamento da última faixa fosse realizado.'
    },
    {
      id: 'output-before-processing',
      condition: "indexOf('show-tax') < indexOf('progressive-chain-close')",
      relatedBlockIds: ['show-tax', 'calc-first-band', 'calc-second-band', 'calc-top-band', 'progressive-chain-close'],
      priority: 76,
      message: 'O imposto precisa ser calculado antes de ser exibido. Posicione a saída depois da cadeia de decisões.'
    },
    {
      id: 'program-ended-before-output',
      condition: "indexOf('program-end') < indexOf('show-tax')",
      relatedBlockIds: ['show-tax', 'program-end'],
      priority: 74,
      message: 'A função principal está sendo encerrada antes da apresentação do resultado tributável.'
    },
    {
      id: 'else-if-without-predecessor',
      condition: "indexOf('second-band-open') < indexOf('first-band-open') || indexOf('top-band-open') < indexOf('second-band-open')",
      relatedBlockIds: ['first-band-open', 'second-band-open', 'top-band-open'],
      priority: 72,
      message: 'Os blocos else if e else dependem da condição anterior. Verifique a sequência da cadeia condicional.'
    },
    {
      id: 'incomplete-solution',
      condition: 'placedBlockCount < 13',
      relatedBlockIds: [],
      priority: 60,
      message: 'A solução ainda está incompleta. Posicione todos os blocos antes de verificar a ordem.'
    }
  ],
  successFeedback:
    'Solução correta. O programa inicia declarando e lendo o salário. Em seguida, verifica primeiro a faixa isenta. Para os salários tributáveis, a cadeia if, else if e else organiza as faixas em ordem crescente e mantém cada cálculo dentro da condição correspondente. A variável imposto recebe o valor acumulado das faixas anteriores mais o percentual aplicado somente à parcela excedente. Por fim, o resultado é exibido com duas casas decimais. Essa organização demonstra o uso correto de decisões condicionais e expressões lógicas, conforme a competência CCI04.',
  status: 'published',
  createdAt: '2026-06-18'
};

export const CODE_ORDERING_CHALLENGES: CodeOrderingChallenge[] = [
  progressiveIncomeTaxOrderingChallenge
];

export const CODE_ORDERING_ACTIVITIES: WorkshopActivity[] = CODE_ORDERING_CHALLENGES
  .filter((challenge) => challenge.status === 'published')
  .map((challenge) => ({
    id: challenge.id,
    slug: challenge.slug,
    title: challenge.title,
    description: challenge.learningObjective,
    formatId: 'code-ordering',
    categoryId: challenge.categoryId,
    categoryLabel: challenge.categoryLabel,
    competencyId: challenge.competencyId,
    competencyLabel: challenge.competencyLabel,
    status: 'available',
    difficulty: challenge.difficulty,
    language: challenge.language.toUpperCase(),
    createdAt: challenge.createdAt
  }));

export function getCodeOrderingChallengeBySlug(slug: string): CodeOrderingChallenge | undefined {
  return CODE_ORDERING_CHALLENGES.find((challenge) => challenge.slug === slug);
}
