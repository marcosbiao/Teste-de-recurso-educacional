import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Challenge, SolutionUnlockProgress, Tip } from '../../types';
import { SolutionPanel } from '../../components/challenge/SolutionPanel';
import {
  addOpenedTip,
  canCountAiAnalysisRequest,
  createInitialSolutionProgress,
  getSolutionUnlockState,
  incrementAnalysisRequestCount
} from '../../domain/solutionUnlock';

function makeChallenge(tips: Tip[] = [
  { id: 1, text: 'Dica 1' },
  { id: 2, text: 'Dica 2' }
]): Pick<Challenge, 'id' | 'tips' | 'orientation' | 'solution'> {
  return {
    id: 'desafio-a',
    tips,
    orientation: {
      input: '',
      output: '',
      cases: '',
      structure: '',
      expectedLogic: 'Lógica esperada confidencial'
    },
    solution: 'int main() { return 0; }'
  };
}

function makeProgress(openedTipIds: number[], aiAnalysisRequestCount: number): SolutionUnlockProgress {
  return {
    userId: 'anonymous',
    challengeId: 'desafio-a',
    challengeVersion: '1.0.0',
    openedTipIds,
    aiAnalysisRequestCount,
    solutionUnlocked: false,
    solutionOpenedAt: null
  };
}

describe('Liberação progressiva da solução de referência', () => {
  it('cenário 1: 0 dicas abertas e 0 análises mantém a solução bloqueada', () => {
    const state = getSolutionUnlockState(makeChallenge(), makeProgress([], 0));

    expect(state.canOpenSolution).toBe(false);
    expect(state.guidanceMessage).toBe('Para liberar a solução, abra todas as dicas e solicite mais 2 análises da sua tentativa.');
  });

  it('cenário 2: todas as dicas abertas e 0 análises mantém a solução bloqueada', () => {
    const state = getSolutionUnlockState(makeChallenge(), makeProgress([1, 2], 0));

    expect(state.allTipsOpened).toBe(true);
    expect(state.canOpenSolution).toBe(false);
    expect(state.guidanceMessage).toBe('Todas as dicas foram consultadas. Solicite 2 análises da sua tentativa para liberar a solução.');
  });

  it('cenário 3: todas as dicas abertas e 1 análise mantém a solução bloqueada', () => {
    const state = getSolutionUnlockState(makeChallenge(), makeProgress([1, 2], 1));

    expect(state.canOpenSolution).toBe(false);
    expect(state.guidanceMessage).toBe('Todas as dicas foram consultadas. Solicite mais 1 análise da sua tentativa para liberar a solução.');
  });

  it('cenário 4: parte das dicas aberta e 2 análises mantém a solução bloqueada', () => {
    const state = getSolutionUnlockState(makeChallenge(), makeProgress([1], 2));

    expect(state.allTipsOpened).toBe(false);
    expect(state.canOpenSolution).toBe(false);
    expect(state.guidanceMessage).toBe('As análises necessárias foram realizadas. Abra as dicas restantes para liberar a solução.');
  });

  it('cenário 5: todas as dicas abertas e 2 análises libera a solução', () => {
    const state = getSolutionUnlockState(makeChallenge(), makeProgress([1, 2], 2));

    expect(state.canOpenSolution).toBe(true);
    expect(state.guidanceMessage).toBe('Percurso de apoio concluído. A solução de referência está disponível.');
  });

  it('cenário 6: todas as dicas abertas e mais de 2 análises mantém a solução liberada sem inflar o contador visual', () => {
    const state = getSolutionUnlockState(makeChallenge(), makeProgress([1, 2], 5));

    expect(state.canOpenSolution).toBe(true);
    expect(state.aiAnalysisRequestCount).toBe(5);
    expect(state.displayedAnalysisRequestCount).toBe(2);
  });

  it('cenário 7: abrir a mesma dica várias vezes contabiliza apenas uma dica', () => {
    const initial = createInitialSolutionProgress('anonymous', 'desafio-a', '1.0.0');
    const progress = addOpenedTip(addOpenedTip(initial, 1), 1);
    const state = getSolutionUnlockState(makeChallenge(), progress);

    expect(progress.openedTipIds).toEqual([1]);
    expect(state.openedTipsCount).toBe(1);
    expect(state.canOpenSolution).toBe(false);
  });

  it('cenário 8: clique duplicado durante análise em andamento não deve contar nova solicitação', () => {
    expect(canCountAiAnalysisRequest({
      code: 'int main() { return 0; }',
      isAnalyzing: true,
      isInCooldown: false
    })).toBe(false);
  });

  it('cenário 9: envio inválido ou código vazio não deve contar solicitação', () => {
    expect(canCountAiAnalysisRequest({
      code: '',
      isAnalyzing: false,
      isInCooldown: false
    })).toBe(false);

    expect(canCountAiAnalysisRequest({
      code: 'int x;',
      isAnalyzing: false,
      isInCooldown: false
    })).toBe(false);
  });

  it('cenário 10: desafio sem dicas e 2 análises libera a solução', () => {
    const state = getSolutionUnlockState(makeChallenge([]), makeProgress([], 2));

    expect(state.allTipsOpened).toBe(true);
    expect(state.canOpenSolution).toBe(true);
  });

  it('incrementa apenas envios válidos iniciados para análise', () => {
    const initial = createInitialSolutionProgress('anonymous', 'desafio-a', '1.0.0');
    const progress = incrementAnalysisRequestCount(initial);

    expect(progress.aiAnalysisRequestCount).toBe(1);
  });

  it('cenário 13: não renderiza a solução se a abertura for forçada sem requisitos', () => {
    render(
      <SolutionPanel
        challenge={makeChallenge() as Challenge}
        isExpanded
        isUnlocked={false}
        guidanceMessage="Para liberar a solução, abra todas as dicas e solicite mais 2 análises da sua tentativa."
        openedTipsCount={0}
        totalTips={2}
        displayedAnalysisRequestCount={0}
        onOpen={() => undefined}
        onClose={() => undefined}
      />
    );

    expect(screen.getByRole('button', { name: /Solução bloqueada/i })).toBeDisabled();
    expect(screen.queryByText('int main() { return 0; }')).not.toBeInTheDocument();
    expect(screen.queryByText('Lógica esperada confidencial')).not.toBeInTheDocument();
  });
});
