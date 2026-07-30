export const ANALYSIS_CATEGORIES = ['tentativa inicial', 'parcialmente correta', 'quase completa', 'solução adequada'] as const;
export const ANALYSIS_CONFIDENCES = ['baixa', 'media', 'alta'] as const;
export const ANALYSIS_ERROR_TYPES = ['interpretacao_enunciado', 'logica', 'sintaxe_aparente', 'saida_incorreta', 'caso_nao_tratado', 'condicao_incompleta', 'sem_erro_relevante'] as const;
export const ANALYSIS_MODES = ['cloudflare_qwen', 'local_fallback', 'gemini_primary', 'gemini_secondary', 'gemini_fallback', 'unknown'] as const;
export const ANALYSIS_STATUSES = ['success', 'invalid_input', 'code_too_large', 'temporarily_unavailable', 'rate_limit', 'timeout', 'invalid_response', 'authentication_error', 'configuration_error', 'unknown_error'] as const;

export type ChallengeCategory = typeof ANALYSIS_CATEGORIES[number];
export type AnalysisConfidence = typeof ANALYSIS_CONFIDENCES[number];
export type ErrorType = typeof ANALYSIS_ERROR_TYPES[number];
export type AnalysisMode = typeof ANALYSIS_MODES[number];
export type AnalysisStatus = typeof ANALYSIS_STATUSES[number];
export const CRITERION_STATUSES = ['satisfied', 'partial', 'not_satisfied', 'not_verifiable'] as const;
export type CriterionStatus = typeof CRITERION_STATUSES[number];
export interface CriterionAssessment { criterionId: string; status: CriterionStatus; evidence: string; }

export interface PrimaryIssue {
  hasIssue: boolean;
  type: ErrorType;
  concept: string;
  evidence: string;
  explanation: string;
  /** Optional for historical records created before criterion assessment. */
  criterionId?: string;
}

export interface StudentFeedback {
  positiveObservation: string;
  primaryIssue: PrimaryIssue;
  guidingQuestion: string;
  nextAction: string;
}

export interface TeacherDiagnosis {
  hypothesis: string;
  confidence: AnalysisConfidence;
}

export interface AnalysisResult {
  category: ChallengeCategory;
  confidence: AnalysisConfidence;
  studentFeedback: StudentFeedback;
  teacherDiagnosis: TeacherDiagnosis;
  /** Internal criterion-level evidence; absent on historical attempts. */
  criteriaAssessment?: CriterionAssessment[];
  difficultyHypothesis: string;
  feedback: { good: string[]; review: string[]; nextStep: string };
  errorType: ErrorType[];
  suggestedNextStep: string;
  analysisSummary: string;
  analysisMode: AnalysisMode;
  analysisStatus?: AnalysisStatus;
  modelUsed: string;
  promptVersion: string;
  /** Safe local transport metadata; absent in historical records. */
  requestId?: string;
  durationMs?: number;
  modelCalls?: number;
  retryAfterSeconds?: number;
  isTransientFailure?: boolean;
  shouldPersistAttempt?: boolean;
  shouldCountAnalysisRequest?: boolean;
}
