import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import type { Challenge } from '../../types';

interface CommonErrorsPanelProps { challenge: Challenge; isExpanded: boolean; onToggle: () => void; }

export function CommonErrorsPanel({ challenge, isExpanded, onToggle }: CommonErrorsPanelProps) {
  const contentId = `common-errors-content-${challenge.id}`;
  return (
    <div className="challenge-accordion challenge-accordion--red">
      <button className="challenge-accordion__trigger" type="button" onClick={onToggle} aria-expanded={isExpanded} aria-controls={contentId}>
        <span className="challenge-accordion__icon"><AlertCircle size={25} /></span>
        <span className="challenge-accordion__copy"><strong id="common-errors-title">Erros Comuns</strong><small>O que evitar no seu código</small></span>
        <ChevronDown className="challenge-accordion__chevron" size={20} />
      </button>
      <AnimatePresence>{isExpanded && (
        <motion.div id={contentId} className="challenge-accordion__content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
          <div className="challenge-accordion__inner common-errors-list">{challenge.commonErrors.map(error => <article key={error.title}>
            <h3><AlertCircle size={17} />{error.title}</h3><p>{error.description}</p>
            {error.pedagogicalAdvice && <div><span>Conselho pedagógico</span>{error.pedagogicalAdvice}</div>}
          </article>)}</div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
