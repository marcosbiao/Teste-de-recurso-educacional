import type { ChallengeEvaluation } from '../types';

export const desafioLacosContar1TenEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio_lacos_contar_1_ten',
  rubric: [
    { id: 'crit1', criterion: 'O programa utiliza uma estrutura de repetição para produzir a sequência solicitada, em vez de repetir manualmente a mesma ação dez vezes.', essential: true, guidance: ['O objetivo pedagógico desta atividade é praticar laços; aceite for, while, do-while ou outra estrutura repetitiva equivalente.', 'Não considere dez comandos de saída escritos manualmente como atendimento completo deste critério, mesmo que a saída final esteja numericamente correta.', 'Avalie se a repetição realmente controla a produção sucessiva dos valores.'] },
    { id: 'crit2', criterion: 'O estado inicial do controle permite que o primeiro valor exibido seja 1.', essential: true, guidance: ['Não exija que a variável de controle seja literalmente inicializada com 1 se outra lógica equivalente produzir corretamente o primeiro valor 1.', 'Se o programa inicia o controle em 0, verifique o valor efetivamente exibido antes de considerar erro.', 'O importante é que a sequência observável comece em 1 sem incluir valores anteriores indevidos.'] },
    { id: 'crit3', criterion: 'O fluxo da repetição produz exatamente os valores de 1 até 10, incluindo ambos os limites e sem valores extras.', essential: true, guidance: ['Analise conjuntamente inicialização, condição de continuidade/parada, atualização e valor exibido.', 'Verifique erros de off-by-one: omitir o 10, incluir 0, incluir 11 ou executar quantidade incorreta de repetições.', 'Não conclua apenas pela forma textual da condição; considere o comportamento efetivo do laço.'] },
    { id: 'crit4', criterion: 'Cada repetição contribui para a exibição da sequência e os dez valores são apresentados na ordem correta.', essential: true, guidance: ['A saída deve ocorrer de modo que cada estado relevante da repetição seja apresentado.', 'Um único printf executado apenas após o término do laço não produz a sequência completa.', 'Aceite estruturas equivalentes em que a exibição esteja associada ao processamento repetitivo, mesmo que a organização sintática seja diferente da solução de referência.'] }
  ],
  referenceStrategies: ['Usar um laço com controle iniciando em 1, continuar enquanto o valor estiver dentro do limite 10, exibir o valor atual e avançar uma unidade a cada repetição.', 'Usar um laço condicional com uma variável de controle que produza sucessivamente 1, 2, 3, ..., 10 e encerre imediatamente após o décimo valor.'],
  commonErrors: [
    { error: 'Começar em 0 e exibir diretamente a variável de controle.', consequence: 'A saída inclui 0, que não pertence à sequência solicitada.' },
    { error: 'Encerrar a repetição antes de incluir o valor 10.', consequence: 'A sequência termina em 9 e não atende ao limite superior do enunciado.' },
    { error: 'Não atualizar a variável que controla a repetição.', consequence: 'O laço pode repetir indefinidamente o mesmo estado e não alcançar o término.' },
    { error: 'Atualizar o controle no momento errado e deslocar a sequência.', consequence: 'A saída pode começar em 2, terminar em 11 ou apresentar outro erro de off-by-one.' },
    { error: 'Exibir o valor apenas depois do término do laço.', consequence: 'O programa apresenta somente um estado final em vez dos dez valores da sequência.' }
  ]
};
