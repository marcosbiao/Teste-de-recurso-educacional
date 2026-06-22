import * as React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Componente para exibição de erros críticos.
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="global-state">
      <div className="global-state__card">
        <div className="global-state__error-icon">
          <AlertCircle size={30} />
        </div>
        <h2>Ops! Algo deu errado</h2>
        <p>{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="global-state__button"
          >
            <RotateCcw size={17} />
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );
}
