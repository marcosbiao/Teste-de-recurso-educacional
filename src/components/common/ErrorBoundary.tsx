import * as React from 'react';
import { ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Error Boundary para capturar erros inesperados na interface.
 */
export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="global-state">
          <div className="global-state__card">
            <div className="global-state__error-icon">
              <AlertCircle size={32} />
            </div>
            <h1>Ops! Algo deu errado</h1>
            <p>{this.state.error?.message || "Ocorreu um erro inesperado na interface."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="global-state__button"
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
