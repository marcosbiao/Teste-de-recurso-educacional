import * as React from 'react';
import { Info, LockKeyhole } from 'lucide-react';

export function PedagogicalTransparencyFooter() {
  return <footer className="home-container challenge-footer"><h2><Info size={17} />Transparência e pesquisa</h2><div><p><strong>Coleta de dados</strong>Suas interações e tentativas são registradas para acompanhamento pedagógico e pesquisa educacional.</p><p><strong>Análise por IA</strong>O feedback é gerado por Inteligência Artificial. As hipóteses e categorias são inferências automáticas.</p><p><strong>Rastreabilidade</strong>Cada análise registra as versões do sistema e do modelo utilizado para validade metodológica.</p></div></footer>;
}

export function PrivacyNotice() {
  return <div className="challenge-privacy"><LockKeyhole size={18} /><p>Seu código será analisado por uma Inteligência Artificial para fins pedagógicos. Suas tentativas são salvas para acompanhar sua evolução.</p></div>;
}
