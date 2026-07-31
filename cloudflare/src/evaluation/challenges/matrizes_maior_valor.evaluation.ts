import type { ChallengeEvaluation } from '../types';

export const matrizesMaiorValorEvaluation: ChallengeEvaluation = {
  challengeId: 'matrizes_maior_valor',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza uma matriz bidimensional de inteiros 3x3 para armazenar os 9 valores.',
      essential: true,
      guidance: [
        'O uso efetivo da matriz faz parte do objetivo pedagógico.',
        'Não exija nome específico para a matriz.',
        'Aceite dimensões definidas por constantes quando a capacidade efetiva for 3x3.',
        'Os nove valores fornecidos devem ser representados na estrutura.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'Os 9 valores são lidos e armazenados em todas as posições válidas da matriz por um percurso bidimensional com repetições aninhadas.',
      essential: true,
      guidance: [
        'Todos os nove elementos precisam receber entradas válidas.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'O percurso deve cobrir três linhas e três colunas sem acessar índice 3.',
        'Não confunda uma única instrução scanf dentro dos laços com apenas uma leitura; considere seu número real de execuções.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'O estado inicial usado para representar o maior é obtido de um valor real pertencente à matriz, permitindo funcionar corretamente mesmo quando todos os elementos são negativos.',
      essential: true,
      guidance: [
        'Usar matriz[0][0] é a estratégia de referência.',
        'Também aceite inicializar o maior com a primeira célula efetivamente lida ou outra célula válida que esteja garantidamente preenchida antes das comparações.',
        'Inicializar simplesmente com 0 não é correto para todos os casos, pois a matriz pode conter somente números negativos.',
        'Não exija literalmente o acesso [0][0] se outra estratégia usa corretamente um elemento real da matriz.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A varredura compara os elementos relevantes da matriz com o maior acumulado e considera todas as posições necessárias para determinar o máximo.',
      essential: true,
      guidance: [
        'A comparação deve ser aplicada ao valor armazenado na célula atual, não aos índices.',
        'Todos os elementos que ainda não foram incorporados ao estado inicial precisam participar da busca.',
        'Aceite uma segunda varredura completa ou uma busca integrada à própria leitura, desde que o máximo seja inicializado de forma segura e todas as nove entradas sejam consideradas.',
        'Comparar uma célula com ela mesma ou comparar apenas índices não satisfaz o critério.',
        'A relação esperada é encontrar o maior valor numérico comum da matriz.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'Quando uma célula supera o maior acumulado, o estado de máximo é atualizado, e o maior valor final é exibido uma única vez após a busca.',
      essential: true,
      guidance: [
        'A atualização deve armazenar o valor da célula que superou o máximo anterior.',
        'A saída final deve usar o estado que representa o maior encontrado, não o último valor lido nem um índice.',
        'Não considere impressões intermediárias como substitutas do resultado final consolidado.',
        'O resultado deve funcionar para matrizes inteiramente negativas.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher a matriz 3x3, inicializar o maior com uma célula real como matriz[0][0], percorrer todas as células e atualizar o maior quando encontrar valor superior; ao final, exibir o máximo.',
    'Durante o preenchimento, usar a primeira entrada efetiva para inicializar o máximo e comparar cada entrada seguinte com o maior acumulado, preservando todos os valores na matriz e exibindo o resultado apenas ao final.'
  ],

  commonErrors: [
    {
      error: 'Inicializar o maior com 0.',
      consequence: 'Se todos os elementos forem negativos, o programa pode informar 0 mesmo que esse valor não exista na matriz.'
    },
    {
      error: 'Comparar índices de linha ou coluna com o maior em vez do conteúdo da célula.',
      consequence: 'A busca avalia posições da matriz, não os valores fornecidos.'
    },
    {
      error: 'Encontrar uma célula superior sem atualizar o estado de máximo.',
      consequence: 'O resultado permanece preso a um valor anterior e pode não representar o verdadeiro maior.'
    },
    {
      error: 'Deixar uma linha, coluna ou célula fora da busca.',
      consequence: 'O verdadeiro maior pode estar justamente na posição não analisada.'
    },
    {
      error: 'Acessar índice 3 em uma dimensão de tamanho 3.',
      consequence: 'O programa ultrapassa os limites válidos da matriz.'
    },
    {
      error: 'Exibir o último valor lido em vez do maior acumulado.',
      consequence: 'A saída representa a ordem de entrada, não o máximo do conjunto.'
    },
    {
      error: 'Interpretar o desafio como busca do maior módulo matemático dos elementos.',
      consequence: 'A solução pode escolher, por exemplo, -20 no lugar de -2 apenas porque |-20| é maior, contrariando o título, os exemplos e a solução de referência do desafio.'
    }
  ]
};
