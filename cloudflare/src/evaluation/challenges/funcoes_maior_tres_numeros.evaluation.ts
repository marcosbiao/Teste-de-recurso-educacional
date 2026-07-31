import type { ChallengeEvaluation } from '../types';

export const funcoesMaiorTresNumerosEvaluation: ChallengeEvaluation = {
  challengeId: 'funcoes_maior_tres_numeros',

  rubric: [
    {
      id: 'crit_leitura_main',
      criterion: 'Os três números inteiros são lidos no escopo principal e enviados à lógica modular por meio de parâmetros.',
      essential: true,
      guidance: [
        'O enunciado define explicitamente que a leitura deve ocorrer no main.',
        'As três entradas precisam ser obtidas no escopo principal antes de serem usadas pela função que determina o maior.',
        'Uma única chamada scanf pode ler os três números; não confunda quantidade de chamadas com quantidade de valores lidos.',
        'Não considere correto mover a coleta de dados para dentro da função de cálculo ou do procedimento de saída.',
        'Não exija nomes específicos para as variáveis.'
      ]
    },
    {
      id: 'crit_funcao_int',
      criterion: 'Existe uma função de cálculo com tipo de retorno int responsável por determinar o maior valor entre os três inteiros.',
      essential: true,
      guidance: [
        'O objetivo pedagógico é diferenciar uma função que devolve um resultado de um procedimento void.',
        'A função que determina o maior deve possuir retorno int, pois o resultado solicitado é inteiro.',
        'Não exija o nome literal maiorTres.',
        'Uma função void que apenas imprime ou altera uma variável global não satisfaz este critério.',
        'A responsabilidade principal dessa função deve ser calcular/devolver o maior, não realizar a entrada ou substituir o procedimento de saída.'
      ]
    },
    {
      id: 'crit_tres_parametros',
      criterion: 'A função que determina o maior recebe os três valores inteiros por meio de três parâmetros.',
      essential: true,
      guidance: [
        'Os três números lidos no main devem chegar à função por parâmetros.',
        'Não exija os nomes literais a, b e c.',
        'Os parâmetros devem ser compatíveis com os três valores inteiros do problema.',
        'Ler dados dentro da função ou depender de variáveis globais no lugar dos três parâmetros não satisfaz o objetivo de passagem de parâmetros.',
        'A ordem dos nomes dos parâmetros é livre, desde que os três valores participem corretamente do cálculo.'
      ]
    },
    {
      id: 'crit_compara_tres',
      criterion: 'A lógica da função considera efetivamente os três valores e determina corretamente o maior para qualquer ordem de entrada, inclusive quando há empate no maior valor.',
      essential: true,
      guidance: [
        'Todos os três parâmetros precisam influenciar a determinação do máximo.',
        'A estratégia de referência inicializa o maior com o primeiro valor e depois compara o segundo e o terceiro, mas não é obrigatória.',
        'Aceite árvore condicional, operador ternário, comparações sucessivas ou outra estratégia dentro da função que produza corretamente o máximo dos três.',
        'Não exija exatamente duas instruções if.',
        'Não considere empate um erro: por exemplo, para 20, 7 e 20, o maior valor correto continua sendo 20.',
        'Verifique comportamento para situações em que o primeiro, o segundo ou o terceiro valor é o maior.'
      ]
    },
    {
      id: 'crit_return_maior',
      criterion: 'A função devolve ao ponto de chamada, por meio de return, o valor que representa o maior dos três números.',
      essential: true,
      guidance: [
        'O valor retornado deve ser o resultado da comparação dos três parâmetros.',
        'Imprimir o maior dentro da função não substitui return.',
        'Não exija que exista uma variável local chamada maior se a expressão retornada estiver correta.',
        'Aceite retorno direto de uma expressão ou variável equivalente desde que o valor devolvido seja o máximo correto.',
        'O return deve pertencer à função de cálculo, não apenas ao main.'
      ]
    },
    {
      id: 'crit_procedimento_void',
      criterion: 'Existe um procedimento void responsável por receber o maior valor calculado e informar esse resultado ao usuário.',
      essential: true,
      guidance: [
        'O procedimento de saída deve ser void porque sua responsabilidade é apresentar o resultado, não devolvê-lo ao chamador.',
        'Não exija o nome literal informarMaior.',
        'O procedimento deve receber ou obter por parâmetro o valor calculado que precisa apresentar.',
        'A saída principal do resultado deve ficar nesse procedimento, preservando a separação entre cálculo e apresentação.',
        'Não aceite como equivalente completo apenas um printf no main sem o procedimento solicitado.'
      ]
    },
    {
      id: 'crit_chamada_main',
      criterion: 'O main integra os módulos: chama a função de cálculo com os três valores e, usando o resultado devolvido, chama o procedimento de saída.',
      essential: true,
      guidance: [
        'A função de cálculo e o procedimento devem ser efetivamente chamados no fluxo do main.',
        'A estratégia de referência armazena o retorno em uma variável e depois passa essa variável ao procedimento.',
        'Aceite também composição direta como informarMaior(maiorTres(n1, n2, n3)) se a chamada ocorrer no main e preservar exatamente o fluxo função → resultado → procedimento.',
        'Não marque como erro apenas a ausência de uma variável intermediária quando o retorno da função é usado diretamente de forma correta.',
        'Criar função e procedimento sem chamá-los não satisfaz este critério.',
        'O procedimento não deve ser invocado exclusivamente de dentro da função de cálculo.'
      ]
    }
  ],

  referenceStrategies: [
    'No main, ler três inteiros; chamar uma função int que recebe os três valores, mantém uma hipótese de maior e a atualiza ao comparar os outros parâmetros; usar o retorno para chamar um procedimento void que exibe o resultado.',
    'No main, ler os três valores e passar diretamente o retorno de uma função de máximo com três parâmetros para um procedimento void de saída, desde que a função considere corretamente os três números.',
    'Dentro da função int, usar uma árvore condicional ou expressão equivalente para retornar o máximo dos três parâmetros; manter leitura no main e apresentação no procedimento.'
  ],

  commonErrors: [
    {
      error: 'Realizar scanf dentro da função que deveria apenas determinar o maior.',
      consequence: 'A solução mistura entrada com processamento e deixa de receber os três dados por parâmetros como solicitado.'
    },
    {
      error: 'Declarar a função de cálculo como void.',
      consequence: 'A função não pode devolver ao main o maior valor por meio de return.'
    },
    {
      error: 'Receber menos de três parâmetros na função de cálculo.',
      consequence: 'Um dos valores fornecidos não chega corretamente ao módulo responsável por determinar o máximo.'
    },
    {
      error: 'Comparar apenas dois dos três valores.',
      consequence: 'O terceiro número pode ser o maior e ainda assim ser ignorado.'
    },
    {
      error: 'Imprimir o resultado dentro da função de cálculo em vez de retorná-lo.',
      consequence: 'A solução perde a separação entre função de processamento e procedimento de saída.'
    },
    {
      error: 'Definir um procedimento de saída, mas não chamá-lo no main.',
      consequence: 'O módulo solicitado existe no código, mas não participa do fluxo real do programa.'
    },
    {
      error: 'Chamar o procedimento sem usar o valor retornado pela função de máximo.',
      consequence: 'A mensagem exibida pode não corresponder ao resultado calculado.'
    },
    {
      error: 'Tratar valores iguais como se não fosse possível determinar o maior.',
      consequence: 'Casos válidos com empate, como 20, 7 e 20, deixam de produzir o maior valor correto 20.'
    }
  ]
};
