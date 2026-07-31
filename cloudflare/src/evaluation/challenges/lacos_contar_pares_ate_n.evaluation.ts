import type { ChallengeEvaluation } from '../types';

export const lacosContarParesAteNEvaluation: ChallengeEvaluation = {
  challengeId: 'lacos_contar_pares_ate_n',
  rubric: [
    { id: 'crit1', criterion: 'O programa lê um valor inteiro positivo N e utiliza esse valor como limite superior do intervalo analisado.', essential: true, guidance: ['Verifique se a entrada realmente controla até onde o processamento ocorre.', 'Não considere suficiente apenas existir scanf se N não participar da lógica do intervalo.', 'Como o enunciado fornece N positivo, não transforme validação de positividade em requisito essencial.'] },
    { id: 'crit2', criterion: 'A repetição cobre o intervalo de 1 até N de forma inclusiva para realizar a análise de paridade.', essential: true, guidance: ['Analise inicialização, condição e atualização em conjunto.', 'O valor N deve ser considerado, inclusive quando ele próprio for par.', 'Verifique erros de off-by-one como usar um limite que encerra antes de N.', 'Aceite for, while ou outra estrutura repetitiva equivalente.'] },
    { id: 'crit3', criterion: 'O contador de números pares começa em 0 e preserva corretamente a quantidade acumulada.', essential: true, guidance: ['A inicialização deve ocorrer antes da contagem e não ser repetida dentro do laço.', 'O contador representa quantidade de ocorrências, portanto zero é o estado neutro inicial.', 'Não exija um nome específico para a variável contadora.'] },
    { id: 'crit4', criterion: 'Cada valor do intervalo é submetido a uma decisão de paridade e somente valores pares satisfazem a condição de contagem.', essential: true, guidance: ['Esta atividade tem como objetivo combinar laço com teste condicional de paridade; a solução deve demonstrar essa decisão durante o percurso.', 'O operador módulo por 2 igual a zero é a estratégia de referência, mas aceite teste de divisibilidade semanticamente equivalente.', 'Verifique se a condição é aplicada ao valor corrente do intervalo, e não apenas a N ou a uma variável não atualizada.', 'O teste deve distinguir pares de ímpares antes de incrementar a contagem.'] },
    { id: 'crit5', criterion: 'O contador é incrementado apenas quando a condição de paridade é satisfeita e o total final é exibido após o processamento.', essential: true, guidance: ['Incrementar em toda iteração conta todos os números, não apenas os pares.', 'A saída final deve representar o total consolidado, não valores intermediários de contagem.', 'Verifique se a variável apresentada na saída é a contadora efetivamente atualizada pela condição.'] }
  ],
  referenceStrategies: ['Ler N, iniciar o contador de pares em 0, percorrer de 1 até N, testar a paridade de cada valor e incrementar o contador somente quando o valor for par; ao final, exibir a quantidade.', 'Usar um laço equivalente sobre o intervalo de 1 a N, mantendo uma decisão de divisibilidade por 2 para controlar quando a contagem deve aumentar.'],
  commonErrors: [
    { error: 'Incrementar o contador em todas as iterações.', consequence: 'O resultado passa a representar a quantidade total de números do intervalo, e não a quantidade de pares.' },
    { error: 'Aplicar o teste de paridade fora do processamento repetitivo.', consequence: 'Nem todos os valores do intervalo são avaliados individualmente.' },
    { error: 'Testar a paridade de N em todas as iterações em vez do valor corrente.', consequence: 'A mesma condição é repetida e os elementos do intervalo não são classificados corretamente.' },
    { error: 'Não inicializar o contador em 0 ou reinicializá-lo dentro do laço.', consequence: 'A quantidade acumulada de pares fica incorreta.' },
    { error: 'Encerrar o laço antes de analisar N.', consequence: 'Se N for par, esse último valor não é contado.' },
    { error: 'Exibir contagens intermediárias como resposta final.', consequence: 'O programa mostra resultados parciais em vez da quantidade consolidada pedida pelo enunciado.' }
  ]
};
