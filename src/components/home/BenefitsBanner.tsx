import * as React from 'react';
import { BarChart3, BrainCircuit, Flag, Target } from 'lucide-react';

const BENEFITS = [
  { icon: Target, label: 'Pratique com propósito' },
  { icon: BrainCircuit, label: 'Desenvolva seu raciocínio' },
  { icon: BarChart3, label: 'Acompanhe seus resultados' },
  { icon: Flag, label: 'Supere novos desafios' }
];

export function BenefitsBanner() {
  return (
    <section className="benefits-banner" aria-labelledby="benefits-title">
      <div className="benefits-banner__intro">
        <span className="benefits-banner__orb"><BrainCircuit size={32} /></span>
        <div><h2 id="benefits-title">Cada desafio, uma nova habilidade!</h2><p>Pratique de diferentes formas e desenvolva seu raciocínio de programação.</p></div>
      </div>
      <div className="benefits-banner__items">
        {BENEFITS.map(({ icon: Icon, label }) => <div key={label}><Icon size={25} /><span>{label}</span></div>)}
      </div>
    </section>
  );
}
