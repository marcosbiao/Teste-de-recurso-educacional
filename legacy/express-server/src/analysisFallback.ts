import type { AnalysisResult, Challenge, ProblemRepresentationDraft } from '../types.ts';
import { createAnalysisResult, normalizeAnalysisResult } from '../domain/pedagogicalDomain.ts';
import { PROMPT_VERSION } from './analysisPrompt.ts';

export function getAnalysisFallback(
  code: string,
  challenge: Challenge,
  modelUsed: string,
  representation?: ProblemRepresentationDraft
): AnalysisResult {
  try {
    const localResult = challenge.analyzeLocally(code, representation);
    return normalizeAnalysisResult(localResult, {
      analysisMode: 'gemini_fallback',
      modelUsed,
      promptVersion: PROMPT_VERSION
    });
  } catch {
    return createAnalysisResult({
      category: 'tentativa inicial',
      confidence: 'baixa',
      studentFeedback: {
        positiveObservation: 'Sua tentativa foi registrada.',
        primaryIssue: {
          hasIssue: false,
          type: 'sem_erro_relevante',
          concept: '',
          evidence: '',
          explanation: ''
        },
        guidingQuestion: 'Seu código contempla todas as entradas e saídas solicitadas no enunciado?',
        nextAction: 'Revise os critérios do desafio e tente novamente.'
      },
      teacherDiagnosis: {
        hypothesis: 'Não foi possível gerar um diagnóstico automático nesta tentativa.',
        confidence: 'baixa'
      },
      analysisMode: 'gemini_fallback',
      modelUsed,
      promptVersion: PROMPT_VERSION
    });
  }
}
