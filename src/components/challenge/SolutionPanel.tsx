import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, ChevronDown, Code2, Zap } from 'lucide-react';
import type { Challenge } from '../../types';

interface SolutionPanelProps {
  challenge: Challenge;
  isExpanded: boolean;
  isUnlocked: boolean;
  guidanceMessage: string;
  openedTipsCount: number;
  totalTips: number;
  displayedAnalysisRequestCount: number;
  onOpen: () => void;
  onClose: () => void;
}

export function SolutionPanel({
  challenge,
  isExpanded,
  isUnlocked,
  guidanceMessage,
  openedTipsCount,
  totalTips,
  displayedAnalysisRequestCount,
  onOpen,
  onClose
}: SolutionPanelProps) {
  const contentId = `solution-content-${challenge.id}`;
  const handleToggle = () => {
    if (isExpanded) {
      onClose();
      return;
    }

    onOpen();
  };

  return (
    <div className="challenge-accordion challenge-accordion--green">
      <button className="challenge-accordion__trigger" type="button" onClick={handleToggle} aria-expanded={isExpanded} aria-controls={contentId} disabled={!isUnlocked} aria-disabled={!isUnlocked}>
        <span className="challenge-accordion__icon"><CheckCircle2 size={25} /></span>
        <span className="challenge-accordion__copy"><strong id="solution-title">Solução Sugerida</strong><small>{isUnlocked ? 'Ver solução de referência' : 'Solução bloqueada'}</small></span>
        <ChevronDown className="challenge-accordion__chevron" size={20} />
      </button>
      <div className="challenge-inline-note">
        <CheckCircle2 size={18} />
        <div>
          <p>{guidanceMessage}</p>
          <small>Dicas consultadas: {openedTipsCount} de {totalTips}</small>
          <small>Análises solicitadas: {displayedAnalysisRequestCount} de 2</small>
        </div>
      </div>
      <AnimatePresence>{isUnlocked && isExpanded && (
        <motion.div id={contentId} className="challenge-accordion__content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
          <div className="challenge-accordion__inner solution-content">
            <div className="challenge-inline-note is-warning"><AlertTriangle size={18} /><p>Use a solução apenas para comparar com o seu raciocínio depois de tentar resolver por conta própria.</p></div>
            <section><h3><Zap size={16} />Lógica esperada</h3><p>{challenge.orientation.expectedLogic}</p></section>
            <section><h3><Code2 size={16} />Implementação de referência</h3><pre className="custom-scrollbar"><code>{challenge.solution}</code></pre></section>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
