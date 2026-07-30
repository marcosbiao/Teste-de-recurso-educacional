/** Shared client and Worker limits. They contain no credentials or student data. */
export const ANALYSIS_LIMITS = {
  maxCodeLength: 30_000,
  maxRepresentationLength: 4_000,
  maxPreviousAttempts: 3,
  maxHints: 10,
  maxContextLength: 12_000,
  maxRequestBodyBytes: 64_000,
  maxModelOutputTokens: 2_400,
  workerTimeoutMs: 45_000,
  clientTimeoutMs: 55_000,
} as const;
