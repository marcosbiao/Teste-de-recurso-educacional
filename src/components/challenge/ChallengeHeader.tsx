import * as React from 'react';
import { ArrowLeft, Braces } from 'lucide-react';
import type { Challenge } from '../../types';
import { CHALLENGES } from '../../challenges';

interface ChallengeHeaderProps {
  challenge: Challenge;
  onBack: () => void;
}

export function ChallengeHeader({ challenge, onBack }: ChallengeHeaderProps) {
  const trailChallenges = CHALLENGES.filter(item => item.categoryId === challenge.categoryId);
  const position = trailChallenges.findIndex(item => item.id === challenge.id);

  return (
    <div className="challenge-identity">
      <div className="home-container challenge-identity__inner">
        <button className="challenge-back" type="button" onClick={onBack}><ArrowLeft size={18} />Voltar</button>
        <div className="challenge-identity__icon" aria-hidden="true"><Braces size={24} /></div>
        <div className="challenge-identity__copy">
          <h1>{challenge.title}</h1>
          <div><span>{challenge.metadata.level}</span>{position >= 0 && <><i aria-hidden="true" /> <span>{position + 1} de {trailChallenges.length} desafios</span></>}</div>
        </div>
      </div>
    </div>
  );
}
