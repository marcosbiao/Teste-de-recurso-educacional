import type { ChallengeEvaluation } from '../types';

export const desafioVetoresMaiorValorEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio_vetores_maior_valor',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza um vetor de inteiros com capacidade para armazenar os 5 valores solicitados.',
      essential: true,
      guidance: [
        'O uso efetivo do vetor faz parte do objetivo pedagógico; não aceite cinco variáveis escalares independentes como equivalente completo.',
        'Não exija nome específico para o vetor.',
        'Aceite tamanho definido por constante quando a capacidade efetiva corresponder a 5.',
        'O vetor deve ser realmente utilizado para preservar os valores lidos.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'Os 5 valores são lidos e armazenados nas posições válidas do vetor por meio de uma repetição indexada.',
      essential: true,
      guidance: [
        'Todos os cinco elementos devem receber valores fornecidos pelo usuário.',
        'A varredura deve permanecer dentro dos limites válidos do vetor.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'Não confunda quantidade textual de scanf com quantidade de leituras em execução; considere o fluxo do laço.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A busca do maior é inicializada a partir de um valor efetivamente pertencente ao vetor, de modo a funcionar também quando todos os números são negativos.',
      essential: true,
      guidance: [
        'Usar o primeiro elemento como hipótese inicial é a estratégia de referência.',
        'Inicializar o maior simplesmente com 0 não é correto para todos os casos válidos, pois o vetor pode conter somente números negativos.',
        'Aceite outra estratégia que inicialize o estado de máximo a partir de um elemento real do conjunto.',
        'Não exija literalmente vetor[0] quando uma organização equivalente utiliza corretamente o primeiro valor processado.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A varredura compara cada valor relevante do vetor com o maior acumulado e atualiza esse estado quando encontra um valor superior.',
      essential: true,
      guidance: [
        'A comparação deve envolver o conteúdo do vetor, e não apenas o índice.',
        'Comparar o índice com a variável de maior não satisfaz o critério.',
        'Quando um novo valor supera o maior acumulado, o estado de máximo deve passar a representar esse novo valor.',
        'Aceite começar a comparação na segunda posição quando a primeira já foi usada como hipótese inicial, ou outra organização semanticamente equivalente.',
        'Todos os elementos que ainda não foram incorporados à hipótese inicial devem participar da comparação.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'O maior valor encontrado é exibido somente após a busca estar concluída.',
      essential: true,
      guidance: [
        'A saída final deve utilizar o estado que representa o maior acumulado.',
        'Não considere correto exibir apenas o último valor lido ou o índice onde houve uma comparação.',
        'Impressões intermediárias durante a busca não substituem a apresentação final consolidada.',
        'O resultado deve permanecer correto para vetores contendo somente números negativos.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher o vetor de 5 inteiros, usar o primeiro elemento como maior inicial, percorrer os elementos restantes comparando-os com o maior acumulado e atualizar quando encontrar um valor superior; ao final, exibir o maior.',
    'Preencher o vetor e processar seus elementos em uma varredura equivalente que inicialize o máximo a partir do primeiro valor efetivamente considerado e mantenha esse estado durante as comparações restantes.'
  ],

  commonErrors: [
    {
      error: 'Inicializar o maior com 0.',
      consequence: 'O programa pode informar 0 mesmo quando todos os valores do vetor são negativos e 0 não foi fornecido.'
    },
    {
      error: 'Comparar o índice do laço com o maior acumulado.',
      consequence: 'A busca avalia posições do vetor em vez dos valores armazenados.'
    },
    {
      error: 'Encontrar um valor superior, mas não atualizar a variável que representa o maior.',
      consequence: 'O resultado final permanece preso a uma hipótese antiga.'
    },
    {
      error: 'Pular um dos elementos durante a varredura.',
      consequence: 'O verdadeiro maior pode estar justamente na posição que não foi comparada.'
    },
    {
      error: 'Acessar posição fora dos limites do vetor.',
      consequence: 'O programa realiza acesso inválido à memória e a análise do conjunto deixa de ser confiável.'
    },
    {
      error: 'Exibir o último elemento lido em vez do maior acumulado.',
      consequence: 'A saída representa a ordem de entrada, não o máximo do conjunto.'
    }
  ]
};
