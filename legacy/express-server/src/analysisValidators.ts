import type { AnalysisResult, AnalysisConfidence, ChallengeCategory, ErrorType } from '../types.ts';
import { createAnalysisResult } from '../domain/pedagogicalDomain.ts';
import { PROMPT_VERSION } from './analysisPrompt.ts';

export function validateGeminiResponse(
  rawResponse: any,
  modelUsed: string
): { ok: boolean; data?: AnalysisResult; error?: string } {
  try {
    const data = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

    const validCategories: ChallengeCategory[] = [
      'tentativa inicial',
      'parcialmente correta',
      'quase completa',
      'solução adequada'
    ];
    const validConfidences: AnalysisConfidence[] = ['baixa', 'media', 'alta'];
    const validErrorTypes: ErrorType[] = [
      'interpretacao_enunciado',
      'logica',
      'sintaxe_aparente',
      'saida_incorreta',
      'caso_nao_tratado',
      'condicao_incompleta',
      'sem_erro_relevante'
    ];

    const category = validCategories.includes(data?.category) ? data.category : 'tentativa inicial';
    const confidence = validConfidences.includes(data?.confidence) ? data.confidence : 'media';
    const primaryType = validErrorTypes.includes(data?.studentFeedback?.primaryIssue?.type)
      ? data.studentFeedback.primaryIssue.type
      : category === 'solução adequada'
        ? 'sem_erro_relevante'
        : 'logica';

    const result = createAnalysisResult({
      category,
      confidence,
      studentFeedback: {
        positiveObservation: data?.studentFeedback?.positiveObservation || data?.feedback?.good?.[0] || 'Sua tentativa foi registrada.',
        primaryIssue: {
          hasIssue: Boolean(data?.studentFeedback?.primaryIssue?.hasIssue),
          type: primaryType,
          concept: data?.studentFeedback?.primaryIssue?.concept || '',
          evidence: data?.studentFeedback?.primaryIssue?.evidence || '',
          explanation: data?.studentFeedback?.primaryIssue?.explanation || data?.feedback?.review?.[0] || ''
        },
        guidingQuestion: data?.studentFeedback?.guidingQuestion || 'Qual parte do enunciado merece mais atenção nesta tentativa?',
        nextAction: data?.studentFeedback?.nextAction || data?.feedback?.nextStep || 'Tente revisar seu código.'
      },
      teacherDiagnosis: {
        hypothesis: data?.teacherDiagnosis?.hypothesis || data?.difficultyHypothesis || 'Não foi possível determinar a dificuldade.',
        confidence: validConfidences.includes(data?.teacherDiagnosis?.confidence)
          ? data.teacherDiagnosis.confidence
          : confidence
      },
      analysisMode: 'gemini_primary',
      modelUsed,
      promptVersion: PROMPT_VERSION,
      analysisSummary: data?.analysisSummary
    });

    return { ok: true, data: result };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
