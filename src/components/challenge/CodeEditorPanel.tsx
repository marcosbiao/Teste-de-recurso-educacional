import * as React from 'react';
import { Code2, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeEditorPanelProps {
  code: string;
  setCode: (code: string) => void;
  onReset: () => void;
  onCancelReset: () => void;
  onInitiateReset: () => void;
  showResetConfirm: boolean;
  hasChangesSinceLastAnalysis: boolean;
}

export function CodeEditorPanel({ code, setCode, onReset, onCancelReset, onInitiateReset, showResetConfirm, hasChangesSinceLastAnalysis }: CodeEditorPanelProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const lineCount = Math.max(code.split('\n').length, 1);

  React.useEffect(() => {
    if (!isFullscreen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isFullscreen]);

  return (
    <div className={`challenge-editor-card${isFullscreen ? ' is-fullscreen' : ''}`}>
      <header className="challenge-editor-card__header">
        <div><span className="challenge-panel-icon challenge-panel-icon--blue"><Code2 size={20} /></span><div><label htmlFor="code-editor">Editor de Código C</label>{hasChangesSinceLastAnalysis && <small><i />Rascunho com alterações não analisadas</small>}</div></div>
        <div>
          <button type="button" onClick={onInitiateReset} aria-label="Resetar código para o modelo inicial" title="Resetar código"><RotateCcw size={18} /></button>
          <button type="button" onClick={() => setIsFullscreen(value => !value)} aria-label={isFullscreen ? 'Sair da tela cheia' : 'Abrir editor em tela cheia'} title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}>{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </div>
      </header>

      {showResetConfirm && (
        <div className="editor-reset-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <motion.div className="editor-reset-dialog" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <span><RotateCcw size={27} /></span><h2 id="reset-title">Resetar código?</h2><p>Seu rascunho atual será perdido e o código voltará ao modelo inicial do desafio.</p>
            <div><button type="button" onClick={onCancelReset}>Cancelar</button><button type="button" onClick={onReset}>Confirmar</button></div>
          </motion.div>
        </div>
      )}

      <div className="challenge-editor-body custom-scrollbar">
        <div className="challenge-editor-lines" aria-hidden="true">{Array.from({ length: lineCount }, (_, index) => <span key={index}>{index + 1}</span>)}</div>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={value => Prism.highlight(value, Prism.languages.c, 'c')}
          padding={24}
          textareaId="code-editor"
          placeholder="// Escreva seu código C aqui..."
          className="challenge-code-editor"
        />
      </div>
    </div>
  );
}
