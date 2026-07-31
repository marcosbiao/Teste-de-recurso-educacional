import type { ChallengeEvaluation } from '../types';

export const vetoresPositivosNegativosZerosEvaluation: ChallengeEvaluation = {
  challengeId: 'vetores_positivos_negativos_zeros',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza um vetor de inteiros com capacidade para armazenar as 8 entradas solicitadas.',
      essential: true,
      guidance: [
        'O uso efetivo de vetor faz parte do objetivo pedagógico da atividade.',
        'Não exija nome específico para o vetor.',
        'Aceite tamanho definido por constante quando a capacidade efetiva for 8.',
        'Os oito valores fornecidos devem ser preservados no vetor.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'O programa mantém contagens separadas para positivos, negativos e zeros, todas corretamente iniciadas em 0 antes da classificação.',
      essential: true,
      guidance: [
        'A atividade pretende consolidar múltiplos contadores paralelos de classificação.',
        'Cada categoria precisa possuir estado de contagem coerente e iniciado em zero.',
        'Não exija nomes específicos como positivos, negativos ou zeros.',
        'Os contadores não devem ser reinicializados enquanto os elementos estão sendo classificados.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'Os 8 valores são lidos e armazenados nas posições válidas do vetor por meio de uma repetição indexada.',
      essential: true,
      guidance: [
        'Todos os oito elementos devem receber valores fornecidos pelo usuário.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'A leitura deve permanecer dentro dos limites válidos do vetor.',
        'Não confunda uma instrução de leitura dentro do laço com apenas uma entrada; considere quantas vezes ela é executada.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'Cada elemento do vetor é classificado de forma exclusiva como positivo, negativo ou zero, segundo sua relação com 0.',
      essential: true,
      guidance: [
        'Valores maiores que zero pertencem à categoria positiva; valores menores que zero pertencem à categoria negativa; o valor igual a zero pertence à categoria de zeros.',
        'A estrutura if / else if / else é a estratégia de referência e expressa diretamente a exclusividade das categorias.',
        'Aceite condições independentes quando forem realmente mutuamente exclusivas e garantirem exatamente uma classificação correta por elemento.',
        'Não considere o uso de três ifs independentes automaticamente incorreto apenas por não usar else if; avalie o comportamento efetivo.',
        'A condição deve ser aplicada ao conteúdo do vetor na posição atual, e não ao índice.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'O contador correspondente é incrementado exatamente uma vez para cada elemento classificado, e os três totais consolidados são exibidos ao final.',
      essential: true,
      guidance: [
        'Cada elemento deve contribuir para uma única categoria.',
        'Valores positivos não podem incrementar o contador de negativos ou zeros, e assim sucessivamente.',
        'Os três resultados finais devem representar as quantidades consolidadas depois que os 8 elementos forem processados.',
        'Não considere impressões intermediárias dentro da varredura como substitutas dos três resultados finais.',
        'A saída deve apresentar separadamente as quantidades de positivos, negativos e zeros.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher um vetor de 8 inteiros, iniciar três contadores em 0, percorrer o vetor e usar uma decisão mutuamente exclusiva para incrementar o contador de positivos, negativos ou zeros conforme cada elemento; ao final, exibir os três totais.',
    'Armazenar os oito valores e classificá-los durante uma varredura equivalente, mantendo três contagens separadas e garantindo que cada elemento contribua exatamente para uma categoria.'
  ],

  commonErrors: [
    {
      error: 'Esquecer de inicializar um ou mais contadores em 0.',
      consequence: 'As quantidades finais podem partir de estados indefinidos e produzir resultados incorretos.'
    },
    {
      error: 'Omitir o caso em que o elemento é igual a zero.',
      consequence: 'Parte dos valores do vetor deixa de ser classificada e a contagem de zeros fica incorreta.'
    },
    {
      error: 'Usar condições sobre o índice em vez do valor armazenado no vetor.',
      consequence: 'O programa classifica posições como positivas ou negativas em vez dos dados fornecidos.'
    },
    {
      error: 'Incrementar mais de um contador para o mesmo elemento.',
      consequence: 'Um único valor passa a ser contado em categorias múltiplas, distorcendo os totais.'
    },
    {
      error: 'Reinicializar os contadores durante a varredura.',
      consequence: 'As classificações anteriores são perdidas e o resultado final representa apenas parte do vetor.'
    },
    {
      error: 'Processar menos de 8 elementos ou ultrapassar os limites do vetor.',
      consequence: 'Parte dos dados fica sem classificação ou ocorre acesso inválido à memória.'
    },
    {
      error: 'Exibir os contadores durante cada iteração sem apresentar os totais consolidados ao final.',
      consequence: 'A saída contém estados parciais e não entrega claramente as três quantidades finais solicitadas.'
    }
  ]
};
