import type { ChallengeEvaluation } from '../types';

export const desafioMatrizesSoma2x2Evaluation: ChallengeEvaluation = {
  challengeId: 'desafio_matrizes_soma_2x2',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza uma matriz bidimensional de inteiros com exatamente 2 linhas e 2 colunas para armazenar os 4 valores.',
      essential: true,
      guidance: [
        'O uso efetivo de matriz bidimensional faz parte do objetivo pedagógico desta atividade.',
        'Quatro variáveis escalares independentes não satisfazem integralmente este critério.',
        'Não exija nome específico para a matriz.',
        'Aceite dimensões definidas por constantes ou expressões equivalentes quando a capacidade efetiva for 2x2.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'O programa percorre as dimensões de linha e coluna por meio de uma estrutura de repetição aninhada que alcança exatamente as 4 posições válidas da matriz.',
      essential: true,
      guidance: [
        'O objetivo pedagógico inclui o percurso bidimensional com repetição aninhada.',
        'Aceite for, while, do-while ou estrutura repetitiva equivalente.',
        'A varredura deve alcançar todas as combinações válidas das duas linhas e duas colunas sem acessar posições fora da matriz.',
        'Analise o comportamento efetivo dos limites, não apenas a forma textual das condições.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'Os níveis de repetição possuem controles independentes para representar linha e coluna sem que um laço corrompa o progresso do outro.',
      essential: true,
      guidance: [
        'Não exija os nomes literais i e j.',
        'Os controles podem ser declarados em escopos diferentes, mas precisam representar de forma independente as duas dimensões.',
        'Reutilizar simultaneamente a mesma variável de controle no laço externo e no interno pode alterar o estado do laço externo e impedir o percurso correto.',
        'Não marque como erro apenas porque os nomes dos iteradores são diferentes dos exemplos.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A soma acumulada começa em 0 e incorpora corretamente os valores das 4 posições da matriz sem perder o total anterior.',
      essential: true,
      guidance: [
        'O acumulador deve possuir estado inicial neutro igual a zero antes da acumulação.',
        'A acumulação pode ocorrer no mesmo percurso da leitura ou em uma varredura posterior.',
        'Cada um dos quatro elementos deve participar exatamente uma vez da soma final.',
        'Substituir o acumulador pelo elemento atual, em vez de acrescentar ao total anterior, não satisfaz este critério.',
        'Não exija uma expressão textual específica como soma = soma + matriz[i][j]; aceite += ou outra forma semanticamente equivalente.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'O programa exibe ao final um único resultado consolidado correspondente à soma dos 4 elementos da matriz.',
      essential: true,
      guidance: [
        'A saída deve representar o total após todos os elementos terem participado da soma.',
        'Não considere impressões intermediárias durante o percurso como substitutas do resultado final.',
        'A variável exibida deve ser a que realmente contém a soma acumulada.',
        'O resultado deve permanecer correto também quando houver valores negativos ou zero.'
      ]
    }
  ],

  referenceStrategies: [
    'Declarar uma matriz inteira 2x2, iniciar soma em 0, usar dois laços aninhados com controles independentes para ler cada posição e acumular seu valor, e depois exibir o total.',
    'Preencher a matriz 2x2 em uma varredura bidimensional e realizar uma segunda varredura aninhada equivalente para somar todas as quatro posições antes de apresentar o resultado.'
  ],

  commonErrors: [
    {
      error: 'Usar apenas um índice para acessar uma matriz bidimensional.',
      consequence: 'O programa não referencia corretamente uma célula específica definida por linha e coluna.'
    },
    {
      error: 'Usar a mesma variável de controle simultaneamente nos dois laços aninhados.',
      consequence: 'O laço interno altera o controle do laço externo e o percurso das quatro posições pode ficar incorreto ou não terminar como esperado.'
    },
    {
      error: 'Não inicializar o acumulador em 0 ou reinicializá-lo durante o percurso.',
      consequence: 'A soma final parte de estado indefinido ou perde valores já acumulados.'
    },
    {
      error: 'Substituir a soma pelo elemento atual em vez de acumulá-lo.',
      consequence: 'Ao final permanece apenas um dos elementos, e não o total das quatro posições.'
    },
    {
      error: 'Usar limites que alcançam índice 2 em uma dimensão de tamanho 2.',
      consequence: 'O programa acessa posição fora dos limites válidos da matriz.'
    },
    {
      error: 'Omitir uma das quatro posições no percurso.',
      consequence: 'A soma final não representa todos os elementos fornecidos.'
    },
    {
      error: 'Exibir a soma dentro dos laços como se cada valor intermediário fosse a resposta final.',
      consequence: 'A saída apresenta totais parciais em vez de um único resultado consolidado.'
    }
  ]
};
