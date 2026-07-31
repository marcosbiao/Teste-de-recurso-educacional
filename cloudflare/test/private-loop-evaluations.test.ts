import { describe, expect, it } from 'vitest';
import { buildAnalysisMessages } from '../src/ai/buildAnalysisPrompt';
import { getInternalChallenge } from '../src/catalog/challengeAnalysisCatalog';
import { getChallengeEvaluation } from '../src/evaluation/getChallengeEvaluation';

describe('avaliações privadas da categoria Laços', () => {
  it('registra os seis desafios com criterionIds públicos e conteúdo privado no prompt', () => {
    const expectedPrivateText: Record<string, [string, string]> = {
      desafio_lacos_contar_1_ten: ['Avalie se a repetição realmente controla a produção sucessiva dos valores.', 'Exibir o valor apenas depois do término do laço.'],
      desafio_lacos_somar_n: ['Somar N em todas as iterações não equivale a somar 1 + 2 + ... + N.', 'Parar a repetição antes de processar N.'],
      lacos_contar_pares_ate_n: ['O teste deve distinguir pares de ímpares antes de incrementar a contagem.', 'Incrementar o contador em todas as iterações.'],
      lacos_media_cinco_numeros: ['Ler uma única vez fora do laço e reutilizar o mesmo valor cinco vezes não satisfaz este critério.', 'Realizar divisão inteira antes de armazenar a média em um tipo real.'],
      lacos_maior_dez_numeros: ['Um laço que só compara sem nova leitura não processa novos valores', 'Comparar o valor atual com ele mesmo.'],
      lacos_validar_senha_tres_tentativas: ['A cada ciclo válido deve existir uma nova senha fornecida pelo usuário.', 'Permitir tentativas ilimitadas.'],
    };
    for (const [challengeId, [guidance, commonError]] of Object.entries(expectedPrivateText)) {
      const internal = getInternalChallenge(challengeId);
      const evaluation = getChallengeEvaluation(challengeId);
      expect(internal).toBeDefined();
      expect(evaluation).toBeDefined();
      expect(evaluation!.challengeId).toBe(challengeId);
      expect(evaluation!.rubric.map((item) => item.id)).toEqual(internal!.expectedEvidence.map((item) => item.criterionId));
      expect(evaluation!.rubric.every((item) => item.essential)).toBe(true);
      const prompt = buildAnalysisMessages(internal!, { challengeId, studentCode: 'int main(void) { return 0; }' }).map((message) => message.content).join('\n');
      expect(prompt).toContain('RUBRICA_PRIVADA_CONFIAVEL');
      expect(prompt).toContain('ESTRATEGIAS_DE_REFERENCIA_PRIVADAS');
      expect(prompt).toContain('ERROS_COMUNS_PRIVADOS');
      expect(prompt).toContain(guidance);
      expect(prompt).toContain(commonError);
    }
  });

  it('não aplica avaliações privadas aos desafios ainda não migrados', () => {
    expect(getChallengeEvaluation('generic')).toBeUndefined();
  });
});
