import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, Clock3, Code2, FileJson, FileSpreadsheet, History, PieChart, Search, Zap } from 'lucide-react';
import type { Attempt } from '../../types';
import { exportService } from '../../services/exportService';

interface AttemptHistoryPanelProps {
  attempts: Attempt[];
  challengeId?: string;
  userId?: string;
}

export function AttemptHistoryPanel({ attempts, challengeId, userId }: AttemptHistoryPanelProps) {
  const [showSummary, setShowSummary] = React.useState(false);

  if (!attempts.length) {
    return <div className="attempt-history-empty"><span><History size={31} /></span><h2 id="history-title">Sem histórico ainda</h2><p>Suas tentativas aparecerão aqui para que você possa acompanhar sua evolução.</p></div>;
  }

  const stats = {
    total: attempts.length,
    completed: attempts.filter(attempt => attempt.category === 'solução adequada').length,
    tips: attempts.reduce((total, attempt) => total + (attempt.tipsUsed?.length || 0), 0),
    lastCategory: attempts[0]?.category || 'N/A'
  };

  return (
    <div className="attempt-history-card">
      <header>
        <div><span className="challenge-panel-icon"><History size={21} /></span><div><h2 id="history-title">Histórico de evolução</h2><p>{attempts.length} {attempts.length === 1 ? 'tentativa registrada' : 'tentativas registradas'}</p></div></div>
        <div className="attempt-history-actions">
          <button type="button" onClick={() => setShowSummary(value => !value)} aria-label="Exibir resumo do histórico" aria-expanded={showSummary}><PieChart size={18} /></button>
          <button type="button" onClick={() => exportService.exportToJson(attempts, userId, challengeId)}><FileJson size={17} />JSON</button>
          <button type="button" onClick={() => exportService.exportToCsv(attempts, userId, challengeId)}><FileSpreadsheet size={17} />CSV</button>
        </div>
      </header>
      <AnimatePresence>{showSummary && <motion.div className="attempt-summary" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
        <div><span>Total</span><strong>{stats.total}</strong></div><div><span>Sucesso</span><strong>{stats.completed}</strong></div><div><span>Dicas</span><strong>{stats.tips}</strong></div><div><span>Status atual</span><strong>{stats.lastCategory}</strong></div>
      </motion.div>}</AnimatePresence>
      <div className="attempt-list">{attempts.map((attempt, index) => <AttemptHistoryItem key={attempt.id} attempt={attempt} number={attempts.length - index} />)}</div>
    </div>
  );
}

function AttemptHistoryItem({ attempt, number }: { attempt: Attempt; number: number }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const date = attempt.timestamp?.toDate ? attempt.timestamp.toDate() : new Date(attempt.timestamp);
  const formattedDate = Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const statusClass = attempt.category === 'solução adequada' ? 'is-success' : attempt.category === 'parcialmente correta' ? 'is-warning' : attempt.category === 'quase completa' ? 'is-info' : '';
  const contentId = `attempt-content-${attempt.id}`;
  const hasIssue = attempt.studentFeedback.primaryIssue.hasIssue;

  return <article className={`attempt-item ${statusClass}`}>
    <button type="button" onClick={() => setIsExpanded(value => !value)} aria-expanded={isExpanded} aria-controls={contentId}>
      <span className="attempt-item__marker" aria-hidden="true" />
      <span className="attempt-item__copy">
        <strong>Tentativa {number}: {attempt.category || 'Registrada'}</strong>
        <small>{formattedDate && <span><Clock3 size={13} />{formattedDate}</span>}<span><Zap size={13} />{attempt.tipsUsed.length} dicas</span>{attempt.isLocal && <em>Offline</em>}</small>
      </span>
      <ChevronDown size={19} />
    </button>
    <AnimatePresence>{isExpanded && <motion.div id={contentId} className="attempt-item__content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
      <section>
        <h3><Search size={15} />Problema principal</h3>
        <p>{hasIssue ? (attempt.studentFeedback.primaryIssue.concept || attempt.studentFeedback.primaryIssue.explanation) : 'Nenhum problema prioritário relevante foi registrado nesta tentativa.'}</p>
      </section>
      <section className="attempt-tip">
        <h3><ArrowRight size={15} />Próxima ação</h3>
        <p>{attempt.studentFeedback.nextAction || attempt.suggestedNextStep || 'Revise o ponto principal e tente novamente.'}</p>
      </section>
      <section>
        <h3><Code2 size={15} />Código enviado</h3>
        <pre className="custom-scrollbar"><code>{attempt.code}</code></pre>
      </section>
    </motion.div>}</AnimatePresence>
  </article>;
}
