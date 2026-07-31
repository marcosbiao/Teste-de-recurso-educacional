import { describe, expect, it } from 'vitest';
import { buildAnalysisMessages } from '../src/ai/buildAnalysisPrompt';
import { getInternalChallenge } from '../src/catalog/challengeAnalysisCatalog';
import { getChallengeEvaluation } from '../src/evaluation/getChallengeEvaluation';

describe('avaliações privadas da categoria Representação', () => {
  it('registra os dois desafios com criterionIds públicos e conteúdo privado no prompt', () => {
    const representationChallengeIds = [
      'cci01-custo-viagem',
      'cci01-materiais-oficina',
    ];

    for (const challengeId of representationChallengeIds) {
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

  it('inclui a representação opcional como evidência não confiável e preserva os cuidados de Representação', () => {
    const promptFor = (challengeId: string, representation?: Record<string, string>) => buildAnalysisMessages(getInternalChallenge(challengeId)!, { challengeId, studentCode: 'int main(void) { return 0; }', representation }).map((message) => message.content).join('\n');
    const representation = { inputs: 'distância, consumo e preço', processing: 'litros = distância / consumo', outputs: 'litros e custo', steps: 'ler, validar, calcular e exibir' };
    const promptWithRepresentation = promptFor('cci01-custo-viagem', representation);
    const representationSection = promptWithRepresentation.match(/<REPRESENTACAO_DO_ESTUDANTE_NAO_CONFIAVEL>\n([\s\S]*?)\n<\/REPRESENTACAO_DO_ESTUDANTE_NAO_CONFIAVEL>/);
    expect(representationSection).not.toBeNull();
    expect(JSON.parse(representationSection![1])).toEqual(representation);

    const viagemPrompt = promptWithRepresentation;
    expect(viagemPrompt).toContain('A relação dimensional correta é litros = distância / consumo quando o consumo está em quilômetros por litro.');
    expect(viagemPrompt).toContain('O custo deve depender da quantidade de litros e do preço por litro.');
    expect(viagemPrompt).toContain('A regra confiável do desafio define consumo <= 0 como inválido.');
    expect(viagemPrompt).toContain('Uma verificação feita somente depois de calcular distancia / consumo não evita a divisão inválida.');
    expect(viagemPrompt).toContain('Float é a estratégia de referência e double também é uma alternativa adequada.');
    expect(viagemPrompt).toContain('Representação ausente ou campos vazios não devem ser classificados automaticamente como erro; nesse caso prefira não usar este critério como problema prioritário.');

    const promptWithoutRepresentation = promptFor('cci01-custo-viagem');
    expect(promptWithoutRepresentation).not.toContain('<REPRESENTACAO_DO_ESTUDANTE_NAO_CONFIAVEL>');
    expect(promptWithoutRepresentation).toContain('<TENTATIVA_NAO_CONFIAVEL>');

    const oficinaPrompt = promptFor('cci01-materiais-oficina');
    expect(oficinaPrompt).toContain('Existe uma única entrada principal: número de estudantes.');
    expect(oficinaPrompt).toContain('A relação correta é folhas = estudantes * 2, 2 * estudantes ou expressão aritmeticamente equivalente.');
    expect(oficinaPrompt).toContain('Cada estudante recebe um lápis e uma borracha.');
    expect(oficinaPrompt).toContain('A estratégia de referência é total = folhas + lapis + borrachas.');
    expect(oficinaPrompt).toContain('Aceite expressão equivalente como estudantes * 4 quando os subtotais individuais também estão corretamente representados e podem ser apresentados.');
    expect(oficinaPrompt).toContain('As variáveis separadas para folhas, lápis, borrachas e total NÃO são desnecessárias: elas correspondem aos subtotais solicitados.');
    expect(oficinaPrompt).toContain('Representação ausente ou vazia não deve gerar erro automaticamente.');
  });

  it('preserva as avaliações privadas já registradas para os blocos anteriores', () => {
    for (const challengeId of [
      'desafio_lacos_contar_1_ten', 'desafio_lacos_somar_n', 'lacos_contar_pares_ate_n', 'lacos_maior_dez_numeros', 'lacos_media_cinco_numeros', 'lacos_validar_senha_tres_tentativas',
      'desafio_vetores_contar_pares', 'desafio_vetores_maior_valor', 'vetores_maiores_que_dez', 'vetores_media_seis_valores', 'vetores_menor_e_posicao', 'vetores_positivos_negativos_zeros',
      'desafio_matrizes_soma_2x2', 'desafio_matrizes_diagonal_principal', 'matrizes_contar_pares', 'matrizes_maior_valor', 'matrizes_soma_diagonal_principal', 'matrizes_soma_primeira_linha',
      'desafio1_condicionais_basico', 'desafio2_condicionais_paridade', 'desafio3_emprestimo_salario', 'desafio4_divisivel_3_ou_5', 'desafio5_ordem_crescente_tres_numeros', 'desafio6_triangulo_classificacao',
      'funcoes_maior_tres_numeros', 'funcoes_media_dois_numeros', 'funcoes_distancia_entre_pontos',
    ]) {
      expect(getChallengeEvaluation(challengeId)).toBeDefined();
    }
  });
});
