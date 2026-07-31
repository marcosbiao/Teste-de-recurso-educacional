import { describe, expect, it } from 'vitest';
import { buildAnalysisMessages } from '../src/ai/buildAnalysisPrompt';
import { getInternalChallenge } from '../src/catalog/challengeAnalysisCatalog';
import { getChallengeEvaluation } from '../src/evaluation/getChallengeEvaluation';

describe('avaliações privadas da categoria Vetores', () => {
  it('registra os seis desafios com criterionIds públicos e conteúdo privado no prompt', () => {
    const vectorChallengeIds = [
      'desafio_vetores_contar_pares',
      'desafio_vetores_maior_valor',
      'vetores_maiores_que_dez',
      'vetores_media_seis_valores',
      'vetores_menor_e_posicao',
      'vetores_positivos_negativos_zeros',
    ];

    for (const challengeId of vectorChallengeIds) {
      const internal = getInternalChallenge(challengeId);
      const evaluation = getChallengeEvaluation(challengeId);
      expect(internal).toBeDefined();
      expect(evaluation).toBeDefined();
      expect(evaluation!.challengeId).toBe(challengeId);
      expect(evaluation!.rubric.map((item) => item.id)).toEqual(internal!.expectedEvidence.map((item) => item.criterionId));
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

  it('mantém no prompt os cuidados pedagógicos específicos de Vetores', () => {
    const mediaPrompt = buildAnalysisMessages(getInternalChallenge('vetores_media_seis_valores')!, { challengeId: 'vetores_media_seis_valores', studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');
    expect(mediaPrompt).toContain('Se a soma já é float ou double, a expressão soma / 6 é válida em C e NÃO deve ser marcada como divisão inteira, pois as conversões usuais promovem o divisor para ponto flutuante.');

    const menorPrompt = buildAnalysisMessages(getInternalChallenge('vetores_menor_e_posicao')!, { challengeId: 'vetores_menor_e_posicao', studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');
    expect(menorPrompt).toContain('O uso de < preserva a primeira ocorrência do mínimo; o uso de <= pode preservar a última ocorrência. Como o enunciado não define regra de desempate, aceite qualquer posição que realmente contenha o valor mínimo.');

    const classificacaoPrompt = buildAnalysisMessages(getInternalChallenge('vetores_positivos_negativos_zeros')!, { challengeId: 'vetores_positivos_negativos_zeros', studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');
    expect(classificacaoPrompt).toContain('Não considere o uso de três ifs independentes automaticamente incorreto apenas por não usar else if; avalie o comportamento efetivo.');
  });

  it('preserva as avaliações privadas já registradas para Laços', () => {
    for (const challengeId of [
      'desafio_lacos_contar_1_ten',
      'desafio_lacos_somar_n',
      'lacos_contar_pares_ate_n',
      'lacos_maior_dez_numeros',
      'lacos_media_cinco_numeros',
      'lacos_validar_senha_tres_tentativas',
    ]) {
      expect(getChallengeEvaluation(challengeId)).toBeDefined();
    }
  });
});
