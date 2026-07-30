import { describe, it, expect } from 'vitest';
import { validateGeminiResponse } from '../analysisValidators';
import { getAnalysisFallback } from '../analysisFallback';
import { Challenge } from '../../types';

describe('Camada de Análise (IA)', () => {
  const mockChallenge: Challenge = {
    id: 'desafio-1',
    title: 'Desafio 1',
    subtitle: 'Sub',
    challengeVersion: '1.0.0',
    metadata: { content: '', language: 'C', level: 'Iniciante', time: '', requirements: '', skill: '', version: '' },
    pedagogicalMetadata: { learningObjective: '', pedagogicalGoal: '', expectedDifficulty: 'baixa', cognitiveOperation: 'lembrar', prerequisites: [] },
    domainTags: { skillTags: [], topicTags: [], difficultyTag: '', prerequisiteTags: [] },
    problem: 'Enunciado',
    guidingQuestions: [],
    orientation: { input: '', output: '', cases: '', structure: '', expectedLogic: '' },
    examples: [],
    concepts: [],
    tips: [],
    commonErrors: [],
    solution: 'int main() {}',
    finalSummary: [],
    expectedCriteria: [],
    probableErrors: [],
    templateCode: '',
    analyzeLocally: () => ({
      category: 'tentativa inicial',
      confidence: 'media',
      studentFeedback: {
        positiveObservation: 'Sua tentativa foi registrada.',
        primaryIssue: { hasIssue: false, type: 'sem_erro_relevante', concept: '', evidence: '', explanation: '' },
        guidingQuestion: 'Seu código contempla as entradas e saídas esperadas?',
        nextAction: 'Revise os critérios do desafio e tente novamente.'
      },
      teacherDiagnosis: {
        hypothesis: 'Fallback local básico.',
        confidence: 'baixa'
      },
      difficultyHypothesis: 'Fallback local básico.',
      feedback: { good: ['Sua tentativa foi registrada.'], review: [], nextStep: 'Revise os critérios do desafio e tente novamente.' },
      errorType: ['sem_erro_relevante'],
      suggestedNextStep: 'Revise os critérios do desafio e tente novamente.',
      analysisSummary: 'Sua tentativa foi registrada.',
      analysisMode: 'gemini_fallback',
      modelUsed: 'local_heuristic',
      promptVersion: '3.1.0'
    })
  };

  it('deve validar um JSON correto do Gemini', () => {
    const raw = JSON.stringify({
      category: 'solução adequada',
      confidence: 'alta',
      studentFeedback: {
        positiveObservation: 'A leitura da entrada foi estruturada corretamente.',
        primaryIssue: { hasIssue: false, type: 'sem_erro_relevante', concept: '', evidence: '', explanation: '' },
        guidingQuestion: 'Como você explicaria sua solução?',
        nextAction: 'Avance para o próximo desafio.'
      },
      teacherDiagnosis: {
        hypothesis: 'O estudante demonstrou domínio do conceito.',
        confidence: 'alta'
      }
    });

    const result = validateGeminiResponse(raw, 'gemini-flash');
    expect(result.ok).toBe(true);
    expect(result.data?.category).toBe('solução adequada');
    expect(result.data?.studentFeedback.primaryIssue.hasIssue).toBe(false);
  });

  it('deve retornar um resultado de fallback válido', () => {
    const result = getAnalysisFallback('int main() {}', mockChallenge, 'gemini-flash');
    expect(result.analysisMode).toBe('gemini_fallback');
    expect(result.studentFeedback.nextAction).toBeDefined();
  });
});
