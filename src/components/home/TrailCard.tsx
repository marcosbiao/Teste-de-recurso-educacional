import * as React from 'react';
import { ArrowRight, BarChart3, Boxes, Braces, Cuboid, GitBranch, Grid3X3, ListTree, Repeat2 } from 'lucide-react';
import type { TrailProgress } from './homeData';
import { COGNITIVE_OPERATION_LABELS, getTrailClassName } from './homeData';
import { SegmentedProgress } from './SegmentedProgress';

interface TrailCardProps {
  trail: TrailProgress;
  onOpen: () => void;
}

function TrailIcon({ id }: { id: string }) {
  if (id === 'representacao') return <ListTree size={27} />;
  if (id === 'condicionais') return <GitBranch size={27} />;
  if (id === 'lacos') return <Repeat2 size={27} />;
  if (id === 'vetores') return <Boxes size={27} />;
  if (id === 'matrizes') return <Grid3X3 size={27} />;
  if (id === 'funcoes') return <Braces size={27} />;
  return <Cuboid size={27} />;
}

export function TrailCard({ trail, onOpen }: TrailCardProps) {
  const total = trail.challenges.length;
  const cognitiveOperation = trail.challenges[0]?.pedagogicalMetadata.cognitiveOperation;
  const action = trail.status === 'completed' ? 'Revisar trilha' : trail.status === 'in-progress' ? 'Continuar trilha' : 'Iniciar trilha';
  const status = trail.status === 'completed' ? 'Concluída' : trail.status === 'in-progress' ? 'Em andamento' : 'Não iniciada';

  return (
    <article className={`trail-card ${getTrailClassName(trail.id)}`}>
      <div className="trail-card__top">
        <div className="trail-card__icon"><TrailIcon id={trail.id} /></div>
        <div><span className="trail-card__code">{trail.competency}</span><h3>{trail.title}</h3></div>
      </div>
      <p className="trail-card__description">{trail.description}</p>
      {trail.concepts && (
        <div className="trail-card__concepts" aria-label={`Conceitos de ${trail.title}`}>
          {trail.concepts.map(concept => <span key={concept}>{concept}</span>)}
        </div>
      )}
      <div className="trail-card__progress-copy">
        <span>{trail.completedCount} de {total} concluídos</span><strong>{trail.percent}%</strong>
      </div>
      <SegmentedProgress completed={trail.completedCount} total={total} label={`${trail.completedCount} de ${total} desafios concluídos`} />
      <div className="trail-card__meta">
        <span><Cuboid size={16} />{total} {total === 1 ? 'desafio' : 'desafios'}</span>
        {cognitiveOperation && <span><BarChart3 size={16} />{COGNITIVE_OPERATION_LABELS[cognitiveOperation] || cognitiveOperation}</span>}
      </div>
      <span className="trail-card__status">Status: {status}</span>
      <button className="trail-card__action" type="button" onClick={onOpen} aria-label={`${action}: ${trail.title}`}>{action}<ArrowRight size={18} /></button>
    </article>
  );
}
