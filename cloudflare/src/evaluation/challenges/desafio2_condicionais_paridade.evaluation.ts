import type { ChallengeEvaluation } from '../types';

export const desafio2CondicionaisParidadeEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio2_condicionais_paridade',

  rubric: [
    {
      id: 'crit1',
      criterion: 'A paridade dos números positivos é determinada com o operador módulo por 2, identificando corretamente resto zero como par.',
      essential: true,
      guidance: [
        'O uso do operador % faz parte do objetivo pedagógico desta atividade.',
        'Para o caso positivo, n % 2 == 0 identifica par; o ramo complementar dentro do caso positivo pode representar ímpar.',
        'Não exija teste explícito n % 2 != 0 para ímpar quando ele é corretamente representado pelo else da decisão de paridade.',
        'Não aceite divisão comum por 2 como substituta do teste de resto exigido pedagogicamente.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'A decisão de paridade é subordinada ao caso positivo, de modo que somente números positivos sejam refinados em par ou ímpar.',
      essential: true,
      guidance: [
        'O problema possui uma hierarquia de decisões: primeiro distinguir positivo, negativo e zero; depois refinar apenas o grupo positivo.',
        'A forma de referência é um if de paridade dentro do ramo positivo.',
        'Aceite fluxo condicional semanticamente equivalente que garanta que o teste/classificação de paridade só possa produzir resultado para n > 0.',
        'Números negativos não devem receber como resultado final as classificações positivo par ou positivo ímpar.',
        'Não rejeite uma solução correta apenas porque a organização sintática difere da solução de referência, desde que a segunda decisão esteja logicamente condicionada à positividade.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'O valor zero é tratado separadamente e não é classificado como positivo par, positivo ímpar ou negativo.',
      essential: true,
      guidance: [
        'Matematicamente zero é par, mas neste desafio o enunciado define zero como uma categoria própria.',
        'Portanto, a saída para entrada 0 deve ser a categoria zero.',
        'O zero pode ser alcançado por um else final depois de excluir positivo e negativo; não exija necessariamente == 0 explícito.',
        'Não permita que a verificação de módulo antecipe a hierarquia e faça 0 cair na saída de positivo par.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'O programa produz quatro resultados finais distintos e coerentes: positivo par, positivo ímpar, negativo e zero.',
      essential: true,
      guidance: [
        'Cada classe de entrada deve conduzir a exatamente um resultado compatível.',
        'Não exija texto idêntico aos exemplos se o significado das quatro mensagens estiver claro.',
        'Uma entrada negativa não precisa ser refinada em paridade porque isso não foi solicitado.',
        'A saída deve manter distinção explícita entre positivo par e positivo ímpar.'
      ]
    }
  ],

  referenceStrategies: [
    'Ler o inteiro, testar se n > 0 e, dentro desse ramo, usar n % 2 == 0 para separar par e ímpar; tratar n < 0 em outro ramo e usar o restante para zero.',
    'Criar uma árvore de decisão equivalente em que o refinamento por módulo só seja alcançado depois de confirmar que o número pertence ao grupo positivo.'
  ],

  commonErrors: [
    {
      error: 'Testar a paridade antes de separar o caso zero.',
      consequence: 'Como 0 % 2 == 0, o zero pode ser classificado incorretamente como positivo par.'
    },
    {
      error: 'Classificar números negativos como positivo par ou positivo ímpar.',
      consequence: 'A lógica de paridade extrapola o grupo positivo definido pelo enunciado.'
    },
    {
      error: 'Usar divisão / 2 em vez do resto % 2 para determinar paridade.',
      consequence: 'O quociente da divisão não fornece diretamente o critério de divisibilidade por 2.'
    },
    {
      error: 'Usar uma condição de paridade que não identifica resto zero como par.',
      consequence: 'Valores positivos pares podem ser direcionados à categoria ímpar.'
    },
    {
      error: 'Omitir uma das quatro saídas possíveis.',
      consequence: 'Existe pelo menos uma classe de entrada sem classificação adequada.'
    }
  ]
};
