import * as React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Code2, PlayCircle } from 'lucide-react';
import type { Attempt, Challenge } from '../../types';
import type { TrailProgress } from './homeData';
import { getTrailClassName } from './homeData';
import { SegmentedProgress } from './SegmentedProgress';

interface TrailDetailViewProps {
  trail: TrailProgress;
  attempts: Attempt[];
  completedChallengeIds: Set<string>;
  onBack: () => void;
  onSelectChallenge: (challenge: Challenge) => void;
}

export function TrailDetailView({ trail, attempts, completedChallengeIds, onBack, onSelectChallenge }: TrailDetailViewProps) {
  return (
    <main className={`trail-detail ${getTrailClassName(trail.id)}`}>
      <div className="home-container">
        <button className="detail-back" type="button" onClick={onBack}><ArrowLeft size={18} /> Voltar para trilhas</button>
        <header className="trail-detail__header">
          <div><span className="eyebrow">{trail.competency} • Trilha de aprendizagem</span><h1>{trail.title}</h1><p>{trail.description}</p></div>
          <div className="trail-detail__summary">
            <strong>{trail.percent}%</strong><span>{trail.completedCount} de {trail.challenges.length} desafios concluídos</span>
            <SegmentedProgress completed={trail.completedCount} total={trail.challenges.length} label={`Progresso em ${trail.title}`} />
          </div>
        </header>

        <section className="challenge-list" aria-labelledby="challenge-list-title">
          <div className="section-heading"><span><Code2 size={18} /> Sequência guiada</span><h2 id="challenge-list-title">Desafios da trilha</h2></div>
          <div className="challenge-grid">
            {trail.challenges.map((challenge, index) => {
              const challengeAttempts = attempts.filter(attempt => attempt.challengeId === challenge.id);
              const isCompleted = completedChallengeIds.has(challenge.id);
              const hasStarted = challengeAttempts.length > 0;
              return (
                <article className="challenge-card" key={challenge.id}>
                  <div className="challenge-card__index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="challenge-card__status">
                    {isCompleted ? <><CheckCircle2 size={16} /> Concluído</> : hasStarted ? <><Clock3 size={16} /> Em andamento</> : <><PlayCircle size={16} /> Não iniciado</>}
                  </div>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.subtitle || challenge.problem}</p>
                  <div className="challenge-card__meta"><span>{challenge.metadata.level}</span><span>{challenge.metadata.time}</span></div>
                  {hasStarted && <small>{challengeAttempts.length} {challengeAttempts.length === 1 ? 'tentativa' : 'tentativas'}</small>}
                  <button type="button" onClick={() => onSelectChallenge(challenge)} aria-label={`${isCompleted ? 'Revisar desafio' : hasStarted ? 'Continuar desafio' : 'Iniciar desafio'}: ${challenge.title}`}>
                    {isCompleted ? 'Revisar desafio' : hasStarted ? 'Continuar desafio' : 'Iniciar desafio'} <ArrowRight size={18} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
