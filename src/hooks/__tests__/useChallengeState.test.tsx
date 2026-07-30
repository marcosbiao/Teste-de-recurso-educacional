import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChallengeState } from '../useChallengeState';
import { CHALLENGES } from '../../challenges';
import type { AnalysisResult, Attempt } from '../../types';

const challenge = CHALLENGES.find(item => item.id === 'desafio1_condicionais_basico')!;
const mockCallAnalyzeApi = vi.fn();
const mockSaveAttempt = vi.fn();
const mockUseAttemptHistory = vi.fn();
const mockUseLocalDraft = vi.fn();

vi.mock('../../services/analysisService', () => ({
  analyzeChallengeAttempt: (...args: unknown[]) => mockCallAnalyzeApi(...args)
}));

vi.mock('../useAttemptHistory', () => ({
  useAttemptHistory: (...args: unknown[]) => mockUseAttemptHistory(...args)
}));

vi.mock('../useLocalDraft', () => ({
  useLocalDraft: (...args: unknown[]) => mockUseLocalDraft(...args)
}));

vi.mock('../../services/sessionService', () => ({
  sessionService: {
    startSession: vi.fn().mockResolvedValue('sess_123'),
    endSession: vi.fn(),
    updateMetrics: vi.fn()
  }
}));

vi.mock('../../services/eventService', () => ({
  eventService: {
    logEvent: vi.fn()
  }
}));

vi.mock('../../services/localPersistenceService', () => ({
  localPersistenceService: {
    getSolutionProgress: vi.fn().mockReturnValue(null),
    saveSolutionProgress: vi.fn(),
    saveAttempt: vi.fn(),
    getAttempts: vi.fn().mockReturnValue([])
  }
}));

vi.mock('../../services/solutionProgressService', () => ({
  solutionProgressService: {
    getProgress: vi.fn().mockResolvedValue(null),
    saveProgress: vi.fn().mockResolvedValue(undefined)
  }
}));

function createAnalysisResult(overrides?: Partial<AnalysisResult>): AnalysisResult {
  return {
    category: 'tentativa inicial',
    confidence: 'media',
    studentFeedback: {
      positiveObservation: 'A leitura da entrada foi estruturada corretamente.',
      primaryIssue: {
        hasIssue: true,
        type: 'caso_nao_tratado',
        concept: 'estrutura condicional',
        evidence: 'A condição numero > 0 é seguida diretamente por else.',
        explanation: 'O caso zero está sendo tratado junto com os negativos.'
      },
      guidingQuestion: 'Qual valor não é positivo nem negativo?',
      nextAction: 'Crie um tratamento separado para o caso em que o valor seja zero.'
    },
    teacherDiagnosis: {
      hypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
      confidence: 'alta'
    },
    difficultyHypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
    feedback: {
      good: ['A leitura da entrada foi estruturada corretamente.'],
      review: [
        'O caso zero está sendo tratado junto com os negativos.',
        'Evidência: A condição numero > 0 é seguida diretamente por else.'
      ],
      nextStep: 'Crie um tratamento separado para o caso em que o valor seja zero.'
    },
    errorType: ['caso_nao_tratado'],
    suggestedNextStep: 'Crie um tratamento separado para o caso em que o valor seja zero.',
    analysisSummary: 'O caso zero está sendo tratado junto com os negativos.',
    analysisMode: 'gemini_primary',
    analysisStatus: 'success',
    modelUsed: 'gemini-flash-latest',
    promptVersion: '3.1.0',
    shouldPersistAttempt: true,
    shouldCountAnalysisRequest: true,
    ...overrides
  };
}

function createTechnicalResult(overrides?: Partial<AnalysisResult>): AnalysisResult {
  return createAnalysisResult({
    analysisMode: 'gemini_fallback',
    analysisStatus: 'temporarily_unavailable',
    modelUsed: 'gemini-flash-latest',
    shouldPersistAttempt: false,
    shouldCountAnalysisRequest: false,
    isTransientFailure: true,
    studentFeedback: {
      positiveObservation: 'Análise temporariamente indisponível',
      primaryIssue: {
        hasIssue: false,
        type: 'sem_erro_relevante',
        concept: '',
        evidence: '',
        explanation: ''
      },
      guidingQuestion: '',
      nextAction: 'O serviço está com alta demanda.'
    },
    ...overrides
  });
}

describe('useChallengeState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    mockUseLocalDraft.mockReturnValue({
      code: 'int main() { return 0; }',
      setCode: vi.fn()
    });
    mockUseAttemptHistory.mockReturnValue({
      attempts: [],
      saveAttempt: mockSaveAttempt
    });
    mockSaveAttempt.mockResolvedValue(undefined);
    mockCallAnalyzeApi.mockResolvedValue(createAnalysisResult());
  });

  it('encerra o spinner na primeira tentativa quando o Gemini responde', async () => {
    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.analysis?.analysisStatus).toBe('success');
    expect(result.current.technicalAnalysisError).toBeNull();
  });

  it('constrói o contexto anterior na segunda tentativa e envia ao Gemini', async () => {
    const previousAttempt: Attempt = {
      id: 'a1',
      userId: 'user-1',
      challengeId: challenge.id,
      challengeVersion: '1.0.0',
      sessionId: 'sess_1',
      timestamp: new Date(),
      code: 'int main() { return 1; }',
      tipsUsed: [1],
      ...createAnalysisResult(),
      processMetrics: { timeSinceSessionStart: 10, verificationIndex: 1, tipsCountAtSubmission: 1 }
    };

    mockUseAttemptHistory.mockReturnValue({
      attempts: [previousAttempt],
      saveAttempt: mockSaveAttempt
    });

    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockCallAnalyzeApi).toHaveBeenCalledTimes(1);
    expect(mockCallAnalyzeApi.mock.calls[0][0].previousAttemptContext).toMatchObject({
      attemptNumber: 2,
      previousCategory: 'tentativa inicial',
      codeChanged: true,
      openedTipIds: []
    });
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('ignora tentativa antiga inválida e continua a análise', async () => {
    mockUseAttemptHistory.mockReturnValue({
      attempts: [{ id: 'legacy', code: 'int main() {}' }],
      saveAttempt: mockSaveAttempt
    });

    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockCallAnalyzeApi).toHaveBeenCalledWith(expect.objectContaining({
      previousAttemptContext: undefined
    }));
    expect(result.current.analysis).not.toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('não mantém o spinner ativo quando o Firestore falha após a análise válida', async () => {
    let rejectSave!: (error: Error) => void;
    mockSaveAttempt.mockImplementation(() => new Promise((_, reject) => {
      rejectSave = reject;
    }));

    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.analysis).not.toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.isSavingAttempt).toBe(true);

    await act(async () => {
      rejectSave(new Error('firestore unavailable'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isSavingAttempt).toBe(false);
    });
    expect(result.current.analysis?.analysisStatus).toBe('success');
  });

  it('não salva, não contabiliza e não substitui a última análise válida quando ocorre rate_limit', async () => {
    vi.useFakeTimers();
    mockCallAnalyzeApi.mockReset();
    mockCallAnalyzeApi
      .mockResolvedValueOnce(createAnalysisResult())
      .mockResolvedValueOnce(createTechnicalResult({
        analysisStatus: 'rate_limit',
        retryAfterSeconds: 60,
        studentFeedback: {
          positiveObservation: 'Limite temporário de análises atingido',
          primaryIssue: {
            hasIssue: false,
            type: 'sem_erro_relevante',
            concept: '',
            evidence: '',
            explanation: ''
          },
          guidingQuestion: '',
          nextAction: 'Aguarde antes de solicitar nova análise.'
        }
      }));

    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    await act(async () => {
      await result.current.handleVerify();
    });

    const lastValidAnalysis = result.current.analysis;
    expect(lastValidAnalysis?.analysisStatus).toBe('success');
    expect(result.current.aiAnalysisRequestCount).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_001);
      await result.current.handleVerify();
    });

    expect(result.current.analysis).toBe(lastValidAnalysis);
    expect(result.current.technicalAnalysisError?.analysisStatus).toBe('rate_limit');
    expect(result.current.aiAnalysisRequestCount).toBe(1);
    expect(result.current.displayedAnalysisRequestCount).toBe(1);
    expect(result.current.canOpenSolution).toBe(false);
    expect(mockSaveAttempt).toHaveBeenCalledTimes(1);
  });


  it('não salva nem substitui a última análise válida quando ocorre configuration_error', async () => {
    vi.useFakeTimers();
    mockCallAnalyzeApi.mockReset();
    mockCallAnalyzeApi
      .mockResolvedValueOnce(createAnalysisResult())
      .mockResolvedValueOnce(createTechnicalResult({
        analysisStatus: 'configuration_error',
        isTransientFailure: false,
        studentFeedback: {
          positiveObservation: 'Configuração da análise indisponível',
          primaryIssue: {
            hasIssue: false,
            type: 'sem_erro_relevante',
            concept: '',
            evidence: '',
            explanation: ''
          },
          guidingQuestion: '',
          nextAction: 'A configuração do sistema precisa ser revisada.'
        }
      }));

    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    await act(async () => {
      await result.current.handleVerify();
    });

    const lastValidAnalysis = result.current.analysis;
    expect(lastValidAnalysis?.analysisStatus).toBe('success');
    expect(result.current.aiAnalysisRequestCount).toBe(1);
    expect(mockSaveAttempt).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_001);
      await result.current.handleVerify();
    });

    expect(result.current.analysis).toBe(lastValidAnalysis);
    expect(result.current.technicalAnalysisError?.analysisStatus).toBe('configuration_error');
    expect(result.current.aiAnalysisRequestCount).toBe(1);
    expect(result.current.displayedAnalysisRequestCount).toBe(1);
    expect(result.current.canOpenSolution).toBe(false);
    expect(mockSaveAttempt).toHaveBeenCalledTimes(1);
    expect(mockCallAnalyzeApi.mock.calls[1][0].previousAttemptContext).toMatchObject({ attemptNumber: 1 });

    mockCallAnalyzeApi.mockResolvedValueOnce(createAnalysisResult({ category: 'parcialmente correta' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_001);
      await result.current.handleVerify();
    });

    expect(mockCallAnalyzeApi.mock.calls[2][0].previousAttemptContext).toMatchObject({ attemptNumber: 1 });
    expect(result.current.analysis?.category).toBe('parcialmente correta');
    expect(mockSaveAttempt).toHaveBeenCalledTimes(2);
  });

  it('bloqueia novas chamadas durante o cooldown de 429 e libera após o prazo', async () => {
    vi.useFakeTimers();
    mockCallAnalyzeApi.mockReset();
    mockCallAnalyzeApi.mockResolvedValueOnce(createTechnicalResult({
      analysisStatus: 'rate_limit',
      retryAfterSeconds: 60,
      studentFeedback: {
        positiveObservation: 'Limite temporário de análises atingido',
        primaryIssue: {
          hasIssue: false,
          type: 'sem_erro_relevante',
          concept: '',
          evidence: '',
          explanation: ''
        },
        guidingQuestion: '',
        nextAction: 'Aguarde antes de solicitar nova análise.'
      }
    }));

    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.isRateLimited).toBe(true);
    expect(result.current.rateLimitRemainingSeconds).toBeGreaterThanOrEqual(59);
    expect(mockCallAnalyzeApi).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockCallAnalyzeApi).toHaveBeenCalledTimes(1);

    mockCallAnalyzeApi.mockResolvedValueOnce(createAnalysisResult({ category: 'parcialmente correta' }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });

    expect(result.current.isRateLimited).toBe(false);

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(mockCallAnalyzeApi).toHaveBeenCalledTimes(2);
    expect(result.current.analysis?.category).toBe('parcialmente correta');
  });

  it('bloqueia cliques duplicados e faz apenas uma requisição ao Gemini', async () => {
    let resolveAnalysis!: (value: AnalysisResult) => void;
    mockCallAnalyzeApi.mockReset();
    mockCallAnalyzeApi.mockImplementation(() => new Promise((resolve) => {
      resolveAnalysis = resolve;
    }));

    const { result } = renderHook(() => useChallengeState(null, challenge, true));

    const first = result.current.handleVerify();
    const second = result.current.handleVerify();

    await waitFor(() => {
      expect(mockCallAnalyzeApi).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      resolveAnalysis(createAnalysisResult());
      await Promise.all([first, second]);
    });

    expect(result.current.isAnalyzing).toBe(false);
    expect(mockCallAnalyzeApi).toHaveBeenCalledTimes(1);
  });
});


describe('useChallengeState — encerramento de análise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocalDraft.mockReturnValue({ code: 'int main() { return 0; }', setCode: vi.fn() });
    mockUseAttemptHistory.mockReturnValue({ attempts: [], saveAttempt: mockSaveAttempt });
    mockSaveAttempt.mockResolvedValue(undefined);
  });

  it('sempre restaura isAnalyzing quando o cliente rejeita inesperadamente', async () => {
    mockCallAnalyzeApi.mockRejectedValueOnce(new Error('network failure'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { result } = renderHook(() => useChallengeState(null, challenge, true));
    await act(async () => { await result.current.handleVerify(); });
    expect(result.current.isAnalyzing).toBe(false);
  });
});


describe('useChallengeState — análise local', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocalDraft.mockReturnValue({ code: 'int main() { return 0; }', setCode: vi.fn() });
    mockUseAttemptHistory.mockReturnValue({ attempts: [], saveAttempt: mockSaveAttempt });
    mockSaveAttempt.mockResolvedValue(undefined);
  });

  it('exibe, persiste e encerra uma orientação local bem-sucedida', async () => {
    mockCallAnalyzeApi.mockResolvedValueOnce(createAnalysisResult({ analysisMode: 'local_fallback', modelUsed: 'local_challenge_rules' }));
    const { result } = renderHook(() => useChallengeState(null, challenge, true));
    await act(async () => { await result.current.handleVerify(); });
    await waitFor(() => expect(mockSaveAttempt).toHaveBeenCalled());
    expect(result.current.analysis?.analysisMode).toBe('local_fallback');
    expect(result.current.isAnalyzing).toBe(false);
    expect(mockSaveAttempt.mock.calls[0][0].analysisMode).toBe('local_fallback');
  });
});
