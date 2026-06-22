import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, ChevronDown, Code2, Zap } from 'lucide-react';
import type { Challenge } from '../../types';

interface SolutionPanelProps { challenge: Challenge; isExpanded: boolean; onToggle: () => void; }

export function SolutionPanel({ challenge, isExpanded, onToggle }: SolutionPanelProps) {
  const contentId = `solution-content-${challenge.id}`;
  return (
    <div className="challenge-accordion challenge-accordion--green">
      <button className="challenge-accordion__trigger" type="button" onClick={onToggle} aria-expanded={isExpanded} aria-controls={contentId}>
        <span className="challenge-accordion__icon"><CheckCircle2 size={25} /></span>
        <span className="challenge-accordion__copy"><strong id="solution-title">Solução Sugerida</strong><small>Apenas para conferência final</small></span>
        <ChevronDown className="challenge-accordion__chevron" size={20} />
      </button>
      <AnimatePresence>{isExpanded && (
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
