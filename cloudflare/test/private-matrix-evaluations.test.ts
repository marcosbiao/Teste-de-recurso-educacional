import { describe, expect, it } from 'vitest';
import { buildAnalysisMessages } from '../src/ai/buildAnalysisPrompt';
import { getInternalChallenge } from '../src/catalog/challengeAnalysisCatalog';
import { getChallengeEvaluation } from '../src/evaluation/getChallengeEvaluation';

describe('avaliações privadas da categoria Matrizes', () => {
  it('registra os seis desafios com criterionIds públicos e conteúdo privado no prompt', () => {
    const matrixChallengeIds = [
      'desafio_matrizes_soma_2x2',
      'desafio_matrizes_diagonal_principal',
      'matrizes_contar_pares',
      'matrizes_maior_valor',
      'matrizes_soma_diagonal_principal',
      'matrizes_soma_primeira_linha',
    ];

    for (const challengeId of matrixChallengeIds) {
      const internal = getInternalChallenge(challengeId);
      const evaluation = getChallengeEvaluation(challengeId);
      expect(internal).toBeDefined();
      expect(evaluation).toBeDefined();
      expect(evaluation!.challengeId).toBe(challengeId);
      expect(evaluation!.rubric.map((item) => item.id)).toEqual(internal!.expectedEvidence.map((item) => item.criterionId));
      expect(evaluation!.rubric.every((item) => item.essential)).toBe(true);
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

  it('mantém no prompt os cuidados pedagógicos específicos de Matrizes', () => {
    const promptFor = (challengeId: string) => buildAnalysisMessages(getInternalChallenge(challengeId)!, { challengeId, studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');

    const maiorPrompt = promptFor('matrizes_maior_valor');
    expect(maiorPrompt).toContain('A relação esperada é encontrar o maior valor numérico comum da matriz.');
    expect(maiorPrompt).toContain('Interpretar o desafio como busca do maior módulo matemático dos elementos.');
    expect(maiorPrompt).toContain('A solução pode escolher, por exemplo, -20 no lugar de -2 apenas porque |-20| é maior, contrariando o título, os exemplos e a solução de referência do desafio.');

    const diagonalPrompt = promptFor('desafio_matrizes_diagonal_principal');
    expect(diagonalPrompt).toContain('Aceite um único laço acessando matriz[k][k], dois laços com condição linha == coluna, ou acesso direto às três posições da diagonal.');

    const somaDiagonalPrompt = promptFor('matrizes_soma_diagonal_principal');
    expect(somaDiagonalPrompt).toContain('Aceite um laço simples usando matriz[k][k], dois laços com condição linha == coluna, ou soma direta das três posições corretas.');

    const primeiraLinhaPrompt = promptFor('matrizes_soma_primeira_linha');
    expect(primeiraLinhaPrompt).toContain('Aceite um laço sobre as colunas usando matriz[0][coluna], a soma direta matriz[0][0] + matriz[0][1] + matriz[0][2], ou forma equivalente.');
    expect(primeiraLinhaPrompt).toContain('Não confunda primeira linha com primeira coluna: matriz[coluna][0] percorre a primeira coluna, não a primeira linha.');
  });

  it('preserva as avaliações privadas já registradas para Laços e Vetores', () => {
    for (const challengeId of [
      'desafio_lacos_contar_1_ten', 'desafio_lacos_somar_n', 'lacos_contar_pares_ate_n',
      'lacos_maior_dez_numeros', 'lacos_media_cinco_numeros', 'lacos_validar_senha_tres_tentativas',
      'desafio_vetores_contar_pares', 'desafio_vetores_maior_valor', 'vetores_maiores_que_dez',
      'vetores_media_seis_valores', 'vetores_menor_e_posicao', 'vetores_positivos_negativos_zeros',
    ]) {
      expect(getChallengeEvaluation(challengeId)).toBeDefined();
    }
  });
});
