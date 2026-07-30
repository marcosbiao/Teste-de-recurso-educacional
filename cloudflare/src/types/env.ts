import type { Ai, RateLimit } from '@cloudflare/workers-types';

export interface Env {
  AI: Ai;
  ANALYSIS_RATE_LIMITER: RateLimit;
  FIREBASE_PROJECT_ID: string;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT?: string;
}
