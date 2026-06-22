import * as React from 'react';
import { Terminal } from 'lucide-react';
import type { ChallengeExample } from '../../types';

interface ChallengeExamplesPanelProps { examples: ChallengeExample[]; }

export function ChallengeExamplesPanel({ examples }: ChallengeExamplesPanelProps) {
  if (!examples?.length) return null;
  return (
    <section className="challenge-examples">
      <h3><span><Terminal size={16} /></span>Exemplos de entrada e saída</h3>
      <div className="challenge-examples__table-wrap">
        <table>
          <thead><tr><th>Entrada</th><th>Saída esperada</th></tr></thead>
          <tbody>{examples.map((example, index) => <tr key={index}><td>{example.input}</td><td>{example.output}</td></tr>)}</tbody>
        </table>
      </div>
      {examples.some(example => example.description) && (
        <div className="challenge-example-notes">{examples.filter(example => example.description).map((example, index) => <p key={index}>{example.description}</p>)}</div>
      )}
    </section>
  );
}
