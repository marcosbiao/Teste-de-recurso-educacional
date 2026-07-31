import { describe, expect, it } from 'vitest';
import { buildAnalysisMessages } from '../src/ai/buildAnalysisPrompt';
import { getInternalChallenge } from '../src/catalog/challengeAnalysisCatalog';
import { getChallengeEvaluation } from '../src/evaluation/getChallengeEvaluation';

describe('avaliações privadas da categoria Funções', () => {
  it('registra os três desafios com criterionIds públicos e conteúdo privado no prompt', () => {
    const functionChallengeIds = [
      'funcoes_maior_tres_numeros',
      'funcoes_media_dois_numeros',
      'funcoes_distancia_entre_pontos',
    ];

    for (const challengeId of functionChallengeIds) {
      const internal = getInternalChallenge(challengeId);
      const evaluation = getChallengeEvaluation(challengeId);
      expect(internal).toBeDefined();
      expect(evaluation).toBeDefined();
      expect(evaluation!.challengeId).toBe(challengeId);
      expect(evaluation!.rubric.map((item) => item.id)).toEqual(internal!.expectedEvidence.map((item) => item.criterionId));
      expect(evaluation!.rubric.map(({ id, essential }) => ({ id, essential }))).toEqual(internal!.expectedEvidence.map(({ criterionId, importance }) => ({ id: criterionId, essential: importance === 'essencial' })));
      const guidance = evaluation!.rubric.flatMap((item) => item.guidance ?? []);
      expect(guidance).not.toHaveLength(0);
      expect(evaluation!.referenceStrategies).not.toHaveLength(0);
      expect(evaluation!.commonErrors).not.toHaveLength(0);
      const prompt = buildAnalysisMessages(internal!, { challengeId, studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');
      expect(prompt).toContain('RUBRICA_PRIVADA_CONFIAVEL');
      expect(prompt).toContain('ESTRATEGIAS_DE_REFERENCIA_PRIVADAS');
      expect(prompt).toContain('ERROS_COMUNS_PRIVADOS');
      const rubricSection = prompt.match(/<RUBRICA_PRIVADA_CONFIAVEL>\n([\s\S]*?)\n<\/RUBRICA_PRIVADA_CONFIAVEL>/);
      const strategiesSection = prompt.match(/<ESTRATEGIAS_DE_REFERENCIA_PRIVADAS>\n([\s\S]*?)\n<\/ESTRATEGIAS_DE_REFERENCIA_PRIVADAS>/);
      const commonErrorsSection = prompt.match(/<ERROS_COMUNS_PRIVADOS>\n([\s\S]*?)\n<\/ERROS_COMUNS_PRIVADOS>/);
      expect(rubricSection).not.toBeNull();
      expect(strategiesSection).not.toBeNull();
      expect(commonErrorsSection).not.toBeNull();
      expect(JSON.parse(rubricSection![1])).toEqual(evaluation!.rubric.map(({ id, criterion, essential, guidance }) => ({ criterionId: id, criterion, essential, guidance })));
      expect(JSON.parse(strategiesSection![1])).toEqual(evaluation!.referenceStrategies);
      expect(JSON.parse(commonErrorsSection![1])).toEqual(evaluation!.commonErrors);
    }

    expect(getChallengeEvaluation('desafio-sem-avaliacao-privada')).toBeUndefined();
  });

  it('mantém no prompt os cuidados pedagógicos específicos de Funções', () => {
    const promptFor = (challengeId: string) => buildAnalysisMessages(getInternalChallenge(challengeId)!, { challengeId, studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');

    const maiorPrompt = promptFor('funcoes_maior_tres_numeros');
    expect(maiorPrompt).toContain('Todos os três parâmetros precisam influenciar a determinação do máximo.');
    expect(maiorPrompt).toContain('Não considere empate um erro: por exemplo, para 20, 7 e 20, o maior valor correto continua sendo 20.');
    expect(maiorPrompt).toContain('A função que determina o maior deve possuir retorno int, pois o resultado solicitado é inteiro.');
    expect(maiorPrompt).toContain('O procedimento de saída deve ser void porque sua responsabilidade é apresentar o resultado, não devolvê-lo ao chamador.');
    expect(maiorPrompt).toContain('O enunciado define explicitamente que a leitura deve ocorrer no main.');
    expect(maiorPrompt).toContain('Aceite também composição direta como informarMaior(maiorTres(n1, n2, n3)) se a chamada ocorrer no main e preservar exatamente o fluxo função → resultado → procedimento.');

    const mediaPrompt = promptFor('funcoes_media_dois_numeros');
    expect(mediaPrompt).toContain('O uso de float é um objetivo explícito desta atividade.');
    expect(mediaPrompt).toContain('ATENÇÃO: se valor1 e valor2 são float, dividir a soma por uma constante inteira 2 continua sendo divisão em ponto flutuante em C; NÃO marque (n1 + n2) / 2 como divisão inteira.');
    expect(mediaPrompt).toContain('O procedimento de saída é invocado a partir do main depois que o resultado da função de média está disponível.');
    expect(mediaPrompt).toContain('Aceite também mostrarMedia(calcularMedia(n1, n2)) quando essa composição ocorre diretamente no main, pois o procedimento continua sendo invocado pelo escopo principal com o resultado da função.');

    const distanciaPrompt = promptFor('funcoes_distancia_entre_pontos');
    expect(distanciaPrompt).toContain('A função que calcula a distância possui tipo de retorno float, conforme a exigência explícita do desafio.');
    expect(distanciaPrompt).toContain('A função recebe exatamente as quatro coordenadas necessárias dos dois pontos por meio de quatro parâmetros float.');
    expect(distanciaPrompt).toContain('Também aceite x1 - x2 e y1 - y2, pois o sinal desaparece quando essas diferenças são elevadas ao quadrado.');
    expect(distanciaPrompt).toContain('Aceite sqrtf como equivalente apropriado para operandos float.');
    expect(distanciaPrompt).toContain('O uso da raiz quadrada é parte do objetivo pedagógico; não considere apenas a soma dos quadrados como distância final.');
    expect(distanciaPrompt).toContain('Uma solução que usa hypot/hypotf pode calcular matematicamente a distância, mas não exercita explicitamente a construção soma dos quadrados + raiz quadrada definida pelos critérios desta atividade; portanto, não a considere atendimento integral aos critérios `crit_soma_quadrados` e `crit_sqrt`.');
    expect(getChallengeEvaluation('funcoes_distancia_entre_pontos')!.rubric.find((criterion) => criterion.id === 'crit_sem_printf')!.essential).toBe(false);
  });

  it('preserva as avaliações privadas já registradas para Laços, Vetores, Matrizes e Condicionais', () => {
    for (const challengeId of [
      'desafio_lacos_contar_1_ten', 'desafio_lacos_somar_n', 'lacos_contar_pares_ate_n', 'lacos_maior_dez_numeros', 'lacos_media_cinco_numeros', 'lacos_validar_senha_tres_tentativas',
      'desafio_vetores_contar_pares', 'desafio_vetores_maior_valor', 'vetores_maiores_que_dez', 'vetores_media_seis_valores', 'vetores_menor_e_posicao', 'vetores_positivos_negativos_zeros',
      'desafio_matrizes_soma_2x2', 'desafio_matrizes_diagonal_principal', 'matrizes_contar_pares', 'matrizes_maior_valor', 'matrizes_soma_diagonal_principal', 'matrizes_soma_primeira_linha',
      'desafio1_condicionais_basico', 'desafio2_condicionais_paridade', 'desafio3_emprestimo_salario', 'desafio4_divisivel_3_ou_5', 'desafio5_ordem_crescente_tres_numeros', 'desafio6_triangulo_classificacao',
    ]) {
      expect(getChallengeEvaluation(challengeId)).toBeDefined();
    }
  });
});
