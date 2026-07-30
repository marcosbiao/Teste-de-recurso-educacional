import * as React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ArrowRight, CheckCircle2, Compass, Eye, RotateCcw, Sparkles, Target } from 'lucide-react';
import type { AnalysisResult, AnalysisStatus } from '../../types';
import { getLatestAnalysisDiagnostic } from '../../services/analysisDiagnostics';

interface FeedbackPanelProps {
  analysis: AnalysisResult | null;
  technicalError?: AnalysisResult | null;
  isAnalyzing?: boolean;
  rateLimitRemainingSeconds?: number;
}

function getTechnicalCopy(status: AnalysisStatus, rateLimitRemainingSeconds?: number) {
  switch (status) {
    case 'code_too_large':
      return { title: 'Código acima do limite de análise', message: 'O código está maior que o limite suportado para análise automática. Reduza a tentativa antes de solicitar uma nova análise.', detail: null };
    case 'invalid_input':
      return { title: 'Solicitação de análise inválida', message: 'Revise os dados da tentativa antes de solicitar uma nova análise.', detail: null };
    case 'rate_limit':
      return {
        title: 'Limite temporário de análises atingido',
        message: 'O serviço de análise atingiu temporariamente o limite de uso. Seu código foi preservado. Aguarde antes de solicitar uma nova análise.',
        detail: rateLimitRemainingSeconds && rateLimitRemainingSeconds > 0
          ? `Você poderá tentar novamente em aproximadamente ${rateLimitRemainingSeconds} segundos.`
          : null
      };
    case 'temporarily_unavailable':
      return {
        title: 'Análise temporariamente indisponível',
        message: 'O serviço de análise está com alta demanda no momento. Seu código foi preservado. Tente novamente em alguns instantes.',
        detail: null
      };
    case 'timeout':
      return {
        title: 'A análise demorou mais que o esperado',
        message: 'Não foi possível concluir a análise dentro do tempo previsto. Seu código foi preservado.',
        detail: null
      };
    case 'invalid_response':
      return {
        title: 'A resposta automática não pôde ser validada',
        message: 'O serviço respondeu em um formato inesperado. Seu código foi preservado e você pode tentar novamente.',
        detail: null
      };
    case 'authentication_error':
      return {
        title: 'Falha de autenticação da análise automática',
        message: 'A configuração atual não permitiu autenticar a chamada da análise. Seu código foi preservado.',
        detail: null
      };
    case 'configuration_error':
      return {
        title: 'Configuração da análise indisponível',
        message: 'O modelo de Inteligência Artificial configurado não está disponível. Seu código foi preservado. A configuração do sistema precisa ser revisada antes de uma nova análise.',
        detail: null
      };
    default:
      return {
        title: 'Não foi possível concluir a análise automática',
        message: 'Não foi possível concluir a análise agora. Sua tentativa foi preservada.',
        detail: null
      };
  }
}

function InlineCodeText({ text }: { text: string }) {
  return <>
    {text.split(/(`[^`]+`)/g).map((part, index) => part.startsWith("`") && part.endsWith("`")
      ? <code key={index}>{part.slice(1, -1)}</code>
      : <React.Fragment key={index}>{part}</React.Fragment>)}
  </>;
}

function PedagogicalFeedbackCard({ analysis }: { analysis: AnalysisResult }) {
  const { studentFeedback } = analysis;
  const hasIssue = studentFeedback.primaryIssue.hasIssue;

  return (
    <motion.article className="feedback-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header>
        <span><Sparkles size={23} /></span>
        <div>
          <h2 id="feedback-title">Orientação Pedagógica</h2>
          <p>{analysis.analysisMode === 'local_fallback' ? 'Feedback baseado nos critérios do desafio' : 'Análise da IA concluída'}</p>
        </div>
        <strong>{analysis.category}</strong>
      </header>

      <div className="feedback-card__body" aria-live="polite">
        <section className="feedback-section feedback-section--positive">
          <h3><CheckCircle2 size={18} />O que você já conseguiu</h3>
          <p><InlineCodeText text={studentFeedback.positiveObservation} /></p>
        </section>

        {hasIssue ? (
          <section className="feedback-section feedback-section--focus">
            <h3><Target size={18} />Principal ponto para revisar</h3>
            {studentFeedback.primaryIssue.concept && <strong>{studentFeedback.primaryIssue.concept}</strong>}
            <p><InlineCodeText text={studentFeedback.primaryIssue.explanation} /></p>
            {studentFeedback.primaryIssue.evidence && (
              <div className="feedback-evidence" role="note" aria-label="Evidência observada no código">
                <span><Eye size={15} />Evidência</span>
                <p><InlineCodeText text={studentFeedback.primaryIssue.evidence} /></p>
              </div>
            )}
          </section>
        ) : (
          <section className="feedback-section feedback-section--consolidation">
            <h3><Target size={18} />Consolidação da solução</h3>
            <p>Sua solução atual não apresenta um problema prioritário relevante. Use a pergunta abaixo para consolidar o raciocínio que você aplicou.</p>
          </section>
        )}

        <section className="feedback-section feedback-section--question">
          <h3><Compass size={18} />Pense sobre isso</h3>
          <p><InlineCodeText text={studentFeedback.guidingQuestion} /></p>
        </section>

        <section className="feedback-section feedback-section--action">
          <h3><ArrowRight size={18} />Sua próxima ação</h3>
          <p><InlineCodeText text={studentFeedback.nextAction} /></p>
        </section>
      </div>
    </motion.article>
  );
}

function DevelopmentAnalysisPanel() {
  if (import.meta.env.DEV !== true) return null;
  const diagnostic = getLatestAnalysisDiagnostic();
  if (!diagnostic) return null;
  return (
    <details className="analysis-diagnostics" aria-label="Diagnóstico técnico da análise">
      <summary>Diagnóstico técnico local</summary>
      <dl>
        <dt>Solicitação</dt><dd>{diagnostic.requestId}</dd>
        {diagnostic.analysisMode && <><dt>Origem</dt><dd>{diagnostic.analysisMode}</dd></>}
        {diagnostic.model && <><dt>Modelo</dt><dd>{diagnostic.model}</dd></>}
        {diagnostic.attempt && <><dt>Tentativa</dt><dd>{diagnostic.attempt}</dd></>}
        {diagnostic.durationMs !== undefined && <><dt>Duração</dt><dd>{diagnostic.durationMs} ms</dd></>}
        {diagnostic.outcome && <><dt>Status técnico</dt><dd>{diagnostic.outcome}</dd></>}
        {diagnostic.finishReason && <><dt>Encerramento</dt><dd>{diagnostic.finishReason}</dd></>}
        {diagnostic.normalized !== undefined && <><dt>Normalizada</dt><dd>{diagnostic.normalized ? 'sim' : 'não'}</dd></>}
        {diagnostic.fallbackUsed !== undefined && <><dt>Fallback local</dt><dd>{diagnostic.fallbackUsed ? 'sim' : 'não'}</dd></>}
        {diagnostic.inputLength !== undefined && <><dt>Tamanho da entrada</dt><dd>{diagnostic.inputLength}</dd></>}
        {diagnostic.modelCalls !== undefined && <><dt>Chamadas de modelo</dt><dd>{diagnostic.modelCalls}</dd></>}
        {diagnostic.httpStatus !== undefined && <><dt>Status HTTP</dt><dd>{diagnostic.httpStatus}</dd></>}
        {diagnostic.primaryAnalysisMode && <><dt>Análise principal</dt><dd>{diagnostic.primaryAnalysisMode}</dd></>}
        {diagnostic.primaryOutcome && <><dt>Status principal</dt><dd>{diagnostic.primaryOutcome}</dd></>}
        {diagnostic.primaryHttpStatus !== undefined && <><dt>HTTP principal</dt><dd>{diagnostic.primaryHttpStatus}</dd></>}
        {diagnostic.primaryDurationMs !== undefined && <><dt>Duração principal</dt><dd>{diagnostic.primaryDurationMs} ms</dd></>}
        {diagnostic.primaryStage && <><dt>Estágio principal</dt><dd>{diagnostic.primaryStage}</dd></>}
        {diagnostic.primaryRequestStarted !== undefined && <><dt>Requisição iniciada</dt><dd>{diagnostic.primaryRequestStarted ? "sim" : "não"}</dd></>}
        {diagnostic.fallbackUsed !== undefined && <><dt>Fallback local</dt><dd>{diagnostic.fallbackUsed ? "sim" : "não"}</dd></>}
        {diagnostic.fallbackOutcome && <><dt>Status do fallback</dt><dd>{diagnostic.fallbackOutcome}</dd></>}
      </dl>
    </details>
  );
}

export function FeedbackPanel({ analysis, technicalError, isAnalyzing, rateLimitRemainingSeconds = 0 }: FeedbackPanelProps) {
  const [showLastValidAnalysis, setShowLastValidAnalysis] = React.useState(false);
  if (isAnalyzing) {
    return (
      <div className="feedback-loading" role="status">
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
          <RotateCcw size={29} />
        </motion.span>
        <h2 id="feedback-title">Analisando sua lógica...</h2>
        <p>Nossa IA está revisando seu código para preparar orientações pedagógicas.</p>
      </div>
    );
  }

  if (technicalError && technicalError.analysisStatus !== 'success') {
    const technicalCopy = getTechnicalCopy(technicalError.analysisStatus, rateLimitRemainingSeconds || technicalError.retryAfterSeconds);

    return (
      <div className="feedback-stack">
        <motion.article className="feedback-card feedback-card--technical" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <header>
            <span><AlertTriangle size={23} /></span>
            <div>
              <h2 id="feedback-title">{technicalCopy.title}</h2>
              <p>Falha técnica na análise automática</p>
            </div>
          </header>

          <div className="feedback-card__body" aria-live="polite">
            <section className="feedback-section feedback-section--focus">
              <p>{technicalCopy.message}</p>
              {technicalCopy.detail && <p>{technicalCopy.detail}</p>}
              {technicalError.analysisStatus === 'configuration_error' && import.meta.env.DEV && technicalError.modelUsed && (
                <p>Modelo configurado: {technicalError.modelUsed}</p>
              )}
            </section>
          </div>
        </motion.article>
        <DevelopmentAnalysisPanel />

        {analysis && analysis.analysisStatus === 'success' && (
          <div className="feedback-history-preview">
            <button type="button" onClick={() => setShowLastValidAnalysis((value) => !value)} aria-expanded={showLastValidAnalysis}>
              {showLastValidAnalysis ? 'Ocultar última análise válida' : 'Ver última análise válida'}
            </button>
            {showLastValidAnalysis && <PedagogicalFeedbackCard analysis={analysis} />}
          </div>
        )}
      </div>
    );
  }

  if (!analysis || analysis.analysisStatus !== 'success') {
    return null;
  }

  return <><PedagogicalFeedbackCard analysis={analysis} /><DevelopmentAnalysisPanel /></>;
}
