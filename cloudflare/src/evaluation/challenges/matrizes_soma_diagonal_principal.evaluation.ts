import type { ChallengeEvaluation } from '../types';

export const matrizesSomaDiagonalPrincipalEvaluation: ChallengeEvaluation = {
  challengeId: 'matrizes_soma_diagonal_principal',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza uma matriz bidimensional de inteiros 3x3 para armazenar os 9 valores.',
      essential: true,
      guidance: [
        'O uso efetivo da matriz faz parte do objetivo pedagógico.',
        'Não exija nome específico para a matriz.',
        'Aceite dimensões definidas por constantes quando a capacidade efetiva for 3x3.',
        'Os nove valores devem ser armazenados na estrutura bidimensional.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'Os 9 valores são lidos e armazenados nas posições válidas da matriz por um percurso bidimensional com repetições aninhadas.',
      essential: true,
      guidance: [
        'O preenchimento deve alcançar três linhas e três colunas.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'Os controles das duas dimensões devem permitir alcançar exatamente as nove posições válidas.',
        'Não confunda uma instrução scanf dentro dos laços com apenas uma leitura; considere quantas vezes ela é executada.',
        'Não aceitar acesso ao índice 3.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'O acumulador usado para a soma da diagonal é inicializado em 0 antes de incorporar os elementos selecionados.',
      essential: true,
      guidance: [
        'Zero é o elemento neutro apropriado para iniciar uma soma acumulada.',
        'A inicialização deve ocorrer antes da acumulação e não ser repetida durante o percurso da diagonal.',
        'Não exija nome específico para o acumulador.',
        'Se a solução calcula diretamente a expressão dos três elementos sem usar acumulador, aceite o resultado semanticamente correto e não invente um erro apenas pela ausência de uma variável de soma explícita; nesse caso, interprete o critério pela equivalência funcional.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A soma inclui exclusivamente os três elementos da diagonal principal, correspondentes às posições em que linha e coluna possuem o mesmo índice.',
      essential: true,
      guidance: [
        'A diagonal principal de uma matriz 3x3 é formada por [0][0], [1][1] e [2][2].',
        'Aceite um laço simples usando matriz[k][k], dois laços com condição linha == coluna, ou soma direta das três posições corretas.',
        'Não confunda diagonal principal com diagonal secundária [0][2], [1][1], [2][0].',
        'Não some todos os nove elementos da matriz.',
        'Cada um dos três elementos da diagonal principal deve contribuir exatamente uma vez para o resultado.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'O programa exibe ao final a soma consolidada da diagonal principal após o cálculo estar completo.',
      essential: true,
      guidance: [
        'A saída deve representar a soma dos três elementos selecionados.',
        'Não considere impressões parciais durante o percurso como substitutas do total final.',
        'A variável ou expressão exibida deve corresponder ao resultado consolidado.',
        'A formatação textual pode variar; priorize o valor calculado corretamente.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher a matriz 3x3, iniciar soma em 0 e usar um laço de 0 a 2 adicionando matriz[k][k]; depois exibir o total.',
    'Preencher a matriz, percorrê-la com dois laços e acumular uma célula somente quando os índices de linha e coluna forem iguais.',
    'Após o preenchimento, calcular diretamente matriz[0][0] + matriz[1][1] + matriz[2][2] e exibir o resultado.'
  ],

  commonErrors: [
    {
      error: 'Somar a diagonal secundária.',
      consequence: 'O programa usa [0][2], [1][1] e [2][0] em vez das posições em que linha e coluna são iguais.'
    },
    {
      error: 'Somar todos os nove elementos da matriz.',
      consequence: 'O resultado representa o total da matriz inteira, não apenas a diagonal principal.'
    },
    {
      error: 'Não inicializar o acumulador em 0 ou reinicializá-lo durante a soma.',
      consequence: 'O total da diagonal pode partir de estado incorreto ou perder valores já acumulados.'
    },
    {
      error: 'Omitir uma das três posições da diagonal principal.',
      consequence: 'A soma final fica incompleta.'
    },
    {
      error: 'Adicionar uma posição fora da diagonal principal.',
      consequence: 'O resultado contém valor que não deveria participar do cálculo.'
    },
    {
      error: 'Acessar índice 3.',
      consequence: 'O programa ultrapassa os limites válidos da matriz 3x3.'
    },
    {
      error: 'Exibir uma soma parcial antes de concluir os três elementos.',
      consequence: 'A saída não representa o total consolidado solicitado.'
    }
  ]
};
