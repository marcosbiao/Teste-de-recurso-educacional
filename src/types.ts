/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AnalysisConfidence, AnalysisMode, AnalysisResult, AnalysisStatus, ChallengeCategory, CriterionAssessment, CriterionStatus, ErrorType, PrimaryIssue, StudentFeedback, TeacherDiagnosis } from './domain/analysis/analysisTypes';
export type { AnalysisConfidence, AnalysisMode, AnalysisResult, AnalysisStatus, ChallengeCategory, CriterionAssessment, CriterionStatus, ErrorType, PrimaryIssue, StudentFeedback, TeacherDiagnosis } from './domain/analysis/analysisTypes';


export interface SolutionUnlockProgress {
  userId: string;
  challengeId: string;
  challengeVersion: string;
  openedTipIds: number[];
  aiAnalysisRequestCount: number;
  solutionUnlocked: boolean;
  solutionOpenedAt?: Date | string | null | any;
  updatedAt?: Date | string | null | any;
}

export interface PedagogicalFeedback {
  good: string[];
  review: string[];
  nextStep: string;
}

export type InteractionEventType =
  | 'challenge_view' | 'tip_open' | 'tip_opened' | 'editor_first_edit' | 'verify_click'
  | 'ai_analysis_requested' | 'analysis_success' | 'analysis_fallback' | 'analysis_error'
  | 'analysis_configuration_error' | 'solution_view' | 'solution_unlocked' | 'solution_opened'
  | 'history_open' | 'session_start' | 'session_end';

export interface InteractionEvent {
  id: string;
  userId: string;
  challengeId: string;
  sessionId: string;
  type: InteractionEventType;
  timestamp: Date | any;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export interface ChallengeSession {
  id: string;
  userId: string;
  challengeId: string;
  startTime: Date | any;
  endTime?: Date | any;
  lastActivity: Date | any;
  metrics: {
    verificationCount: number;
    tipsOpenedCount: number;
    tipsBeforeFirstVerification: number;
    solutionViewed: boolean;
    timeToFirstVerification?: number;
    totalTimeSpent?: number;
  };
}

export interface PreviousPrimaryIssueSummary {
  type: ErrorType;
  concept: string;
  explanation: string;
}

export interface PreviousAttemptContext {
  attemptNumber: number;
  previousCategory?: ChallengeCategory;
  previousPrimaryIssue?: PreviousPrimaryIssueSummary;
  previousGuidingQuestion?: string;
  previousNextAction?: string;
  codeChanged: boolean;
  openedTipIds: number[];
}

export interface Tip {
  id: number;
  text: string;
  pedagogicalGoal?: string;
}

export interface CommonError {
  title: string;
  description: string;
  pedagogicalAdvice: string;
}

export interface ErrorPattern {
  id: string;
  description: string;
  likelyCause: string;
}

export interface ExpectedSolutionCriteria {
  id: string;
  description: string;
  importance: 'essencial' | 'desejável';
}

export interface PedagogicalMetadata {
  learningObjective: string;
  pedagogicalGoal: string;
  expectedDifficulty: 'baixa' | 'media' | 'alta';
  cognitiveOperation: string;
  prerequisites: string[];
}

export interface ChallengeOrientation {
  input: string;
  output: string;
  cases: string;
  structure: string;
  expectedLogic: string;
}

export interface DomainTags {
  skillTags: string[];
  topicTags: string[];
  difficultyTag: string;
  prerequisiteTags: string[];
}

export interface ChallengeMetadata {
  content: string;
  language: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  time: string;
  requirements: string;
  skill: string;
  version: string;
}

export interface ChallengeExample {
  input: string;
  output: string;
  description?: string;
}

export interface ProblemRepresentation {
  inputs: string[];
  processing: string[];
  outputs: string[];
  steps: string[];
}

export interface ProblemRepresentationDraft {
  inputs: string;
  processing: string;
  outputs: string;
  steps: string;
}

export interface Challenge {
  id: string;
  categoryId?: string;
  title: string;
  subtitle: string;
  challengeVersion: string;
  metadata: ChallengeMetadata;
  pedagogicalMetadata: PedagogicalMetadata;
  domainTags: DomainTags;
  problem: string;
  guidingQuestions: string[];
  orientation: ChallengeOrientation;
  problemRepresentation?: ProblemRepresentation;
  examples: ChallengeExample[];
  concepts: string[];
  tips: Tip[];
  commonErrors: CommonError[];
  solution: string;
  finalSummary: string[];
  nextChallengeId?: string;
  expectedCriteria: ExpectedSolutionCriteria[];
  probableErrors: ErrorPattern[];
  templateCode: string;
  analyzeLocally: (code: string, representation?: ProblemRepresentationDraft) => AnalysisResult;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'student';
  createdAt: any;
}

export interface Attempt {
  id: string;
  userId: string;
  challengeId: string;
  challengeVersion: string;
  sessionId: string;
  timestamp: any;
  code: string;
  tipsUsed: number[];
  category: ChallengeCategory;
  confidence: AnalysisConfidence;
  studentFeedback: StudentFeedback;
  teacherDiagnosis: TeacherDiagnosis;
  criteriaAssessment?: CriterionAssessment[];
  difficultyHypothesis: string;
  feedback: PedagogicalFeedback;
  errorType: ErrorType[];
  suggestedNextStep: string;
  analysisSummary: string;
  analysisMode: AnalysisMode;
  analysisStatus?: AnalysisStatus;
  modelUsed: string;
  promptVersion: string;
  analysisRequestId?: string;
  analysisDurationMs?: number;
  modelCalls?: number;
  retryAfterSeconds?: number;
  processMetrics: {
    timeSinceSessionStart: number;
    verificationIndex: number;
    tipsCountAtSubmission: number;
  };
  isLocal?: boolean;
}

export interface AnalysisRequest {
  code: string;
  challengeId: string;
  userId: string | null;
  problemRepresentation?: ProblemRepresentationDraft;
  previousAttemptContext?: PreviousAttemptContext;
}

export interface AnalysisError {
  ok: false;
  errorCode: string;
  message: string;
}

export interface ExportMetadata {
  exportedAt: string;
  exportFormat: 'json' | 'csv';
  appVersion: string;
  totalAttempts: number;
  challengeFilter?: string;
  userId?: string;
}

export interface JsonExport {
  metadata: ExportMetadata;
  attempts: Attempt[];
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = null> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isAuthReady: boolean;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface ChallengeUIState {
  isAnalyzing: boolean;
  showSolution: boolean;
  lastAnalysisTime: number;
  error: string | null;
}
