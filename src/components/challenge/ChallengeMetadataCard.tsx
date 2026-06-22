import * as React from 'react';
import { BookOpen, BrainCircuit, Clock3, Code2, Sparkles, Zap } from 'lucide-react';
import type { Challenge } from '../../types';
import { ChallengeExamplesPanel } from './ChallengeExamplesPanel';

interface ChallengeMetadataCardProps { challenge: Challenge; }

export function ChallengeMetadataCard({ challenge }: ChallengeMetadataCardProps) {
  return (
    <article className="challenge-statement-card">
      <header className="challenge-statement-card__header">
        <span className="challenge-panel-icon challenge-panel-icon--blue"><BookOpen size={23} /></span>
        <div>
          <h2 id="statement-title">Enunciado do Desafio</h2>
          <div className="challenge-meta-chips">
            <span><BrainCircuit size={14} />{challenge.metadata.skill}</span>
            <span className="is-level"><Zap size={14} />{challenge.metadata.level}</span>
            <span><Clock3 size={14} />{challenge.metadata.time}</span>
          </div>
        </div>
      </header>

      <div className="challenge-statement-card__body">
        <div className="challenge-problem-column">
          <p className="challenge-problem">{challenge.problem}</p>
          {challenge.pedagogicalMetadata?.learningObjective && (
            <div className="learning-objective">
              <span>Objetivo de aprendizagem</span>
              <p>{challenge.pedagogicalMetadata.learningObjective}</p>
            </div>
          )}
        </div>

        <div className="core-concepts">
          <h3><Sparkles size={16} />Conceitos centrais</h3>
          <div>{challenge.concepts.map(concept => <span key={concept}>{concept}</span>)}</div>
        </div>
      </div>

      <div className="challenge-statement-card__lower">
        <section className="technical-requirements">
          <h3><span><Code2 size={16} /></span>Requisitos técnicos</h3>
          <p>{challenge.metadata.requirements}</p>
        </section>
        <ChallengeExamplesPanel examples={challenge.examples} />
      </div>
    </article>
  );
}
