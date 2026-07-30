export type AnalysisErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN_ORIGIN'
  | 'RATE_LIMITED'
  | 'INVALID_REQUEST'
  | 'CODE_TOO_LARGE'
  | 'CHALLENGE_NOT_FOUND'
  | 'MODEL_UNAVAILABLE'
  | 'MODEL_EMPTY_RESPONSE'
  | 'MODEL_JSON_INVALID'
  | 'MODEL_OUTPUT_TRUNCATED'
  | 'MODEL_RESPONSE_INVALID'
  | 'MODEL_PEDAGOGICAL_INVALID'
  | 'TIMEOUT'
  | 'INTERNAL_ERROR';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: AnalysisErrorCode,
    message: string,
    readonly retryAfterSeconds?: number,
    readonly diagnostics?: Record<string, number | string | boolean | undefined>,
  ) {
    super(message);
  }
}
