import type { ChallengeEvaluation } from '../types';

export const matrizesContarParesEvaluation: ChallengeEvaluation = {
  challengeId: 'matrizes_contar_pares',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza uma matriz bidimensional de inteiros 3x3 para armazenar os 9 valores.',
      essential: true,
      guidance: [
        'O uso efetivo da matriz faz parte do objetivo pedagógico.',
        'Não exija nome específico para a matriz.',
        'Aceite dimensões definidas por constantes quando a capacidade efetiva for 3x3.',
        'Os nove valores devem ser representados na estrutura bidimensional.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'O contador de elementos pares é inicializado em 0 antes do processo de contagem e preserva a quantidade acumulada.',
      essential: true,
      guidance: [
        'O contador representa quantidade de ocorrências e deve começar no estado neutro zero.',
        'Não exija nome específico para a variável contadora.',
        'A inicialização não deve ocorrer novamente a cada elemento processado.',
        'Uma variável não inicializada não fornece contagem confiável.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A matriz é percorrida nas duas dimensões com repetições aninhadas e controles independentes, cobrindo exatamente suas 9 posições válidas.',
      essential: true,
      guidance: [
        'O percurso deve representar linhas e colunas de forma independente.',
        'Não exija os nomes literais i e j.',
        'Aceite realizar leitura e teste de paridade na mesma varredura ou em duas varreduras separadas.',
        'Todos os nove elementos precisam ser processados e nenhum acesso pode ultrapassar os índices válidos 0, 1 e 2.',
        'Reutilizar simultaneamente a mesma variável de controle nos dois níveis pode impedir a varredura correta.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A decisão de paridade é aplicada ao valor armazenado na célula atual da matriz e identifica corretamente os elementos pares.',
      essential: true,
      guidance: [
        'A condição deve testar o conteúdo matriz[linha][coluna], não os índices de linha ou coluna.',
        'O operador módulo por 2 igual a zero é a estratégia de referência, mas aceite teste semanticamente equivalente de divisibilidade por 2.',
        'O valor zero é par e deve ser contado quando aparecer na matriz.',
        'Não considere suficiente testar apenas uma linha, uma coluna ou um subconjunto da matriz.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'O contador é incrementado somente para células pares e o total consolidado é exibido uma vez após o processamento completo.',
      essential: true,
      guidance: [
        'Cada elemento par deve acrescentar exatamente uma unidade à contagem.',
        'Elementos ímpares não devem incrementar o contador.',
        'A saída final deve representar a contagem total após todas as nove posições terem sido analisadas.',
        'Não considere impressões intermediárias dentro dos laços como substitutas do resultado consolidado.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher a matriz 3x3 com dois laços aninhados, iniciar contador em 0, percorrer todas as células e incrementar o contador quando o valor da célula for par; ao final, exibir o total.',
    'Durante o próprio preenchimento da matriz, testar cada valor recém-armazenado e atualizar o contador de pares, desde que todas as nove posições sejam armazenadas e processadas corretamente.'
  ],

  commonErrors: [
    {
      error: 'Testar a paridade do índice da linha ou da coluna em vez do valor da célula.',
      consequence: 'O programa classifica posições da matriz, não os números fornecidos.'
    },
    {
      error: 'Não inicializar o contador em 0 ou reinicializá-lo durante a varredura.',
      consequence: 'A quantidade acumulada de pares fica incorreta.'
    },
    {
      error: 'Incrementar o contador para todas as células.',
      consequence: 'O resultado passa a representar a quantidade total de elementos da matriz, não a quantidade de pares.'
    },
    {
      error: 'Usar a mesma variável de controle nos dois níveis de repetição.',
      consequence: 'O laço interno interfere no externo e a matriz pode não ser percorrida corretamente.'
    },
    {
      error: 'Analisar apenas uma linha ou uma coluna.',
      consequence: 'Elementos pares localizados nas demais posições deixam de participar da contagem.'
    },
    {
      error: 'Acessar posição com índice 3.',
      consequence: 'O programa ultrapassa os limites válidos da matriz 3x3.'
    },
    {
      error: 'Exibir a contagem dentro dos laços como se cada valor parcial fosse a resposta final.',
      consequence: 'A saída fica poluída com estados intermediários e não apresenta claramente o total consolidado.'
    }
  ]
};
