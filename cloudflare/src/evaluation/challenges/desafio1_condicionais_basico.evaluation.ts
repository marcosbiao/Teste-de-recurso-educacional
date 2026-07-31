import type { ChallengeEvaluation } from '../types';

export const desafio1CondicionaisBasicoEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio1_condicionais_basico',

  rubric: [
    {
      id: 'crit1',
      criterion: 'O programa lê corretamente um único valor inteiro fornecido pelo usuário e usa esse valor na classificação.',
      essential: true,
      guidance: [
        'O desafio solicita uma entrada inteira; a variável efetivamente classificada deve receber o valor fornecido pelo usuário.',
        'Uma chamada de leitura existente mas desconectada da variável usada nas condições não satisfaz o critério.',
        'Não exija nome específico para a variável.',
        'Verifique compatibilidade entre o tipo inteiro, o especificador de scanf e o endereço fornecido à leitura.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'A decisão organiza os três casos de forma mutuamente exclusiva por meio de uma cadeia condicional ou estrutura equivalente de exclusão.',
      essential: true,
      guidance: [
        'O objetivo pedagógico é praticar decisão encadeada entre casos mutuamente exclusivos.',
        'A forma de referência é if / else if / else.',
        'Aceite também uma organização semanticamente equivalente, como if seguido de else contendo nova decisão, desde que apenas um dos três resultados possa ser escolhido.',
        'Não aceite como atendimento pedagógico completo uma solução sem estrutura condicional.',
        'Não rejeite apenas por diferenças de formatação, chaves ou nomes quando o encadeamento lógico estiver correto.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'As condições distinguem corretamente valores maiores que zero, menores que zero e o caso restante zero.',
      essential: true,
      guidance: [
        'Valor > 0 deve ser classificado como positivo e valor < 0 como negativo.',
        'O zero pode ser identificado explicitamente com == 0 ou implicitamente por um else depois de excluir corretamente positivo e negativo.',
        'Não exija uma comparação explícita == 0 quando a estrutura lógica garante que o ramo restante só pode representar zero.',
        'Verifique possíveis inversões de operadores relacionais.',
        'Não confunda atribuição = com comparação == quando houver teste explícito de igualdade.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'A saída comunica de forma coerente e não contraditória a classificação correspondente ao caso identificado.',
      essential: false,
      guidance: [
        'A mensagem deve permitir reconhecer claramente positivo, negativo ou zero.',
        'Não exija acentuação, capitalização ou texto literalmente idêntico ao exemplo quando o significado estiver inequívoco.',
        'A saída selecionada precisa corresponder ao ramo lógico correto.',
        'Não deve haver duas classificações contraditórias para a mesma entrada.'
      ]
    }
  ],

  referenceStrategies: [
    'Ler um inteiro, testar primeiro se é maior que zero, depois se é menor que zero e usar o ramo restante para zero.',
    'Ler um inteiro e usar uma árvore condicional equivalente que separe de forma exclusiva positivo, negativo e zero.'
  ],

  commonErrors: [
    {
      error: 'Inverter as comparações de positivo e negativo.',
      consequence: 'Valores positivos são rotulados como negativos ou vice-versa.'
    },
    {
      error: 'Não tratar o zero como um terceiro caso.',
      consequence: 'A entrada 0 pode receber uma classificação incorreta ou nenhuma classificação.'
    },
    {
      error: 'Usar = no lugar de == em um teste explícito de igualdade.',
      consequence: 'A expressão deixa de representar uma comparação e pode alterar o valor da variável ou produzir decisão incorreta.'
    },
    {
      error: 'Ler uma variável e testar outra que não recebeu a entrada.',
      consequence: 'A classificação não corresponde ao número fornecido pelo usuário.'
    },
    {
      error: 'Produzir mais de uma mensagem de classificação para a mesma entrada.',
      consequence: 'A saída se torna contraditória em um problema cujos três casos são mutuamente exclusivos.'
    }
  ]
};
