import { describe, expect, it } from 'vitest';
import { buildAnalysisMessages } from '../src/ai/buildAnalysisPrompt';
import { getInternalChallenge } from '../src/catalog/challengeAnalysisCatalog';
import { getChallengeEvaluation } from '../src/evaluation/getChallengeEvaluation';

describe('avaliações privadas da categoria Condicionais', () => {
  it('registra os seis desafios com criterionIds públicos e conteúdo privado no prompt', () => {
    const conditionalChallengeIds = [
      'desafio1_condicionais_basico',
      'desafio2_condicionais_paridade',
      'desafio3_emprestimo_salario',
      'desafio4_divisivel_3_ou_5',
      'desafio5_ordem_crescente_tres_numeros',
      'desafio6_triangulo_classificacao',
    ];

    for (const challengeId of conditionalChallengeIds) {
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

  it('mantém no prompt os cuidados pedagógicos específicos de Condicionais', () => {
    const promptFor = (challengeId: string) => buildAnalysisMessages(getInternalChallenge(challengeId)!, { challengeId, studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');

    const paridadePrompt = promptFor('desafio2_condicionais_paridade');
    expect(paridadePrompt).toContain('Matematicamente zero é par, mas neste desafio o enunciado define zero como uma categoria própria.');

    const emprestimoPrompt = promptFor('desafio3_emprestimo_salario');
    expect(emprestimoPrompt).toContain('ATENÇÃO: salario * 20 / 100 com salario float/double é válido em C porque as operações permanecem em ponto flutuante.');
    expect(emprestimoPrompt).toContain('ATENÇÃO: salario * (20 / 100) é diferente quando 20 e 100 são inteiros, pois 20 / 100 resulta em 0 antes da multiplicação.');
    expect(emprestimoPrompt).toContain('Aceite também lógica invertida semanticamente equivalente, por exemplo testar prestacao <= limite para o ramo de concessão.');

    const divisibilidadePrompt = promptFor('desafio4_divisivel_3_ou_5');
    expect(divisibilidadePrompt).toContain('O uso do operador lógico || é um objetivo pedagógico explícito deste desafio.');
    expect(divisibilidadePrompt).toContain('Não substitua pedagogicamente o || por uma solução completamente diferente que evite praticar o operador OU.');

    const ordenacaoPrompt = promptFor('desafio5_ordem_crescente_tres_numeros');
    expect(ordenacaoPrompt).toContain('Também aceite outra estratégia condicional semanticamente correta, como trocas condicionais sucessivas entre pares, desde que continue praticando decisões/comparações e garanta ordenação completa.');
    expect(ordenacaoPrompt).toContain('Não penalize automaticamente a ausência de <=; avalie o comportamento nos casos de igualdade.');
    expect(ordenacaoPrompt).toContain('O critério é comportamental: cobertura completa das permutações, não contagem textual de ifs.');

    const trianguloPrompt = promptFor('desafio6_triangulo_classificacao');
    expect(trianguloPrompt).toContain('Para considerar válido diretamente, devem valer simultaneamente: a + b > c, a + c > b e b + c > a.');
    expect(trianguloPrompt).toContain('Também aceite a lógica equivalente que detecta invalidade se qualquer uma falhar, por exemplo a + b <= c || a + c <= b || b + c <= a, e trata o ramo complementar como válido.');
    expect(trianguloPrompt).toContain('ATENÇÃO: não marque qualquer uso de || como erro automaticamente; OR é correto quando combina condições de INVALIDADE.');
    expect(trianguloPrompt).toContain('O problema possui dois estágios lógicos: validar e depois classificar.');
  });

  it('preserva as avaliações privadas já registradas para Laços, Vetores e Matrizes', () => {
    for (const challengeId of [
      'desafio_lacos_contar_1_ten', 'desafio_lacos_somar_n', 'lacos_contar_pares_ate_n', 'lacos_maior_dez_numeros', 'lacos_media_cinco_numeros', 'lacos_validar_senha_tres_tentativas',
      'desafio_vetores_contar_pares', 'desafio_vetores_maior_valor', 'vetores_maiores_que_dez', 'vetores_media_seis_valores', 'vetores_menor_e_posicao', 'vetores_positivos_negativos_zeros',
      'desafio_matrizes_soma_2x2', 'desafio_matrizes_diagonal_principal', 'matrizes_contar_pares', 'matrizes_maior_valor', 'matrizes_soma_diagonal_principal', 'matrizes_soma_primeira_linha',
    ]) {
      expect(getChallengeEvaluation(challengeId)).toBeDefined();
    }
  });
});
