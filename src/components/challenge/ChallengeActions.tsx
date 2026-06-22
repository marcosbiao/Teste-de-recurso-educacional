import * as React from 'react';
import { Info, RotateCcw, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface ChallengeActionsProps {
  onVerify: () => void;
  isAnalyzing: boolean;
}

export function ChallengeActions({ onVerify, isAnalyzing }: ChallengeActionsProps) {
  return (
    <aside className="challenge-actions-card">
      <span className="challenge-card-label" id="actions-title">Ações</span>
      <button className="challenge-submit-button" type="button" onClick={onVerify} disabled={isAnalyzing} aria-busy={isAnalyzing}>
        {isAnalyzing ? (
          <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RotateCcw size={19} /></motion.span>Analisando...</>
        ) : (
          <><Send size={19} />Solicitar Orientação</>
        )}
      </button>
      <div className="challenge-actions-note"><Info size={17} /><p>Seu código será analisado para oferecer feedback pedagógico sobre sua lógica e próximos passos.</p></div>
    </aside>
  );
}
