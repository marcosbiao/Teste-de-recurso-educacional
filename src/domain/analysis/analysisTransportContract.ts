import type { AnalysisResult } from './analysisTypes';
import type { PreviousAttemptContext, ProblemRepresentationDraft } from '../../types';

/** Serializable request reserved for the future authenticated serverless edge. */
export interface AnalyzeChallengeRequest {
  challengeId: string;
  studentCode: string;
  representation?: ProblemRepresentationDraft;
  previousAttemptContext?: Pick<PreviousAttemptContext, 'attemptNumber' | 'previousCategory' | 'previousPrimaryIssue' | 'previousGuidingQuestion' | 'previousNextAction' | 'codeChanged' | 'openedTipIds'>;
  clientVersion?: string;
  requestId?: string;
}
export interface AnalyzeChallengeResponse {
  result: AnalysisResult;
  requestId: string;
  modelUsed?: string;
  analysisMode?: 'cloudflare_qwen';
  durationMs?: number;
}
export interface AnalysisTransportErrorPayload {
  code: string;
  message: string;
  requestId?: string;
  retryAfterSeconds?: number;
}
/** Future network boundary; no Worker implementation is active yet. */
export interface AnalysisTransport {
  analyze(request: AnalyzeChallengeRequest): Promise<AnalyzeChallengeResponse>;
}
