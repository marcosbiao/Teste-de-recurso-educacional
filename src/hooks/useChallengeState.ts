import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Challenge, AnalysisResult, UserProfile, ChallengeUIState, SolutionUnlockProgress, PreviousAttemptContext } from '../types';
import { useLocalDraft } from './useLocalDraft';
import { useAttemptHistory } from './useAttemptHistory';
import { analyzeChallengeAttempt } from '../services/analysisService';
import { buildPreviousAttemptContext, formatAttempt, isCodeSubstantial } from '../domain/pedagogicalDomain';
import {
  addOpenedTip,
  canCountAiAnalysisRequest,
  createInitialSolutionProgress,
  getSolutionUnlockState,
  incrementAnalysisRequestCount,
  mergeSolutionProgress,
  normalizeSolutionProgress
} from '../domain/solutionUnlock';
import { sessionService } from '../services/sessionService';
import { eventService } from '../services/eventService';
import { localPersistenceService } from '../services/localPersistenceService';
import { solutionProgressService } from '../services/solutionProgressService';
import { appConfig } from '../config/appConfig';

function logAnalysisStep(step: string, metadata?: Record<string, unknown>) {
  if (import.meta.env.DEV === true) console.info('[analysis-flow]', { step, ...(metadata || {}) });
}

export function useChallengeState(user: UserProfile | null, challenge: Challenge, isAuthReady: boolean) {
  const { cooldownMs, minSubstantialCodeLength } = appConfig.analysis;
  const challengeVersion = challenge.challengeVersion || challenge.metadata.version || '1.0.0';
  const progressUserId = user?.uid || 'anonymous';
  const { code, setCode } = useLocalDraft(challenge.id, challenge.templateCode);
  const { attempts, saveAttempt } = useAttemptHistory(user, challenge.id, isAuthReady);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [technicalAnalysisError, setTechnicalAnalysisError] = useState<AnalysisResult | null>(null);
  const [solutionProgress, setSolutionProgress] = useState<SolutionUnlockProgress>(() => (
    createInitialSolutionProgress(progressUserId, challenge.id, challengeVersion)
  ));
  const [uiState, setUiState] = useState<ChallengeUIState>({
    isAnalyzing: false,
    showSolution: false,
    lastAnalysisTime: 0,
    error: null
  });
  const [isSavingAttempt, setIsSavingAttempt] = useState(false);
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
  const [rateLimitClock, setRateLimitClock] = useState<number>(Date.now());

  const [lastAnalyzedCode, setLastAnalyzedCode] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [sessionId, setSessionId] = useState<string>('');
  const sessionStartTimeRef = useRef<number>(Date.now());
  const verificationsInSessionRef = useRef<number>(0);
  const tipsBeforeFirstVerificationRef = useRef<number>(0);
  const hasSubstantialEditRef = useRef<boolean>(false);
  const analysisInFlightRef = useRef<boolean>(false);
  const solutionProgressRef = useRef<SolutionUnlockProgress>(solutionProgress);
  const isMountedRef = useRef(true);

  const solutionUnlockState = useMemo(
    () => getSolutionUnlockState(challenge, solutionProgress),
    [challenge, solutionProgress]
  );

  const isRateLimited = rateLimitUntil !== null && rateLimitUntil > rateLimitClock;
  const rateLimitRemainingSeconds = isRateLimited
    ? Math.max(0, Math.ceil((rateLimitUntil - rateLimitClock) / 1000))
    : 0;

  const previousAttemptContext = useMemo(() => {
    try {
      const context = buildPreviousAttemptContext(
        attempts[0],
        code,
        solutionUnlockState.openedTipIds,
        attempts.length + 1
      );
      logAnalysisStep('previous_context_built', {
        hasPreviousAttempt: Boolean(attempts[0]),
        attemptNumber: context.attemptNumber,
        codeChanged: context.codeChanged
      });
      return context;
    } catch (error) {
      logAnalysisStep('analysis_error', {
        stage: 'previous_context',
        message: error instanceof Error ? error.message : String(error)
      });
      return undefined;
    }
  }, [attempts, code, solutionUnlockState.openedTipIds]);

  useEffect(() => {
    solutionProgressRef.current = solutionProgress;
  }, [solutionProgress]);

  useEffect(() => {
    if (rateLimitUntil === null) {
      return;
    }

    const tick = window.setInterval(() => {
      const now = Date.now();
      setRateLimitClock(now);
      if (now >= rateLimitUntil) {
        setRateLimitUntil(null);
      }
    }, 1000);

    return () => {
      window.clearInterval(tick);
    };
  }, [rateLimitUntil]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      analysisInFlightRef.current = false;
    };
  }, []);

  const safeSetUiState = useCallback((updater: (prev: ChallengeUIState) => ChallengeUIState) => {
    if (!isMountedRef.current) return;
    setUiState(updater);
  }, []);

  const safeSetAnalysis = useCallback((nextAnalysis: AnalysisResult | null) => {
    if (!isMountedRef.current) return;
    setAnalysis(nextAnalysis);
  }, []);

  const safeSetLastAnalyzedCode = useCallback((nextCode: string) => {
    if (!isMountedRef.current) return;
    setLastAnalyzedCode(nextCode);
  }, []);

  const safeSetTechnicalAnalysisError = useCallback((nextValue: AnalysisResult | null) => {
    if (!isMountedRef.current) return;
    setTechnicalAnalysisError(nextValue);
  }, []);

  const safeSetIsSavingAttempt = useCallback((nextValue: boolean) => {
    if (!isMountedRef.current) return;
    setIsSavingAttempt(nextValue);
  }, []);

  const finalizeAnalysisFlow = useCallback(() => {
    analysisInFlightRef.current = false;
    safeSetUiState(prev => ({ ...prev, isAnalyzing: false }));
    logAnalysisStep('analysis_flow_finished', {});
  }, [safeSetUiState]);

  const logProgressEvent = useCallback((
    type: Parameters<typeof eventService.logEvent>[3],
    metadata?: Record<string, string | number | boolean | null | undefined>
  ) => {
    if (user && sessionId && sessionId.startsWith('sess_')) {
      eventService.logEvent(user.uid, challenge.id, sessionId, type, {
        challengeId: challenge.id,
        timestamp: new Date().toISOString(),
        ...metadata
      });
    }
  }, [challenge.id, sessionId, user]);

  const persistSolutionProgress = useCallback(async (progress: SolutionUnlockProgress) => {
    localPersistenceService.saveSolutionProgress(progress);

    if (!user) return;

    try {
      await solutionProgressService.saveProgress(progress);
    } catch (error) {
      console.error('Erro ao salvar progresso de liberação da solução:', error);
    }
  }, [user]);

  const commitSolutionProgress = useCallback((nextProgress: SolutionUnlockProgress, previousProgress: SolutionUnlockProgress) => {
    const nextUnlockState = getSolutionUnlockState(challenge, nextProgress);
    const progressToSave = {
      ...nextProgress,
      solutionUnlocked: nextUnlockState.canOpenSolution
    };

    solutionProgressRef.current = progressToSave;
    setSolutionProgress(progressToSave);
    persistSolutionProgress(progressToSave);

    if (!previousProgress.solutionUnlocked && nextUnlockState.canOpenSolution) {
      logProgressEvent('solution_unlocked', {
        openedTipsCount: nextUnlockState.openedTipsCount,
        totalTips: nextUnlockState.totalTips,
        aiAnalysisRequestCount: nextUnlockState.aiAnalysisRequestCount
      });
    }
  }, [challenge, logProgressEvent, persistSolutionProgress]);

  useEffect(() => {
    if (!isAuthReady) return;

    let cancelled = false;

    const loadSolutionProgress = async () => {
      const localProgress = normalizeSolutionProgress(
        localPersistenceService.getSolutionProgress(progressUserId, challenge.id, challengeVersion),
        progressUserId,
        challenge.id,
        challengeVersion
      );

      let mergedProgress = localProgress;

      if (user) {
        try {
          const remoteProgress = await solutionProgressService.getProgress(user.uid, challenge.id, challengeVersion);
          if (remoteProgress) {
            mergedProgress = mergeSolutionProgress(localProgress, remoteProgress);
          }
        } catch (error) {
          console.error('Erro ao carregar progresso de liberação da solução:', error);
        }
      }

      if (cancelled || !isMountedRef.current) return;

      const loadedUnlockState = getSolutionUnlockState(challenge, mergedProgress);
      const progressToApply = {
        ...mergedProgress,
        solutionUnlocked: loadedUnlockState.canOpenSolution
      };

      solutionProgressRef.current = progressToApply;
      setSolutionProgress(progressToApply);
      persistSolutionProgress(progressToApply);
      safeSetUiState(prev => ({ ...prev, showSolution: false }));
    };

    loadSolutionProgress();

    return () => {
      cancelled = true;
    };
  }, [challenge, challengeVersion, isAuthReady, persistSolutionProgress, progressUserId, safeSetUiState, user]);

  useEffect(() => {
    if (!isAuthReady) return;

    let currentSessionId = '';

    const initSession = async () => {
      if (!user) {
        setSessionId(`anon_sess_${Date.now()}`);
        return;
      }

      currentSessionId = await sessionService.startSession(user.uid, challenge.id);
      setSessionId(currentSessionId);
      eventService.logEvent(user.uid, challenge.id, currentSessionId, 'challenge_view');
    };

    initSession();

    return () => {
      if (currentSessionId && user) {
        sessionService.endSession(currentSessionId);
        eventService.logEvent(user.uid, challenge.id, currentSessionId, 'session_end');
      }
    };
  }, [user, challenge.id, isAuthReady]);

  const persistAttemptAfterAnalysis = useCallback(async (
    result: AnalysisResult,
    analysisUnlockState: ReturnType<typeof getSolutionUnlockState>,
    previousContext: PreviousAttemptContext | undefined,
    codeSnapshot: string
  ) => {
    if (result.analysisStatus !== 'success' || result.shouldPersistAttempt === false) {
      logAnalysisStep('attempt_save_finished', {
        skipped: true,
        reason: result.analysisStatus !== 'success' ? result.analysisStatus : 'persistence_disabled',
        analysisMode: result.analysisMode
      });
      return;
    }

    try {
      safeSetIsSavingAttempt(true);
      logAnalysisStep('attempt_save_started', {
        analysisMode: result.analysisMode,
        attemptNumber: previousContext?.attemptNumber || attempts.length + 1
      });

      verificationsInSessionRef.current += 1;
      if (verificationsInSessionRef.current === 1) {
        tipsBeforeFirstVerificationRef.current = analysisUnlockState.openedTipsCount;
        if (user && sessionId && sessionId.startsWith('sess_')) {
          sessionService.updateMetrics(sessionId, {
            tipsBeforeFirstVerification: analysisUnlockState.openedTipsCount
          });
        }
      }

      if (user && sessionId && sessionId.startsWith('sess_')) {
        sessionService.updateMetrics(sessionId, { verificationCount: 1 });
      }

      const processMetrics = {
        timeSinceSessionStart: Math.floor((Date.now() - sessionStartTimeRef.current) / 1000),
        verificationIndex: verificationsInSessionRef.current,
        tipsCountAtSubmission: analysisUnlockState.openedTipsCount
      };

      const newAttempt = formatAttempt(
        user,
        challenge,
        codeSnapshot,
        result,
        analysisUnlockState.openedTipIds,
        sessionId,
        processMetrics
      );

      await saveAttempt(newAttempt);
      logAnalysisStep('attempt_save_finished', { savedRemotely: Boolean(user) });
    } catch (saveError) {
      logAnalysisStep('analysis_error', {
        stage: 'attempt_save',
        reason: 'attempt_save_error',
        message: saveError instanceof Error ? saveError.message : String(saveError)
      });
      console.error('Falha ao salvar tentativa:', saveError);
    } finally {
      safeSetIsSavingAttempt(false);
    }
  }, [attempts.length, challenge, safeSetIsSavingAttempt, saveAttempt, sessionId, user]);

  const handleVerify = useCallback(async () => {
    const now = Date.now();
    const isInCooldown = now - uiState.lastAnalysisTime < cooldownMs;
    const isAnalyzing = analysisInFlightRef.current || uiState.isAnalyzing;
    const codeSnapshot = code;
    const previousContextSnapshot = previousAttemptContext;
    if (!isAuthReady) {
      safeSetUiState(prev => ({ ...prev, error: "Aguarde a autenticação ser concluída antes de solicitar a análise." }));
      return;
    }

    if (isAnalyzing || isRateLimited) {
      return;
    }

    if (!canCountAiAnalysisRequest({ code: codeSnapshot, isAnalyzing, isInCooldown })) {
      if (isInCooldown) {
        safeSetUiState(prev => ({
          ...prev,
          error: `Aguarde ${Math.ceil((cooldownMs - (now - uiState.lastAnalysisTime)) / 1000)}s para uma nova análise.`
        }));
        return;
      }

      if (!isCodeSubstantial(codeSnapshot)) {
        safeSetUiState(prev => ({
          ...prev,
          error: `Escreva pelo menos ${minSubstantialCodeLength} caracteres de código antes de solicitar orientação.`
        }));
        return;
      }

      return;
    }

    analysisInFlightRef.current = true;
    safeSetUiState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    safeSetTechnicalAnalysisError(null);

    if (user && sessionId && sessionId.startsWith('sess_')) {
      eventService.logEvent(user.uid, challenge.id, sessionId, 'verify_click');
    }

    let result: AnalysisResult | null = null;
    let analysisUnlockState = getSolutionUnlockState(challenge, solutionProgressRef.current);

    try {
      result = await analyzeChallengeAttempt({
        code: codeSnapshot,
        challengeId: challenge.id,
        userId: user?.uid || null,
        previousAttemptContext: previousContextSnapshot
      });

      if (result.analysisStatus === 'success') {
        safeSetAnalysis(result);
        safeSetTechnicalAnalysisError(null);
        safeSetLastAnalyzedCode(codeSnapshot);
        safeSetUiState(prev => ({ ...prev, lastAnalysisTime: now }));
        setRateLimitUntil(null);

        if (result.shouldCountAnalysisRequest !== false) {
          const progressBeforeAnalysis = solutionProgressRef.current;
          const progressAfterAnalysis = incrementAnalysisRequestCount(progressBeforeAnalysis);
          commitSolutionProgress(progressAfterAnalysis, progressBeforeAnalysis);
          analysisUnlockState = getSolutionUnlockState(challenge, progressAfterAnalysis);

          logProgressEvent('ai_analysis_requested', {
            openedTipsCount: analysisUnlockState.openedTipsCount,
            totalTips: analysisUnlockState.totalTips,
            aiAnalysisRequestCount: analysisUnlockState.aiAnalysisRequestCount,
            attemptNumber: previousContextSnapshot?.attemptNumber || 1,
            codeChangedSincePrevious: previousContextSnapshot?.codeChanged ?? true
          });
        }

        logAnalysisStep('analysis_state_updated', {
          category: result.category,
          analysisMode: result.analysisMode,
          analysisStatus: result.analysisStatus
        });

        if (user && sessionId && sessionId.startsWith('sess_')) {
          eventService.logEvent(
            user.uid,
            challenge.id,
            sessionId,
            'analysis_success',
            {
              category: result.category,
              model: result.modelUsed,
              primaryIssueType: result.studentFeedback.primaryIssue.type,
              primaryIssueConcept: result.studentFeedback.primaryIssue.concept || null
            }
          );
        }
      } else {
        safeSetTechnicalAnalysisError(result);

        if (result.analysisStatus === 'rate_limit') {
          const retryAfterSeconds = result.retryAfterSeconds || 60;
          const nextRateLimitUntil = Date.now() + (retryAfterSeconds * 1000);
          setRateLimitClock(Date.now());
          setRateLimitUntil(nextRateLimitUntil);
        } else {
          setRateLimitUntil(null);
        }

        logAnalysisStep('analysis_state_updated', {
          analysisMode: result.analysisMode,
          analysisStatus: result.analysisStatus,
          isTransientFailure: result.isTransientFailure === true
        });

        if (user && sessionId && sessionId.startsWith('sess_')) {
          eventService.logEvent(
            user.uid,
            challenge.id,
            sessionId,
            result.analysisStatus === 'configuration_error' ? 'analysis_configuration_error' : 'analysis_error',
            {
              reason: result.analysisStatus,
              model: result.modelUsed,
              retryAfterSeconds: result.retryAfterSeconds || null
            }
          );
        }
      }
    } catch (err: any) {
      logAnalysisStep('analysis_error', {
        stage: 'analysis_request',
        message: err?.message || String(err)
      });
      console.error('Erro na verificação:', err);
      safeSetUiState(prev => ({ ...prev, error: 'Não foi possível concluir a análise neste momento. Revise seu código e tente novamente em alguns instantes.' }));
      safeSetTechnicalAnalysisError(null);
      setRateLimitUntil(null);

      if (user && sessionId && sessionId.startsWith('sess_')) {
        eventService.logEvent(user.uid, challenge.id, sessionId, 'analysis_error', { message: err.message });
      }
    } finally {
      finalizeAnalysisFlow();
    }

    if (result && result.analysisStatus === 'success' && result.shouldPersistAttempt !== false) {
      void persistAttemptAfterAnalysis(result, analysisUnlockState, previousContextSnapshot, codeSnapshot);
    }
  }, [
    code,
    challenge,
    commitSolutionProgress,
    cooldownMs,
    finalizeAnalysisFlow,
    isRateLimited,
    logProgressEvent,
    minSubstantialCodeLength,
    persistAttemptAfterAnalysis,
    previousAttemptContext,
    safeSetAnalysis,
    safeSetLastAnalyzedCode,
    safeSetTechnicalAnalysisError,
    safeSetUiState,
    sessionId,
    uiState.isAnalyzing,
    uiState.lastAnalysisTime,
    isAuthReady,
    user
  ]);

  const useTip = useCallback((tipId: number) => {
    const previousProgress = solutionProgressRef.current;
    const nextProgress = addOpenedTip(previousProgress, tipId);

    if (nextProgress.openedTipIds.length !== previousProgress.openedTipIds.length) {
      const nextUnlockState = getSolutionUnlockState(challenge, nextProgress);
      commitSolutionProgress(nextProgress, previousProgress);
      logProgressEvent('tip_opened', {
        tipId,
        openedTipsCount: nextUnlockState.openedTipsCount,
        totalTips: nextUnlockState.totalTips,
        aiAnalysisRequestCount: nextUnlockState.aiAnalysisRequestCount
      });

      if (user && sessionId && sessionId.startsWith('sess_')) {
        sessionService.updateMetrics(sessionId, { tipsOpenedCount: 1 });
      }
    }
  }, [challenge, commitSolutionProgress, logProgressEvent, sessionId, user]);

  useEffect(() => {
    if (!hasSubstantialEditRef.current && isCodeSubstantial(code)) {
      hasSubstantialEditRef.current = true;
      if (user && sessionId && sessionId.startsWith('sess_')) {
        eventService.logEvent(user.uid, challenge.id, sessionId, 'editor_first_edit');
      }
    }
  }, [code, user, sessionId, challenge.id]);

  const resetCode = () => {
    setCode(challenge.templateCode);
    setShowResetConfirm(false);
  };

  const cancelReset = () => setShowResetConfirm(false);
  const initiateReset = () => setShowResetConfirm(true);

  const setShowSolution = (val: boolean) => {
    if (val) {
      handleOpenSolution();
      return;
    }

    safeSetUiState(prev => ({ ...prev, showSolution: false }));
  };

  const handleOpenSolution = useCallback(() => {
    const currentProgress = solutionProgressRef.current;
    const currentUnlockState = getSolutionUnlockState(challenge, currentProgress);

    if (!currentUnlockState.canOpenSolution) {
      return;
    }

    const nextProgress = {
      ...currentProgress,
      solutionUnlocked: true,
      solutionOpenedAt: currentProgress.solutionOpenedAt || new Date()
    };

    solutionProgressRef.current = nextProgress;
    setSolutionProgress(nextProgress);
    persistSolutionProgress(nextProgress);
    safeSetUiState(prev => ({ ...prev, showSolution: true }));

    logProgressEvent('solution_opened', {
      openedTipsCount: currentUnlockState.openedTipsCount,
      totalTips: currentUnlockState.totalTips,
      aiAnalysisRequestCount: currentUnlockState.aiAnalysisRequestCount
    });

    if (user && sessionId && sessionId.startsWith('sess_')) {
      sessionService.updateMetrics(sessionId, { solutionViewed: true });
    }
  }, [challenge, logProgressEvent, persistSolutionProgress, safeSetUiState, sessionId, user]);

  const setError = (val: string | null) => safeSetUiState(prev => ({ ...prev, error: val }));

  const openHistory = () => {
    if (user && sessionId && sessionId.startsWith('sess_')) {
      eventService.logEvent(user.uid, challenge.id, sessionId, 'history_open');
    }
  };

  return {
    code,
    setCode,
    attempts,
    usedTips: solutionUnlockState.openedTipIds,
    analysis,
    technicalAnalysisError,
    hasChangesSinceLastAnalysis: code !== lastAnalyzedCode && lastAnalyzedCode !== '',
    allTipsOpened: solutionUnlockState.allTipsOpened,
    aiAnalysisRequestCount: solutionUnlockState.aiAnalysisRequestCount,
    displayedAnalysisRequestCount: solutionUnlockState.displayedAnalysisRequestCount,
    canOpenSolution: solutionUnlockState.canOpenSolution,
    solutionUnlockMessage: solutionUnlockState.guidanceMessage,
    openedTipsCount: solutionUnlockState.openedTipsCount,
    totalTips: solutionUnlockState.totalTips,
    previousAttemptContext,
    isSavingAttempt,
    isRateLimited,
    rateLimitRemainingSeconds,
    ...uiState,
    handleVerify,
    useTip,
    resetCode,
    cancelReset,
    initiateReset,
    showResetConfirm,
    setShowSolution,
    handleOpenSolution,
    setError,
    openHistory
  };
}
