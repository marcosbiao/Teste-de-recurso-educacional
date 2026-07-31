import type { ChallengeEvaluation } from '../types';

export const desafioVetoresContarParesEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio_vetores_contar_pares',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza um vetor de inteiros com capacidade para armazenar os 5 valores exigidos pelo enunciado.',
      essential: true,
      guidance: [
        'O uso de vetor faz parte do objetivo pedagógico desta atividade; cinco variáveis escalares independentes não satisfazem integralmente este critério.',
        'Não exija um nome específico para o vetor.',
        'Aceite tamanho definido por constante ou expressão equivalente quando a capacidade efetiva for exatamente 5.',
        'O vetor deve armazenar os dados fornecidos, e não existir apenas como declaração sem uso.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'O contador responsável pela quantidade de valores pares é inicializado em 0 antes do início da contagem.',
      essential: true,
      guidance: [
        'O contador representa quantidade de ocorrências, portanto deve começar em zero.',
        'A inicialização deve ocorrer antes do processo de contagem e não deve ser refeita a cada elemento.',
        'Não exija o nome literal pares; aceite qualquer variável que exerça semanticamente essa função.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'Os 5 elementos do vetor são lidos e processados por uma repetição indexada dentro dos limites válidos do vetor.',
      essential: true,
      guidance: [
        'Um vetor de tamanho 5 possui cinco posições válidas; a solução deve alcançar todos os cinco elementos sem acessar posição fora da capacidade.',
        'Aceite for, while ou outra estrutura repetitiva equivalente.',
        'Aceite realizar leitura e classificação no mesmo laço ou em laços separados, desde que os 5 valores sejam efetivamente armazenados e analisados.',
        'Não conclua apenas pela forma textual do limite; analise a quantidade real de elementos alcançados.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A decisão de paridade é aplicada ao valor armazenado no elemento atual do vetor e identifica corretamente os números pares.',
      essential: true,
      guidance: [
        'A condição deve analisar o conteúdo do vetor, e não o índice usado para acessar a posição.',
        'Testar a paridade do índice não informa se o valor armazenado naquela posição é par.',
        'O operador módulo por 2 igual a zero é a estratégia de referência, mas aceite outra verificação semanticamente equivalente de paridade.',
        'Verifique se a condição é aplicada ao elemento que está sendo processado na iteração atual.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'O contador é incrementado somente para elementos pares e o total consolidado é exibido após o processamento dos 5 valores.',
      essential: true,
      guidance: [
        'Incrementar o contador em toda iteração conta todos os elementos, não apenas os pares.',
        'A saída final deve representar a quantidade total encontrada depois que os valores relevantes forem processados.',
        'Não considere mensagens de entrada ou impressões parciais como substitutas do resultado consolidado.',
        'A variável exibida deve ser a mesma que representa a contagem efetivamente atualizada pela condição.'
      ]
    }
  ],

  referenceStrategies: [
    'Declarar um vetor inteiro de 5 posições, preencher seus elementos em laço, iniciar um contador em 0, percorrer o vetor verificando a paridade de cada elemento e incrementar o contador somente nos casos pares; ao final, exibir o total.',
    'Preencher cada posição do vetor e, no mesmo laço, testar o valor recém-armazenado e acumular a quantidade de pares, preservando todos os 5 valores no vetor e exibindo apenas o total consolidado ao final.'
  ],

  commonErrors: [
    {
      error: 'Testar a paridade do índice do vetor em vez do valor armazenado.',
      consequence: 'O programa classifica posições pares e ímpares, não os números fornecidos pelo usuário.'
    },
    {
      error: 'Não inicializar o contador em 0 ou reinicializá-lo dentro do laço.',
      consequence: 'A quantidade acumulada de pares fica incorreta.'
    },
    {
      error: 'Incrementar o contador em todas as iterações.',
      consequence: 'O resultado representa a quantidade de elementos do vetor, e não a quantidade de valores pares.'
    },
    {
      error: 'Processar menos de 5 elementos ou acessar uma posição além do vetor.',
      consequence: 'Parte das entradas fica sem análise ou ocorre acesso inválido à memória.'
    },
    {
      error: 'Ler valores sem armazená-los no vetor exigido pela atividade.',
      consequence: 'A solução deixa de praticar a estrutura vetorial que constitui o objetivo do desafio.'
    },
    {
      error: 'Exibir contagens intermediárias como resposta final.',
      consequence: 'A saída mostra estados parciais em vez da quantidade consolidada de pares.'
    }
  ]
};
