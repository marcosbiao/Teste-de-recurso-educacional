import type { ChallengeEvaluation } from '../types';

export const desafioLacosSomarNEvaluation: ChallengeEvaluation = {
  challengeId: 'desafio_lacos_somar_n',
  rubric: [
    { id: 'crit1', criterion: 'O programa lê um valor inteiro N e utiliza esse valor como limite da soma solicitada.', essential: true, guidance: ['O enunciado fornece N como entrada; verifique se o valor lido realmente influencia o intervalo processado.', 'Não considere suficiente apenas existir uma chamada de leitura se o valor obtido não for usado como limite do cálculo.', 'O problema informa N positivo; não exija validação adicional de positividade como requisito essencial.'] },
    { id: 'crit2', criterion: 'O acumulador da soma é inicializado com o elemento neutro 0 antes de começar a acumulação.', essential: true, guidance: ['A inicialização deve ocorrer antes do processo repetitivo e não deve ser refeita a cada iteração.', 'Aceite qualquer nome de variável ou forma equivalente que garanta soma inicial igual a zero.', 'Uma variável não inicializada ou reinicializada dentro do laço não preserva corretamente o estado acumulado.'] },
    { id: 'crit3', criterion: 'A repetição percorre corretamente todos os inteiros de 1 até N, incluindo N.', essential: true, guidance: ['O objetivo pedagógico é praticar acumulação em laço; uma fórmula fechada sem repetição pode produzir a resposta matemática, mas não satisfaz integralmente este objetivo.', 'Analise inicialização, condição e atualização em conjunto para verificar o intervalo efetivo.', 'Verifique erros de off-by-one, especialmente a exclusão de N ou a inclusão de valores fora de 1 até N.', 'Aceite for, while, do-while ou estrutura repetitiva equivalente.'] },
    { id: 'crit4', criterion: 'A cada repetição, o valor corrente da sequência é incorporado à soma acumulada sem perder o total anterior.', essential: true, guidance: ['O acumulador deve preservar a soma anterior e acrescentar o valor correspondente à iteração atual.', 'Somar N em todas as iterações não equivale a somar 1 + 2 + ... + N.', 'Atribuir apenas o valor atual ao acumulador, substituindo o total anterior, não satisfaz este critério.', 'Não exija a expressão textual soma = soma + i; aceite formas equivalentes como += ou outra organização semanticamente correta.'] },
    { id: 'crit5', criterion: 'O programa exibe ao final o total acumulado correspondente à soma de 1 até N.', essential: true, guidance: ['A saída deve representar o acumulador final após todas as iterações.', 'Não confunda valores intermediários impressos durante o laço com o único resultado final solicitado.', 'Verifique se a variável exibida é a que realmente contém o total acumulado.'] }
  ],
  referenceStrategies: ['Ler N, iniciar um acumulador em 0, percorrer os valores de 1 até N e adicionar cada valor corrente ao acumulador; ao final, exibir o total.', 'Usar um laço condicional equivalente que mantenha um valor corrente e um acumulador, avançando até que todos os inteiros de 1 a N tenham sido somados.'],
  commonErrors: [
    { error: 'Usar um acumulador sem inicializá-lo com 0.', consequence: 'O resultado pode partir de um valor indefinido e produzir uma soma incorreta.' },
    { error: 'Reinicializar o acumulador dentro do laço.', consequence: 'A soma anterior é perdida em cada repetição e o total final não representa todos os valores.' },
    { error: 'Somar o limite N em todas as iterações em vez do valor corrente.', consequence: 'O programa calcula múltiplos de N, não a soma da sequência 1 até N.' },
    { error: 'Substituir o acumulador pelo valor corrente em vez de acumular.', consequence: 'Ao final permanece apenas um valor da sequência, e não a soma de todos eles.' },
    { error: 'Parar a repetição antes de processar N.', consequence: 'O limite superior fica fora da soma e o resultado final é menor que o esperado.' },
    { error: 'Exibir o acumulador dentro do laço como se cada valor intermediário fosse a resposta final.', consequence: 'O programa produz várias somas parciais quando o enunciado pede apenas o resultado consolidado.' }
  ]
};
