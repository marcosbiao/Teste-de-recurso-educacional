import type { ChallengeEvaluation } from '../types';

export const vetoresMediaSeisValoresEvaluation: ChallengeEvaluation = {
  challengeId: 'vetores_media_seis_valores',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza um vetor de ponto flutuante com capacidade para armazenar os 6 valores reais solicitados.',
      essential: true,
      guidance: [
        'O vetor deve utilizar tipo adequado a números reais, como float ou double.',
        'O uso efetivo do vetor faz parte do objetivo pedagógico; seis variáveis escalares independentes não satisfazem integralmente o critério.',
        'Não exija nome específico para o vetor.',
        'Aceite tamanho definido por constante quando a capacidade efetiva for 6.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'A repetição percorre exatamente as 6 posições válidas do vetor, sem omitir elementos nem acessar além da capacidade.',
      essential: true,
      guidance: [
        'A solução deve processar seis posições válidas.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'Não conclua apenas pela forma textual do limite; considere o conjunto efetivo de índices alcançados.',
        'Verifique erros de off-by-one que excluam uma posição ou tentem acessar uma sétima posição inexistente.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'Cada uma das 6 entradas reais é lida e armazenada no elemento correspondente do vetor com tipo, especificador e referência de memória compatíveis.',
      essential: true,
      guidance: [
        'Para float, scanf com %f e endereço do elemento é uma estratégia válida; para double, scanf deve usar o especificador compatível com double.',
        'Não exija literalmente %f quando o vetor for double e a leitura estiver corretamente configurada para esse tipo.',
        'A leitura deve fornecer o endereço do elemento a ser preenchido; omitir a referência de memória torna a chamada incorreta.',
        'Todos os seis valores devem ser realmente armazenados no vetor.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'Os 6 elementos do vetor participam de uma soma acumulada representada em tipo capaz de preservar valores reais.',
      essential: true,
      guidance: [
        'O acumulador deve preservar o total anterior e incorporar cada elemento do vetor.',
        'A soma pode ocorrer no mesmo laço da leitura ou em uma varredura posterior.',
        'O acumulador deve ser inicializado adequadamente antes da acumulação.',
        'Substituir o acumulador pelo elemento atual, em vez de somar ao total anterior, não satisfaz o critério.',
        'Não exija forma textual específica de adição quando o comportamento acumulativo estiver correto.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'A média aritmética dos 6 valores é calculada corretamente e exibida ao final com duas casas decimais.',
      essential: true,
      guidance: [
        'A média deve usar a soma dos seis valores e divisor 6.',
        'Se a soma já é float ou double, a expressão soma / 6 é válida em C e NÃO deve ser marcada como divisão inteira, pois as conversões usuais promovem o divisor para ponto flutuante.',
        'Também aceite soma / 6.0, casting explícito ou forma equivalente.',
        'A saída deve representar a média final, e não a soma ou um valor intermediário.',
        'O enunciado exige apresentação com duas casas decimais; verifique formatação equivalente a %.2f.'
      ]
    }
  ],

  referenceStrategies: [
    'Declarar um vetor float ou double de 6 posições, preencher todas as posições, acumular a soma dos seis elementos, dividir o total por 6 e exibir a média final com duas casas decimais.',
    'Durante a própria leitura dos seis elementos, armazenar cada valor no vetor e simultaneamente acumulá-lo em uma soma real; após completar o vetor, calcular e exibir a média.'
  ],

  commonErrors: [
    {
      error: 'Usar vetor inteiro para armazenar entradas decimais.',
      consequence: 'A parte fracionária dos valores pode ser perdida e a média deixa de representar corretamente as entradas.'
    },
    {
      error: 'Usar especificador de scanf incompatível com o tipo do vetor.',
      consequence: 'A leitura dos valores reais pode produzir comportamento incorreto ou indefinido.'
    },
    {
      error: 'Omitir o endereço do elemento do vetor na chamada de scanf.',
      consequence: 'A função de leitura não recebe um endereço válido para armazenar o valor.'
    },
    {
      error: 'Não inicializar a soma antes da acumulação ou reinicializá-la durante a varredura.',
      consequence: 'O total dos seis valores fica incorreto.'
    },
    {
      error: 'Substituir a soma pelo elemento atual em vez de acumular.',
      consequence: 'Ao final permanece apenas um valor, e não a soma necessária para calcular a média.'
    },
    {
      error: 'Processar menos ou mais de 6 posições.',
      consequence: 'A soma e a média deixam de representar exatamente os seis valores exigidos.'
    },
    {
      error: 'Exibir a média antes de completar o processamento dos seis elementos.',
      consequence: 'A saída representa um resultado parcial.'
    },
    {
      error: 'Exibir a média sem duas casas decimais.',
      consequence: 'A apresentação final não atende ao formato solicitado pelo enunciado.'
    }
  ]
};
