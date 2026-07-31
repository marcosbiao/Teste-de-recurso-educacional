import type { ChallengeEvaluation } from '../types';

export const desafio3EmprestimoSalarioEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio3_emprestimo_salario',

  rubric: [
    {
      id: 'crit1',
      criterion: 'Salário e prestação são representados e lidos com tipos de ponto flutuante adequados a valores que podem conter parte decimal.',
      essential: true,
      guidance: [
        'O objetivo pedagógico inclui o uso de float ou double para os valores monetários desta atividade.',
        'Ambas as entradas precisam participar da regra de decisão.',
        'Para float, scanf usa %f; para double, scanf usa %lf.',
        'Não exija float especificamente quando double estiver sendo usado corretamente.',
        'Não considere int equivalente completo neste desafio, mesmo que alguns exemplos inteiros produzam o mesmo resultado, pois a atividade prevê valores reais.'
      ]
    },
    {
      id: 'crit2',
      criterion: 'O limite de concessão é calculado como 20% do salário por uma expressão aritmeticamente correta.',
      essential: true,
      guidance: [
        'São corretas estratégias como salario * 0.2, salario * 0.20, salario * 20 / 100 quando salario é de ponto flutuante, ou expressões equivalentes.',
        'ATENÇÃO: salario * 20 / 100 com salario float/double é válido em C porque as operações permanecem em ponto flutuante.',
        'ATENÇÃO: salario * (20 / 100) é diferente quando 20 e 100 são inteiros, pois 20 / 100 resulta em 0 antes da multiplicação.',
        'Não marque automaticamente qualquer ocorrência de 20/100 como erro; analise a ordem efetiva das operações e os tipos envolvidos.',
        'Comparar a prestação diretamente com o salário inteiro, sem obter o limite percentual, não satisfaz o critério.'
      ]
    },
    {
      id: 'crit3',
      criterion: 'A decisão respeita exatamente a fronteira do enunciado: somente prestação estritamente maior que 20% do salário resulta em não concessão; igualdade ainda concede.',
      essential: true,
      guidance: [
        'A solução de referência testa prestacao > limite para o ramo de não concessão.',
        'Aceite também lógica invertida semanticamente equivalente, por exemplo testar prestacao <= limite para o ramo de concessão.',
        'Não exija literalmente o operador > se os ramos foram invertidos e a fronteira matemática permanece correta.',
        'Uma condição >= para bloquear altera o caso de igualdade e está incorreta.',
        'Verifique também se as mensagens dos ramos não foram trocadas em relação à condição.'
      ]
    },
    {
      id: 'crit4',
      criterion: 'As mensagens finais distinguem claramente empréstimo concedido de empréstimo não concedido e correspondem ao resultado da regra de 20%.',
      essential: false,
      guidance: [
        'O significado deve ser inequívoco nos dois casos.',
        'Não exija acentuação ou capitalização literalmente idêntica se a mensagem mantém o mesmo sentido.',
        'A mensagem de não concessão deve ocorrer apenas no lado da fronteira em que a prestação ultrapassa 20%.',
        'A mensagem de concessão deve incluir o caso de prestação exatamente igual ao limite.'
      ]
    }
  ],

  referenceStrategies: [
    'Ler salário e prestação como float/double, calcular limite = salario * 0.2 e negar o empréstimo quando prestacao > limite; caso contrário, conceder.',
    'Ler os dois valores reais e testar diretamente prestacao <= salario * 0.2 para conceder, usando o ramo complementar para não conceder.',
    'Calcular 20% como (salario * 20) / 100 com salario em ponto flutuante e aplicar a mesma fronteira estrita.'
  ],

  commonErrors: [
    {
      error: 'Usar int para representar salário e prestação.',
      consequence: 'Valores monetários com parte decimal não são representados adequadamente e a solução deixa de atender ao tipo previsto pela atividade.'
    },
    {
      error: 'Calcular o percentual como salario * (20 / 100) usando constantes inteiras.',
      consequence: 'A divisão inteira 20 / 100 produz 0 antes da multiplicação, tornando o limite incorreto.'
    },
    {
      error: 'Marcar salario * 20 / 100 como divisão inteira mesmo quando salario é float/double.',
      consequence: 'Esse diagnóstico seria falso: a presença do operando real mantém a expressão em ponto flutuante.'
    },
    {
      error: 'Comparar a prestação diretamente com o salário total.',
      consequence: 'A regra de negócio de 20% não é aplicada.'
    },
    {
      error: 'Usar >= para negar o empréstimo.',
      consequence: 'Uma prestação exatamente igual a 20% é bloqueada, contrariando o enunciado.'
    },
    {
      error: 'Inverter as mensagens dos ramos.',
      consequence: 'O cálculo pode estar correto, mas o programa comunica a decisão oposta.'
    },
    {
      error: 'Usar especificador de scanf incompatível com float ou double.',
      consequence: 'A leitura dos valores pode produzir comportamento incorreto ou indefinido.'
    }
  ]
};
