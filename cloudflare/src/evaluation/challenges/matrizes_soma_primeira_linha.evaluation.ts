import type { ChallengeEvaluation } from '../types';

export const matrizesSomaPrimeiraLinhaEvaluation: ChallengeEvaluation = {
  challengeId: 'matrizes_soma_primeira_linha',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza uma matriz bidimensional de inteiros 3x3 para armazenar os 9 valores.',
      essential: true,
      guidance: [
        'O uso efetivo de matriz faz parte do objetivo pedagógico.',
        'Não exija nome específico para a matriz.',
        'Aceite dimensões definidas por constantes quando a capacidade efetiva for 3x3.',
        'Os valores fornecidos precisam ser preservados na estrutura bidimensional.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'O programa percorre as duas dimensões da matriz por repetições aninhadas para capturar exatamente os 9 valores.',
      essential: true,
      guidance: [
        'O preenchimento deve alcançar as três linhas e as três colunas.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'O percurso deve permanecer dentro dos índices válidos 0, 1 e 2.',
        'Não confunda uma única instrução scanf dentro dos laços com apenas uma leitura; considere seu número de execuções.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'Cada valor lido é armazenado na célula correspondente à linha e à coluna que estão sendo percorridas.',
      essential: true,
      guidance: [
        'A leitura deve preencher efetivamente a matriz bidimensional, e não uma variável escalar isolada reutilizada sem armazenamento.',
        'A estratégia de referência usa scanf com endereço de matriz[linha][coluna].',
        'Aceite nomes diferentes de matriz e iteradores.',
        'O endereço fornecido à leitura deve corresponder à célula atual da varredura.',
        'Não exija o texto literal scanf("%d", &matriz[i][j]) se outra forma semanticamente equivalente realiza a mesma leitura indexada.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A soma é restrita exclusivamente aos três elementos da primeira linha da matriz, isto é, à linha de índice 0.',
      essential: true,
      guidance: [
        'Em C, a primeira linha de uma matriz 3x3 possui índice 0.',
        'Aceite um laço sobre as colunas usando matriz[0][coluna], a soma direta matriz[0][0] + matriz[0][1] + matriz[0][2], ou forma equivalente.',
        'Não confunda a primeira linha com a linha de índice 1.',
        'Não confunda primeira linha com primeira coluna: matriz[coluna][0] percorre a primeira coluna, não a primeira linha.',
        'Não incluir elementos das linhas de índice 1 ou 2.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'O programa exibe ao final o total consolidado correspondente apenas à soma da primeira linha.',
      essential: true,
      guidance: [
        'A saída deve ocorrer depois que os três elementos da primeira linha forem considerados.',
        'Não considere impressões intermediárias durante o preenchimento ou a soma como substitutas do resultado final.',
        'A variável ou expressão exibida deve representar exatamente a soma da linha de índice 0.',
        'Se a solução usa acumulador, ele deve ser inicializado de forma adequada antes da soma; se usa expressão direta, não exija acumulador desnecessariamente.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher a matriz 3x3 com dois laços aninhados, iniciar um acumulador e percorrer as três colunas da linha 0 somando matriz[0][coluna]; ao final, exibir o total.',
    'Após preencher a matriz, calcular diretamente matriz[0][0] + matriz[0][1] + matriz[0][2] e apresentar a soma.',
    'Durante o preenchimento, acumular somente quando a linha corrente for 0, desde que todos os nove valores continuem sendo armazenados corretamente na matriz.'
  ],

  commonErrors: [
    {
      error: 'Somar todos os elementos da matriz.',
      consequence: 'O resultado representa as três linhas, e não apenas a primeira linha solicitada.'
    },
    {
      error: 'Usar a linha de índice 1 como primeira linha.',
      consequence: 'O programa soma a segunda linha devido à confusão com indexação iniciada em zero.'
    },
    {
      error: 'Usar matriz[coluna][0] para percorrer a primeira linha.',
      consequence: 'A solução soma a primeira coluna em vez da primeira linha.'
    },
    {
      error: 'Incluir elementos das linhas 1 ou 2 no acumulador.',
      consequence: 'A soma final contém valores que estão fora do subconjunto solicitado.'
    },
    {
      error: 'Omitir uma das três colunas da linha 0.',
      consequence: 'A soma da primeira linha fica incompleta.'
    },
    {
      error: 'Ler os valores sem armazená-los nas células da matriz.',
      consequence: 'A solução deixa de utilizar corretamente a estrutura bidimensional exigida pela atividade.'
    },
    {
      error: 'Exibir um total parcial antes de concluir a soma da linha.',
      consequence: 'A saída não representa o resultado consolidado solicitado.'
    }
  ]
};
