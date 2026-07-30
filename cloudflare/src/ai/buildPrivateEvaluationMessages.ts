import type { InternalChallenge } from '../catalog/challengeAnalysisCatalog';
import type { ChallengeEvaluation } from '../evaluation/types';
import type { WorkerAnalyzeRequest } from '../validation/validateRequest';
import { GUIDED_ANALYSIS_SYSTEM_PROMPT } from './prompts/guidedAnalysisPrompt';

export function buildPrivateEvaluationMessages(challenge: InternalChallenge, request: WorkerAnalyzeRequest, evaluation: ChallengeEvaluation) {
  const rubric = evaluation.rubric.map(({ id, criterion, essential, guidance }) => ({ criterionId: id, criterion, essential, guidance }));
  const user = `/no_think

<ENUNCIADO_CONFIAVEL>\n${challenge.statement}\n</ENUNCIADO_CONFIAVEL>
<OBJETIVO_CONFIAVEL>\n${challenge.objective}\n</OBJETIVO_CONFIAVEL>
<CONCEITOS_CONFIAVEIS>\n${JSON.stringify(challenge.requiredConcepts)}\n</CONCEITOS_CONFIAVEIS>
<RUBRICA_PRIVADA_CONFIAVEL>\n${JSON.stringify(rubric)}\n</RUBRICA_PRIVADA_CONFIAVEL>
<ESTRATEGIAS_DE_REFERENCIA_PRIVADAS>\n${JSON.stringify(evaluation.referenceStrategies || [])}\n</ESTRATEGIAS_DE_REFERENCIA_PRIVADAS>
<ERROS_COMUNS_PRIVADOS>\n${JSON.stringify(evaluation.commonErrors || [])}\n</ERROS_COMUNS_PRIVADOS>
<TENTATIVA_NAO_CONFIAVEL>\n${request.studentCode}\n</TENTATIVA_NAO_CONFIAVEL>
<CONTEXTO_ANTERIOR_NAO_CONFIAVEL>\n${JSON.stringify(request.previousAttemptContext || {})}\n</CONTEXTO_ANTERIOR_NAO_CONFIAVEL>`;
  return [{ role: "system" as const, content: GUIDED_ANALYSIS_SYSTEM_PROMPT }, { role: "user" as const, content: user }];
}
