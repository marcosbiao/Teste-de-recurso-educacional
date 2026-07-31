import type { ChallengeEvaluation } from '../types';

export const desafio4Divisivel3Ou5Evaluation: ChallengeEvaluation = {
  challengeId: 'desafio4_divisivel_3_ou_5',

  rubric: [
    {
      id: 'crit1',
      criterion: 'A solução verifica divisibilidade pelos dois divisores solicitados, 3 e 5, usando o operador módulo (%).',
      essential: true,
      guidance: [
        'O operador % faz parte do objetivo pedagógico desta atividade.',
        'Devem existir testes semanticamente associados tanto ao divisor 3 quanto ao divisor 5.',
        'Testar apenas um dos divisores não satisfaz o critério.',
        'Divisão comum / ou comparação direta com 3/5 não substituem o teste de resto.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'As duas condições de divisibilidade são combinadas com a lógica OU (||), de forma que basta ser divisível por 3, por 5 ou por ambos.',
      essential: true,
      guidance: [
        'O uso do operador lógico || é um objetivo pedagógico explícito deste desafio.',
        'A condição de sucesso deve ser verdadeira quando qualquer um dos dois restos for zero.',
        'Usar && exigiria divisibilidade simultânea por 3 e 5 e rejeitaria, por exemplo, 9 e 10.',
        'Não substitua pedagogicamente o || por uma solução completamente diferente que evite praticar o operador OU.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'Cada teste de divisibilidade compara o resto correspondente com zero de forma correta.',
      essential: true,
      guidance: [
        'Divisibilidade por 3 corresponde a numero % 3 == 0 e por 5 a numero % 5 == 0.',
        'A comparação deve ser aplicada ao resultado do módulo, não ao número original.',
        'Não confunda == com =.',
        'Parênteses adicionais são opcionais quando a precedência da expressão continua correta; não invente erro apenas pela ausência de parênteses redundantes.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'Existe tratamento coerente para o caso em que o número não é divisível nem por 3 nem por 5.',
      essential: false,
      guidance: [
        'A forma de referência usa else para o caso complementar.',
        'Aceite estrutura equivalente que emita uma resposta negativa apenas quando ambas as condições de divisibilidade forem falsas.',
        'Não interprete "caso negativo" como número inteiro negativo; trata-se do resultado negativo da decisão de divisibilidade.',
        'Números inteiros negativos também podem ser divisíveis por 3 ou 5 e devem seguir a mesma regra de resto zero.',
        'O valor 0 satisfaz numero % 3 == 0 e numero % 5 == 0 em C; não exija uma exclusão especial de zero que o enunciado não estabelece.'
      ]
    }
  ],

  referenceStrategies: [
    'Ler um inteiro e testar em um único if se numero % 3 == 0 || numero % 5 == 0, usando else para o caso em que nenhum divisor se aplica.',
    'Construir a mesma expressão de OU com os dois testes de resto zero e emitir mensagens claras para sucesso e fracasso.'
  ],

  commonErrors: [
    {
      error: 'Usar && no lugar de ||.',
      consequence: 'A solução aceita apenas números divisíveis simultaneamente por 3 e 5, rejeitando números divisíveis por apenas um deles.'
    },
    {
      error: 'Verificar somente divisibilidade por 3 ou somente por 5.',
      consequence: 'Parte dos números que deveria satisfazer o enunciado é rejeitada.'
    },
    {
      error: 'Usar / em vez de %.',
      consequence: 'O quociente da divisão não testa se o resto é zero.'
    },
    {
      error: 'Comparar o próprio número com 3 ou 5 em vez do resto.',
      consequence: 'A condição identifica valores específicos, não múltiplos dos divisores.'
    },
    {
      error: 'Usar = em vez de == ao comparar o resto com zero.',
      consequence: 'A expressão deixa de representar o teste de igualdade pretendido.'
    },
    {
      error: 'Tratar números negativos como automaticamente não divisíveis.',
      consequence: 'Múltiplos negativos de 3 ou 5 são classificados incorretamente.'
    },
    {
      error: 'Excluir 0 sem que o enunciado determine essa exceção.',
      consequence: 'O programa rejeita um valor cujo resto da divisão por 3 e por 5 é zero.'
    }
  ]
};
