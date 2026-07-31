import type { ChallengeEvaluation } from '../types';

export const desafio5OrdemCrescenteTresNumerosEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio5_ordem_crescente_tres_numeros',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa lê corretamente três valores inteiros distintos como entradas do problema e usa os três na ordenação.',
      essential: true,
      guidance: [
        'Os três valores fornecidos devem participar da lógica que produz a saída ordenada.',
        'Uma única chamada scanf pode ler os três valores; não confunda quantidade de chamadas com quantidade de entradas.',
        'Não exija nomes específicos como a, b e c.',
        'O tipo esperado pela atividade é inteiro.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'A solução utiliza comparações condicionais suficientes para estabelecer a relação de ordem entre os três valores.',
      essential: true,
      guidance: [
        'A estratégia de referência identifica o menor usando comparações combinadas com && e depois ordena os dois restantes.',
        'Aceite essa estratégia com && como correta.',
        'Também aceite outra estratégia condicional semanticamente correta, como trocas condicionais sucessivas entre pares, desde que continue praticando decisões/comparações e garanta ordenação completa.',
        'Não exija literalmente encontrar o menor primeiro se outra lógica condicional alcança corretamente o mesmo resultado.',
        'Não considere uma biblioteca pronta de ordenação ou saída fixa como equivalente pedagógico à lógica condicional deste desafio.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A lógica produz ordem não decrescente para qualquer permutação dos três valores, sem depender da ordem original das entradas.',
      essential: true,
      guidance: [
        'Para três valores distintos existem seis ordens possíveis de entrada e todas devem levar à mesma relação final menor <= intermediário <= maior.',
        'Não é necessário haver seis blocos textuais explícitos se uma estratégia mais compacta cobre todos os casos.',
        'Verifique especialmente situações em que o segundo ou o terceiro valor é o menor.',
        'A saída não pode funcionar apenas para entradas já crescentes ou apenas para alguns arranjos.',
        'O critério é comportamental: cobertura completa das permutações, não contagem textual de ifs.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A solução também mantém ordem crescente válida quando dois ou três valores são iguais.',
      essential: false,
      guidance: [
        'Usar <= é uma estratégia de referência que facilita empates, mas não é a única implementação correta.',
        'Uma solução baseada em comparações > e trocas também pode ordenar corretamente valores iguais sem usar <=.',
        'Não penalize automaticamente a ausência de <=; avalie o comportamento nos casos de igualdade.',
        'Quando há empate, qualquer ordem entre valores numericamente iguais é equivalente, desde que a sequência final continue não decrescente.'
      ]
    }
  ],

  referenceStrategies: [
    'Identificar qual dos três valores é o menor com comparações combinadas e, dentro desse caso, comparar os dois restantes para definir a segunda e terceira posições.',
    'Usar trocas condicionais sucessivas entre pares, por exemplo corrigindo a ordem de a e b, depois b e c e novamente a e b quando necessário, até garantir a <= b <= c.',
    'Usar uma árvore de decisões exaustiva que cubra semanticamente todas as permutações dos três valores e produza uma única saída crescente.'
  ],

  commonErrors: [
    {
      error: 'Supor uma ordem fixa de entrada.',
      consequence: 'O programa funciona apenas quando os números chegam em uma combinação específica.'
    },
    {
      error: 'Tratar apenas o caso em que o primeiro valor é o menor.',
      consequence: 'Entradas em que o segundo ou o terceiro valor é o menor produzem ordem incorreta.'
    },
    {
      error: 'Cobrir apenas parte das seis permutações dos três valores.',
      consequence: 'Existem combinações válidas de entrada sem caminho lógico correto.'
    },
    {
      error: 'Imprimir os valores em ordem decrescente em um ou mais ramos.',
      consequence: 'A saída viola a relação menor para maior solicitada.'
    },
    {
      error: 'Usar ifs independentes que podem produzir múltiplas saídas para uma única entrada.',
      consequence: 'O programa pode imprimir mais de uma sequência ordenada ou resultados contraditórios.'
    },
    {
      error: 'Considerar obrigatório o uso literal de && mesmo quando uma estratégia de trocas condicionais ordena corretamente os três valores.',
      consequence: 'A análise rejeitaria uma solução condicional semanticamente correta apenas por diferença de estratégia.'
    },
    {
      error: 'Falhar quando existem valores iguais.',
      consequence: 'Entradas válidas com empate podem ficar sem ramo aplicável ou produzir ordem incorreta.'
    }
  ]
};
