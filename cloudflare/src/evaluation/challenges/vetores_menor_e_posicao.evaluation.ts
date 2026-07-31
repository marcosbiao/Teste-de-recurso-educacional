import type { ChallengeEvaluation } from '../types';

export const vetoresMenorEPosicaoEvaluation: ChallengeEvaluation = {
  challengeId: 'vetores_menor_e_posicao',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa utiliza um vetor de inteiros com capacidade para armazenar os 10 valores solicitados.',
      essential: true,
      guidance: [
        'O uso efetivo de vetor faz parte do objetivo pedagógico desta atividade.',
        'Não exija nome específico para o vetor.',
        'Aceite tamanho definido por constante quando a capacidade efetiva for 10.',
        'Os dez valores fornecidos devem ser preservados no arranjo.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'Os 10 valores são lidos e armazenados nas posições válidas do vetor por meio de uma repetição indexada.',
      essential: true,
      guidance: [
        'Todos os dez elementos devem receber os valores fornecidos.',
        'Aceite for, while ou estrutura repetitiva equivalente.',
        'A leitura deve permanecer dentro dos limites válidos do vetor.',
        'Não confunda número de instruções de leitura escritas com número de leituras executadas pelo laço.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A busca do menor começa com um valor real do vetor e uma posição coerente com esse valor.',
      essential: true,
      guidance: [
        'A estratégia de referência é iniciar menor com o primeiro elemento e posição com o índice correspondente.',
        'Inicializar o menor arbitrariamente com 0 pode falhar quando todos os valores do vetor forem positivos.',
        'Aceite outra estratégia que use corretamente o primeiro elemento efetivamente processado e preserve sua posição.',
        'Valor mínimo e posição inicial devem referir-se ao mesmo elemento do vetor.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A varredura compara os valores relevantes do vetor com o menor acumulado e identifica corretamente quando um novo mínimo é encontrado.',
      essential: true,
      guidance: [
        'A comparação deve usar o conteúdo do vetor, não apenas o índice.',
        'Todos os elementos que ainda não foram usados para inicializar o mínimo devem participar da busca.',
        'Aceite começar a varredura na posição seguinte à usada como hipótese inicial ou outra organização semanticamente equivalente.',
        'O uso de < preserva a primeira ocorrência do mínimo; o uso de <= pode preservar a última ocorrência. Como o enunciado não define regra de desempate, aceite qualquer posição que realmente contenha o valor mínimo.'
      ]
    },
    {
      id: 'crit5',
      criterion: 'Quando o menor acumulado é atualizado, sua posição correspondente também é atualizada de forma coerente, e ambos são exibidos corretamente ao final.',
      essential: true,
      guidance: [
        'A variável de posição deve armazenar o índice do elemento mínimo, não o próprio valor encontrado.',
        'Sempre que a solução decide que um novo elemento passa a ser o menor, valor e posição precisam continuar referindo-se ao mesmo elemento.',
        'A saída final deve apresentar tanto o menor valor quanto um índice válido onde esse menor está armazenado.',
        'Se houver valores mínimos repetidos, aceite a primeira ou a última ocorrência quando a lógica usada for internamente consistente.'
      ]
    }
  ],

  referenceStrategies: [
    'Preencher o vetor de 10 inteiros, assumir o primeiro elemento como menor inicial e índice 0 como posição inicial, percorrer os demais elementos e atualizar simultaneamente menor e posição sempre que encontrar um valor inferior; ao final, exibir ambos.',
    'Usar uma varredura equivalente que inicialize mínimo e posição a partir do primeiro elemento realmente processado e mantenha o par valor/índice sincronizado durante toda a busca.'
  ],

  commonErrors: [
    {
      error: 'Inicializar o menor com 0.',
      consequence: 'Se todos os elementos forem positivos, o programa pode informar 0 mesmo que esse valor não exista no vetor.'
    },
    {
      error: 'Guardar o valor do elemento na variável de posição.',
      consequence: 'A saída informa um conteúdo do vetor como se fosse o índice onde o menor foi encontrado.'
    },
    {
      error: 'Atualizar o menor sem atualizar sua posição correspondente.',
      consequence: 'O valor final pode estar correto, mas o índice exibido aponta para outro elemento.'
    },
    {
      error: 'Atualizar a posição sem atualizar o menor acumulado.',
      consequence: 'O par valor/índice deixa de representar o mesmo elemento do vetor.'
    },
    {
      error: 'Comparar o índice do laço com o menor em vez do valor armazenado.',
      consequence: 'A busca avalia números de posição e não os dados fornecidos pelo usuário.'
    },
    {
      error: 'Omitir a última posição ou acessar posição além do vetor.',
      consequence: 'O verdadeiro mínimo pode deixar de ser analisado ou ocorrer acesso inválido à memória.'
    },
    {
      error: 'Exibir somente o menor valor e omitir sua posição.',
      consequence: 'A resposta fica incompleta em relação ao enunciado.'
    }
  ]
};
