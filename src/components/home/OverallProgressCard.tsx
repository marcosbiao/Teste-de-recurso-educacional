import { ArrowRight, CheckCircle2, MapPinned, Route } from 'lucide-react';

interface OverallProgressCardProps {
  completed: number;
  total: number;
  percent: number;
  currentTrail?: string;
  hasProgress: boolean;
  onAction: () => void;
}

export function OverallProgressCard({ completed, total, percent, currentTrail, hasProgress, onAction }: OverallProgressCardProps) {
  return (
    <aside className="overall-card" aria-labelledby="overall-progress-title">
      <div className="overall-card__heading">
        <span id="overall-progress-title">Seu progresso geral</span>
        <Route size={20} aria-hidden="true" />
      </div>
      <div className="overall-card__body">
        <div className="progress-ring" role="img" aria-label={`${percent}% concluído`}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="progress-ring__track" cx="60" cy="60" r="51" pathLength="100" />
            <circle className="progress-ring__value" cx="60" cy="60" r="51" pathLength="100" strokeDasharray={`${percent} 100`} />
          </svg>
          <div className="progress-ring__center"><strong>{percent}%</strong><span>concluído</span></div>
        </div>
        <div className="overall-card__stats">
          <p><CheckCircle2 size={18} /><span><strong>{completed}</strong> de {total} desafios concluídos</span></p>
          <p><MapPinned size={18} /><span>Trilha atual: <strong>{currentTrail || 'Nenhuma iniciada'}</strong></span></p>
        </div>
        <button className="primary-action overall-card__action" type="button" onClick={onAction}>
          {hasProgress ? 'Continuar desafio' : 'Iniciar uma trilha'} <ArrowRight size={18} />
        </button>
      </div>
    </aside>
  );
}
