import { describe, expect, it, vi } from 'vitest';
import { desafioCci01CustoViagem } from '../../challenges/c_cci01_custo_viagem';
import type { Challenge } from '../../types';
import { createAnalysisResult } from '../../domain/pedagogicalDomain';
import { generateLocalAnalysis } from '../localAnalysisService';

function challenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'local-test', title: 'Desafio local', subtitle: 'Teste', challengeVersion: '1.0.0',
    metadata: { content: 'Teste', language: 'C', level: 'Iniciante', time: '10 min', requirements: '', skill: 'Teste', version: '1.0.0' },
    pedagogicalMetadata: { learningObjective: 'Objetivo', pedagogicalGoal: 'Meta', expectedDifficulty: 'baixa', cognitiveOperation: 'aplicar', prerequisites: [] },
    domainTags: { skillTags: [], topicTags: [], difficultyTag: 'low', prerequisiteTags: [] },
    problem: 'Resolva o problema.', guidingQuestions: ['Qual estrutura atende ao enunciado?'],
    orientation: { input: '', output: '', cases: '', structure: '', expectedLogic: '' },
    examples: [], concepts: ['Conceito central'], tips: [], commonErrors: [], solution: 'int main() { return 0; }', finalSummary: [], expectedCriteria: [], probableErrors: [], templateCode: '',
    analyzeLocally: undefined as any,
    ...overrides
  };
}

function specificResult() {
  return createAnalysisResult({
    category: 'parcialmente correta', confidence: 'media',
    studentFeedback: { positiveObservation: 'Você declarou uma variável.', primaryIssue: { hasIssue: true, type: 'logica', concept: 'Regra específica', evidence: 'A estrutura X foi encontrada.', explanation: 'Revise a regra X.' }, guidingQuestion: 'Como a regra X deve continuar?', nextAction: 'Revise a regra X.' },
    teacherDiagnosis: { hypothesis: 'Regra específica detectada.', confidence: 'media' },
    analysisMode: 'gemini_fallback', modelUsed: 'legacy', promptVersion: 'test'
  });
}

describe('localAnalysisService', () => {
  it('prioriza a análise específica do desafio com confiança alta e origem local', () => {
    const local = vi.fn(() => specificResult());
    const output = generateLocalAnalysis({ challenge: challenge({ analyzeLocally: local }), studentCode: 'int main() {}' });
    expect(local).toHaveBeenCalledTimes(1);
    expect(output.rule).toBe('challenge_specific');
    expect(output.confidence).toBe('alta');
    expect(output.result.analysisMode).toBe('local_fallback');
  });

  it('usa padrão declarado antes de critério e aplica confiança média', () => {
    const output = generateLocalAnalysis({ challenge: challenge({ commonErrors: [{ title: 'Esquecer scanf', description: 'A entrada precisa de scanf.', pedagogicalAdvice: 'Leia o valor.' }], expectedCriteria: [{ id: 'if', description: 'Uso de if', importance: 'essencial' }] }), studentCode: 'int main(){ return 0; }' });
    expect(output.rule).toBe('declared_pattern');
    expect(output.confidence).toBe('media');
    expect(output.result.studentFeedback.primaryIssue.concept).toBe('Uso de if');
  });

  it('usa critério não atendido quando não há regra específica nem padrão', () => {
    const output = generateLocalAnalysis({ challenge: challenge({ expectedCriteria: [{ id: 'loop', description: 'Uso de estrutura de repetição for ou while', importance: 'essencial' }] }), studentCode: 'int main(){ printf("oi"); }' });
    expect(output.rule).toBe('unmet_criterion');
    expect(output.confidence).toBe('media');
    expect(output.result.studentFeedback.primaryIssue.concept).toBe('Uso de estrutura de repetição for ou while');
  });

  it('aplica heurística genérica somente como último recurso e é determinístico', () => {
    const input = { challenge: challenge({ orientation: { input: '', output: '', cases: '', structure: 'Laço de repetição', expectedLogic: '' }, domainTags: { skillTags: ['loops'], topicTags: [], difficultyTag: 'low', prerequisiteTags: [] } }), studentCode: 'int main(){ return 0; }' };
    const first = generateLocalAnalysis(input);
    const second = generateLocalAnalysis(input);
    expect(first.rule).toBe('generic_structure');
    expect(first.confidence).toBe('baixa');
    expect(first).toEqual(second);
  });

  it('detecta resposta vazia, ausência de condição, função e acesso indexado', () => {
    expect(generateLocalAnalysis({ challenge: challenge(), studentCode: '   ' }).rule).toBe('empty_code');
    expect(generateLocalAnalysis({ challenge: challenge({ orientation: { input: '', output: '', cases: '', structure: 'Estrutura condicional', expectedLogic: '' } }), studentCode: 'int main(){}' }).result.studentFeedback.primaryIssue.concept).toBe('Decisão condicional');
    expect(generateLocalAnalysis({ challenge: challenge({ orientation: { input: '', output: '', cases: '', structure: 'Funções e modularização', expectedLogic: '' } }), studentCode: 'int main(){}' }).result.studentFeedback.primaryIssue.concept).toBe('Funções');
    expect(generateLocalAnalysis({ challenge: challenge({ orientation: { input: '', output: '', cases: '', structure: 'Vetores', expectedLogic: '' } }), studentCode: 'int main(){}' }).result.studentFeedback.primaryIssue.concept).toBe('Acesso indexado');
  });

  it('não inventa erro específico sem evidência e retorna todos os campos compatíveis', () => {
    const output = generateLocalAnalysis({ challenge: challenge(), studentCode: 'int main(){ return 0; }' });
    const result = output.result;
    expect(output.rule).toBe('insufficient_evidence');
    expect(result.confidence).toBe('baixa');
    expect(result.studentFeedback.primaryIssue).toMatchObject({ hasIssue: false, type: 'sem_erro_relevante' });
    expect(result.studentFeedback.positiveObservation).not.toMatch(/gemini|api|timeout|servidor|falha técnica/i);
    expect(result.studentFeedback.nextAction).not.toContain(challenge().solution);
    expect(result.category).toBe('parcialmente correta');
    expect(result.teacherDiagnosis.confidence).toBe('baixa');
  });

  it('não realiza chamadas de rede', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    generateLocalAnalysis({ challenge: challenge(), studentCode: 'int main(){}' });
    expect(fetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
  it("mantém o contrato local válido para as três reproduções CCI01", () => {
    const codes = [
      String.raw`#include <stdio.h>

int main() {
    float distancia, consumo, preco;
    float qtd, custo;

    printf("Digite a distancia");
    scanf("$f",&distancia);

    printf("Digite o consumo");
    scanf("$f",&consumo);

    printf("Digite o preço");
    scanf("$f",&preco);

    return 0;
}`,
      String.raw`#include <stdio.h>

int main() {
    float distancia, consumo, preco;
    float qtd, custo;

    printf("Digite a distancia");
    scanf("$f",&distancia);

    printf("Digite o consumo");
    scanf("$f",&consumo);

    printf("Digite o preço");
    scanf("$f",&preco);

    qtd = distancia/consumo;
    custo = qtd*preco;

    return 0;
}`,
      String.raw`#include <stdio.h>

int main() {
    float distancia, consumo, preco;
    float litros, valor;

    printf("Digite a distancia");
    scanf("$f",&distancia);

    printf("Digite o consumo");
    scanf("$f",&consumo);

    printf("Digite o preço");
    scanf("$f",&preco);

    litros = distancia/consumo;
    valor = litros*preco;

    return 0;
}`
    ];
    for (const [index, studentCode] of codes.entries()) {
      const { result } = generateLocalAnalysis({ challenge: desafioCci01CustoViagem, studentCode });
      expect(result).toMatchObject({ analysisMode: "local_fallback", analysisStatus: "success" });
      if (result.studentFeedback.primaryIssue.hasIssue) {
        const linked = result.criteriaAssessment?.find((item) => item.criterionId === result.studentFeedback.primaryIssue.criterionId);
        expect(linked).toBeDefined();
        expect(["partial", "not_satisfied"]).toContain(linked!.status);
      }
      expect(result.criteriaAssessment?.find((item) => item.criterionId === "crit5")?.status).not.toBe("satisfied");
      expect(result.criteriaAssessment?.find((item) => item.criterionId === "crit8")?.status).not.toBe("satisfied");
      expect(result.criteriaAssessment?.find((item) => item.criterionId === "crit1")?.status).toBe("partial");
      if (index > 0) expect(result.criteriaAssessment?.find((item) => item.criterionId === "crit2")?.status).toBe("satisfied");
    }
  });
});
