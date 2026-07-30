import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';
import type { Challenge, UserProfile } from '../../types';
import { auth } from '../../firebase';
import { useChallengeState } from '../../hooks/useChallengeState';
import { HomeHeader } from '../home/HomeHeader';
import { ChallengeHeader } from './ChallengeHeader';
import { ChallengeMetadataCard } from './ChallengeMetadataCard';
import { CodeEditorPanel } from './CodeEditorPanel';
import { ChallengeActions } from './ChallengeActions';
import { TipsPanel } from './TipsPanel';
import { SolutionPanel } from './SolutionPanel';
import { FeedbackPanel } from './FeedbackPanel';
import { AttemptHistoryPanel } from './AttemptHistoryPanel';
import { PedagogicalTransparencyFooter, PrivacyNotice } from './ChallengeFooter';

interface ChallengePageProps {
  challenge: Challenge;
  user: UserProfile | null;
  isAuthReady: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  onBack: () => void;
  onOpenWorkshop: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function ChallengePage({ challenge, user, isAuthReady, isAuthenticated, isAnonymous, onBack, onOpenWorkshop, onLogin, onLogout }: ChallengePageProps) {
  const state = useChallengeState(user, challenge, isAuthReady);
  const analysisDisabledReason = !isAuthReady ? "AUTH_INITIALIZING" : !isAuthenticated ? "NO_AUTHENTICATED_USER" : undefined;
  const authDiagnosticRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (import.meta.env.DEV !== true || !analysisDisabledReason) return;
    const diagnostic = { authReady: isAuthReady, firebaseAuthenticated: isAuthenticated, anonymous: isAnonymous, hasUserProfile: Boolean(user), firebaseCurrentUser: Boolean(auth.currentUser), analyzing: state.isAnalyzing, analysisAvailable: !analysisDisabledReason, analysisDisabledReason };
    const key = JSON.stringify(diagnostic);
    if (authDiagnosticRef.current !== key) { authDiagnosticRef.current = key; console.info("[analysis-auth-state]", diagnostic); }
  }, [analysisDisabledReason, isAuthReady, user, state.isAnalyzing]);

  return (
    <div className="home-shell challenge-shell">
      <HomeHeader user={user} onOpenWorkshop={onOpenWorkshop} onLogin={onLogin} onLogout={onLogout} onShowTrails={onBack} />
      <ChallengeHeader challenge={challenge} onBack={onBack} />

      <main className="home-container challenge-layout">
        <div className="challenge-main-column">
          <section className="challenge-area challenge-area--statement" aria-labelledby="statement-title"><ChallengeMetadataCard challenge={challenge} /></section>
          <section className="challenge-area challenge-area--editor" aria-label="Editor de código"><CodeEditorPanel code={state.code} setCode={state.setCode} onReset={state.resetCode} onCancelReset={state.cancelReset} onInitiateReset={state.initiateReset} showResetConfirm={state.showResetConfirm} hasChangesSinceLastAnalysis={state.hasChangesSinceLastAnalysis} /></section>
          <div className="challenge-area challenge-area--messages"><AnimatePresence>{state.error && <motion.div className="challenge-alert challenge-alert--error" role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><span className="challenge-alert__icon"><AlertCircle size={21} /></span><div><h2>Atenção</h2><p>{state.error}</p></div><button type="button" onClick={() => state.setError(null)} aria-label="Fechar mensagem"><X size={18} /></button></motion.div>}</AnimatePresence></div>
          {(state.isAnalyzing || state.analysis || state.technicalAnalysisError) && <section className="challenge-area challenge-area--feedback" aria-labelledby="feedback-title" aria-live="polite"><FeedbackPanel analysis={state.analysis} technicalError={state.technicalAnalysisError} isAnalyzing={state.isAnalyzing} rateLimitRemainingSeconds={state.rateLimitRemainingSeconds} /></section>}
          <div className="challenge-area challenge-area--privacy"><PrivacyNotice /></div>
        </div>

        <aside className="challenge-side-column" aria-label="Apoio e progresso do desafio">
          <section className="challenge-area challenge-area--tips" aria-labelledby="tips-title"><TipsPanel challenge={challenge} usedTips={state.usedTips} onUseTip={state.useTip} /></section>
          <section className="challenge-area challenge-area--solution" aria-labelledby="solution-title"><SolutionPanel challenge={challenge} isExpanded={state.showSolution} isUnlocked={state.canOpenSolution} guidanceMessage={state.solutionUnlockMessage} openedTipsCount={state.openedTipsCount} totalTips={state.totalTips} displayedAnalysisRequestCount={state.displayedAnalysisRequestCount} onOpen={state.handleOpenSolution} onClose={() => state.setShowSolution(false)} /></section>
          <section className="challenge-area challenge-area--history" aria-labelledby="history-title" onMouseEnter={state.openHistory}><AttemptHistoryPanel attempts={state.attempts} challengeId={challenge.id} userId={user?.uid} /></section>
          <section className="challenge-area challenge-area--actions" aria-labelledby="actions-title"><ChallengeActions onVerify={state.handleVerify} isAnalyzing={state.isAnalyzing} isRateLimited={state.isRateLimited} rateLimitRemainingSeconds={state.rateLimitRemainingSeconds} canRequestAnalysis={!analysisDisabledReason} disabledReason={analysisDisabledReason} /></section>
        </aside>
      </main>

      <PedagogicalTransparencyFooter />
    </div>
  );
}
