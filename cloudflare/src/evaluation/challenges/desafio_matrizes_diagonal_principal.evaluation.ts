import type { ChallengeEvaluation } from '../types';

export const desafioMatrizesDiagonalPrincipalEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio_matrizes_diagonal_principal',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza uma matriz bidimensional de inteiros com dimensões 3x3 para armazenar os 9 valores.',
      essential: true,
      guidance: [
        'O uso efetivo de uma matriz 3x3 faz parte do objetivo pedagógico.',
        'Não exija nome específico para a matriz.',
        'Aceite dimensões definidas por constantes quando a capacidade efetiva for 3x3.',
        'Os valores fornecidos devem ser preservados na estrutura bidimensional.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'Os 9 valores são lidos e armazenados nas posições válidas da matriz por um percurso bidimensional com repetições aninhadas.',
      essential: true,
      guidance: [
        'O percurso de preenchimento deve cobrir as três linhas e três colunas.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'Os controles das duas dimensões devem permitir alcançar exatamente as nove posições válidas.',
        'Não confunda uma única instrução scanf dentro dos laços com apenas uma leitura; considere quantas vezes ela é executada.',
        'Não aceitar acesso a índice 3 em uma dimensão de tamanho 3.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'O programa seleciona exclusivamente os elementos da diagonal principal, isto é, posições em que o índice da linha é igual ao índice da coluna.',
      essential: true,
      guidance: [
        'Em uma matriz 3x3, a diagonal principal corresponde às posições [0][0], [1][1] e [2][2].',
        'Aceite um único laço acessando matriz[k][k], dois laços com condição linha == coluna, ou acesso direto às três posições da diagonal.',
        'Não confunda diagonal principal com diagonal secundária, formada por [0][2], [1][1] e [2][0].',
        'Não rejeite uma solução correta apenas porque ela não usa literalmente i == j.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'Os três valores da diagonal principal são exibidos de forma identificável, sem incluir elementos que estejam fora dessa diagonal.',
      essential: true,
      guidance: [
        'Todos os três elementos da diagonal principal precisam aparecer na saída.',
        'A formatação pode usar linhas separadas, espaços ou outra apresentação clara; não exija formato textual idêntico aos exemplos.',
        'Não considerar correta uma saída que exiba todos os nove elementos da matriz junto como se fossem a resposta solicitada.',
        'Se a solução usa um laço, a saída deve acompanhar apenas as posições selecionadas da diagonal.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher a matriz 3x3 com dois laços aninhados e, depois, usar um único laço de 0 a 2 para exibir matriz[k][k].',
    'Preencher a matriz e percorrê-la com dois laços, exibindo o elemento somente quando os índices de linha e coluna forem iguais.',
    'Após preencher a matriz, exibir diretamente as três posições [0][0], [1][1] e [2][2].'
  ],

  commonErrors: [
    {
      error: 'Exibir a diagonal secundária em vez da diagonal principal.',
      consequence: 'A saída contém posições em que linha e coluna não possuem o mesmo índice, exceto pelo elemento central.'
    },
    {
      error: 'Exibir todos os elementos da matriz sem filtrar a diagonal.',
      consequence: 'A resposta contém seis valores adicionais que não pertencem ao conjunto solicitado.'
    },
    {
      error: 'Acessar índice 3 em uma matriz 3x3.',
      consequence: 'O programa ultrapassa os limites válidos, que vão de 0 a 2 em cada dimensão.'
    },
    {
      error: 'Usar matriz[linha][coluna] em uma varredura completa sem restringir linha e coluna à mesma posição.',
      consequence: 'Elementos fora da diagonal principal também são apresentados.'
    },
    {
      error: 'Omitir um dos três elementos da diagonal principal.',
      consequence: 'A saída fica incompleta em relação às três posições exigidas.'
    },
    {
      error: 'Ler menos de nove valores e deixar posições da matriz sem preenchimento.',
      consequence: 'Um ou mais elementos da diagonal podem não representar entradas válidas fornecidas pelo usuário.'
    }
  ]
};
