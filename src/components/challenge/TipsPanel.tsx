import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ChevronDown, Info, Lightbulb, Zap } from 'lucide-react';
import type { Challenge } from '../../types';

interface TipsPanelProps { challenge: Challenge; usedTips: number[]; onUseTip: (tipId: number) => void; }

export function TipsPanel({ challenge, usedTips, onUseTip }: TipsPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const contentId = `tips-content-${challenge.id}`;
  const openedTipsCount = challenge.tips.filter(tip => usedTips.includes(tip.id)).length;
  const allTipsOpened = challenge.tips.length === 0 || challenge.tips.every(tip => usedTips.includes(tip.id));
  return (
    <div className="challenge-accordion challenge-accordion--amber">
      <button className="challenge-accordion__trigger" type="button" onClick={() => setIsExpanded(value => !value)} aria-expanded={isExpanded} aria-controls={contentId}>
        <span className="challenge-accordion__icon"><Lightbulb size={25} /></span>
        <span className="challenge-accordion__copy"><strong id="tips-title">Apoio Pedagógico</strong><small>Dicas para destravar seu raciocínio</small></span>
        <span className="challenge-accordion__dots" aria-label={`${openedTipsCount} de ${challenge.tips.length} dicas utilizadas`}>{challenge.tips.map(tip => <i key={tip.id} className={usedTips.includes(tip.id) ? 'is-used' : undefined} />)}</span>
        <ChevronDown className="challenge-accordion__chevron" size={20} />
      </button>
      <AnimatePresence>{isExpanded && (
        <motion.div id={contentId} className="challenge-accordion__content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
          <div className="challenge-accordion__inner">
            <div className="challenge-inline-note"><Zap size={18} /><p>Tente resolver primeiro. Use as dicas como apoio quando encontrar um bloqueio.</p></div>
            <div className="tips-list">{challenge.tips.map((tip, index) => {
              const isUsed = usedTips.includes(tip.id);
              return <article className={isUsed ? 'tip-item is-revealed' : 'tip-item'} key={tip.id}>
                <div className="tip-item__heading"><span>{index + 1}</span><strong>Dica de apoio</strong></div>
                {isUsed ? <><p>{tip.text}</p>{tip.pedagogicalGoal && <small><Info size={13} />Meta: {tip.pedagogicalGoal}</small>}</> : <p className="tip-item__hidden">Esta dica está oculta para incentivar seu raciocínio inicial.</p>}
                {!isUsed && <button type="button" onClick={() => onUseTip(tip.id)}><Zap size={15} />Revelar dica {index + 1}</button>}
              </article>;
            })}</div>
            {allTipsOpened && <div className="challenge-complete-note"><CheckCircle2 size={19} /><p>Você já utilizou todo o apoio disponível. Confie na sua lógica e envie para análise.</p></div>}
          </div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
