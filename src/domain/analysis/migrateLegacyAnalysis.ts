import type { AnalysisMode, AnalysisResult, AnalysisStatus } from './analysisTypes';
import { normalizeAnalysisResult } from '../pedagogicalDomain';

export function migrateLegacyAnalysis(
  value: unknown,
  defaults?: Partial<Pick<AnalysisResult, 'analysisMode' | 'analysisStatus' | 'modelUsed' | 'promptVersion'>>
): AnalysisResult {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const analysisMode: AnalysisMode = defaults?.analysisMode || (typeof record.analysisMode === 'string' ? record.analysisMode as AnalysisMode : 'unknown');
  const analysisStatus: AnalysisStatus | undefined = defaults?.analysisStatus || (typeof record.analysisStatus === 'string' ? record.analysisStatus as AnalysisStatus : undefined);
  return normalizeAnalysisResult(record, { ...defaults, analysisMode, ...(analysisStatus ? { analysisStatus } : {}) });
}
