import * as React from 'react';
import { Clock3, Info, RotateCcw, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface ChallengeActionsProps {
  onVerify: () => void;
  isAnalyzing: boolean;
  isRateLimited?: boolean;
  rateLimitRemainingSeconds?: number;
  canRequestAnalysis?: boolean;
  disabledReason?: "AUTH_INITIALIZING" | "NO_AUTHENTICATED_USER";
}

export function ChallengeActions({ onVerify, isAnalyzing, isRateLimited = false, rateLimitRemainingSeconds = 0, canRequestAnalysis = true, disabledReason }: ChallengeActionsProps) {
  const isDisabled = isAnalyzing || isRateLimited || !canRequestAnalysis;

  return (
    <aside className="challenge-actions-card">
      <span className="challenge-card-label" id="actions-title">Ações</span>
      <button className="challenge-submit-button" type="button" onClick={onVerify} disabled={isDisabled} aria-busy={isAnalyzing}>
        {isAnalyzing ? (
          <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RotateCcw size={19} /></motion.span>Analisando...</>
        ) : isRateLimited ? (
          <><Clock3 size={19} />Aguarde {Math.max(1, rateLimitRemainingSeconds)}s</>
        ) : (
          <><Send size={19} />{disabledReason === "AUTH_INITIALIZING" ? "Preparando análise..." : disabledReason === "NO_AUTHENTICATED_USER" ? "Autenticação necessária" : "Solicitar Orientação"}</>
        )}
      </button>
      <div className="challenge-actions-note">
        <Info size={17} />
        <p>
          {isRateLimited
            ? `O serviço atingiu o limite temporário. Você poderá tentar novamente em aproximadamente ${Math.max(1, rateLimitRemainingSeconds)} segundos.`
            : disabledReason === 'AUTH_INITIALIZING' ? 'Preparando a autenticação antes de disponibilizar a análise.' : disabledReason === 'NO_AUTHENTICATED_USER' ? 'É necessário estar autenticado para solicitar a análise.' : 'Seu código será analisado para oferecer feedback pedagógico sobre sua lógica e próximos passos.'}
        </p>
      </div>
    </aside>
  );
}
