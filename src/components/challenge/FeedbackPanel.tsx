import * as React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Zap } from 'lucide-react';
import type { AnalysisResult } from '../../types';

interface FeedbackPanelProps { analysis: AnalysisResult | null; isAnalyzing?: boolean; }

export function FeedbackPanel({ analysis, isAnalyzing }: FeedbackPanelProps) {
  if (isAnalyzing) return <div className="feedback-loading" role="status"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}><RotateCcw size={29} /></motion.span><h2 id="feedback-title">Analisando sua lógica...</h2><p>Nossa IA está revisando seu código para preparar orientações pedagógicas.</p></div>;
  if (!analysis) return null;
  const hasGood = Boolean(analysis.feedback.good?.length);
  const hasReview = Boolean(analysis.feedback.review?.length);
  return <motion.article className="feedback-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <header><span><Sparkles size={23} /></span><div><h2 id="feedback-title">Orientação Pedagógica</h2><p>Análise da IA concluída</p></div><strong>{analysis.category || 'Em análise'}</strong></header>
    <div className="feedback-card__body">
      <div className="feedback-overview"><section><h3>O que a IA observou</h3><p>{analysis.analysisSummary || 'A IA analisou seu código e preparou orientações para ajudar no seu progresso.'}</p></section><section><h3><ArrowRight size={15} />Próximo passo sugerido</h3><p>{analysis.suggestedNextStep || 'Continue refinando sua lógica e revise os conceitos do desafio.'}</p></section></div>
      <div className="feedback-columns">
        <section className="feedback-list is-success"><h3><CheckCircle2 size={18} />Pontos positivos</h3>{hasGood ? analysis.feedback.good.map(item => <p key={item}>{item}</p>) : <p>Continue trabalhando para consolidar os pontos positivos da solução.</p>}</section>
        <section className="feedback-list is-warning"><h3><AlertCircle size={18} />O que você pode melhorar</h3>{hasReview ? analysis.feedback.review.map(item => <p key={item}>{item}</p>) : <p>Não foram identificados pontos críticos de revisão nesta tentativa.</p>}</section>
      </div>
      <section className="feedback-golden-tip"><h3><Zap size={18} />Hipótese de dificuldade</h3><p>{analysis.difficultyHypothesis || 'Reflita sobre como os dados fluem no seu programa.'}</p><span><ArrowRight size={15} />{analysis.feedback.nextStep || 'Tente corrigir o ponto principal antes de enviar novamente.'}</span></section>
    </div>
  </motion.article>;
}
