import { describe, expect, it, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { CHALLENGES } from '../../challenges';
import { TRAILS } from '../../components/home/homeData';
import { HomePage } from '../../components/home/HomePage';
import { SolutionPanel } from '../../components/challenge/SolutionPanel';
import type { Challenge } from '../../types';

const cci01Challenges = CHALLENGES.filter(challenge => challenge.categoryId === 'representacao');

function runCExample(challenge: Challenge, input: string) {
  const dir = mkdtempSync(join(tmpdir(), 'cci01-c-'));
  const cFile = join(dir, `${challenge.id}.c`);
  const outFile = join(dir, challenge.id);
  writeFileSync(cFile, challenge.solution);

  const compile = spawnSync('gcc', ['-std=c99', cFile, '-o', outFile], { encoding: 'utf8' });
  expect(compile.status, compile.stderr).toBe(0);

  const run = spawnSync(outFile, { input, encoding: 'utf8' });
  expect(run.status, run.stderr).toBe(0);
  return run.stdout.trim();
}

describe('Trilha CCI01', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('exibe o card CCI01 antes das competências seguintes e lista dois desafios', () => {
    const cci01Trail = TRAILS[0];

    expect(cci01Trail.competency).toBe('CCI01');
    expect(cci01Trail.title).toBe('Representação de problemas');
    expect(cci01Trail.officialDescription).toBe('CCI01. Representar problemas introdutórios por meio de soluções algorítmicas claras');
    expect(cci01Trail.concepts).toEqual([
      'Interpretação',
      'Entrada, processamento e saída',
      'Decomposição',
      'Sequência lógica',
      'Representação algorítmica'
    ]);
    expect(TRAILS.map(trail => trail.competency)).toEqual(['CCI01', 'CCI04', 'CCI05', 'CCI06', 'CCI06', 'CCI07']);
    expect(cci01Challenges).toHaveLength(2);
  });

  it('permite acessar a categoria CCI01 e visualizar os dois desafios', () => {
    const onSelectCategory = vi.fn();

    const { rerender } = render(
      <HomePage
        user={null}
        selectedCategoryId={null}
        onSelectCategory={onSelectCategory}
        onSelectChallenge={vi.fn()}
        onOpenWorkshop={vi.fn()}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.getByText('CCI01')).toBeInTheDocument();
    expect(screen.getByText('Representação de problemas')).toBeInTheDocument();
    expect(screen.getByText('2 desafios')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Iniciar trilha: Representação de problemas/i }));
    expect(onSelectCategory).toHaveBeenCalledWith('representacao');

    rerender(
      <HomePage
        user={null}
        selectedCategoryId="representacao"
        onSelectCategory={onSelectCategory}
        onSelectChallenge={vi.fn()}
        onOpenWorkshop={vi.fn()}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Desafios da trilha' })).toBeInTheDocument();
    expect(screen.getByText('Planejando o custo de uma viagem')).toBeInTheDocument();
    expect(screen.getByText('Organizando os materiais para uma oficina')).toBeInTheDocument();
  });

  it('mantém metadados completos e IDs únicos nos desafios CCI01', () => {
    const ids = cci01Challenges.map(challenge => challenge.id);

    expect(ids).toEqual(['cci01-custo-viagem', 'cci01-materiais-oficina']);
    expect(new Set(ids).size).toBe(ids.length);

    cci01Challenges.forEach(challenge => {
      expect(challenge.categoryId).toBe('representacao');
      expect(challenge.metadata.content).toContain('CCI01');
      expect(challenge.pedagogicalMetadata.learningObjective).toBeTruthy();
      expect(challenge.expectedCriteria.length).toBeGreaterThanOrEqual(6);
      expect(challenge.tips).toHaveLength(4);
      expect(challenge.commonErrors.length).toBeGreaterThanOrEqual(4);
      expect(challenge.examples.length).toBeGreaterThanOrEqual(3);
      expect(challenge.solution).toContain('int main');
      expect(challenge.problemRepresentation).toBeDefined();
    });
  });

  it('executa os exemplos do problema da viagem', () => {
    const challenge = CHALLENGES.find(item => item.id === 'cci01-custo-viagem')!;

    expect(runCExample(challenge, '600\n12\n6.00\n')).toBe('Litros necessários: 50.00\nCusto total: 300.00');
    expect(runCExample(challenge, '350\n10\n5.50\n')).toBe('Litros necessários: 35.00\nCusto total: 192.50');
    expect(runCExample(challenge, '500\n0\n6.00\n')).toBe('Consumo inválido');
  });

  it('executa os exemplos do problema da oficina', () => {
    const challenge = CHALLENGES.find(item => item.id === 'cci01-materiais-oficina')!;

    expect(runCExample(challenge, '10\n')).toBe('Folhas: 20\nLápis: 10\nBorrachas: 10\nTotal de materiais: 40');
    expect(runCExample(challenge, '25\n')).toBe('Folhas: 50\nLápis: 25\nBorrachas: 25\nTotal de materiais: 100');
    expect(runCExample(challenge, '0\n')).toBe('Quantidade inválida');
  });

  it('permite classificar a solução como adequada mesmo sem representação preenchida', () => {
    const challenge = CHALLENGES.find(item => item.id === 'cci01-custo-viagem')!;
    const result = challenge.analyzeLocally(challenge.solution, { inputs: '', processing: '', outputs: '', steps: '' });

    expect(result.category).toBe('solução adequada');
    expect(result.feedback.review.join(' ')).not.toContain('representação');
  });

  it('mantém a solução de referência protegida no DOM enquanto bloqueada', () => {
    const challenge = CHALLENGES.find(item => item.id === 'cci01-custo-viagem')!;

    render(
      <SolutionPanel
        challenge={challenge}
        isExpanded
        isUnlocked={false}
        guidanceMessage="Para liberar a solução, abra todas as dicas e solicite mais 2 análises da sua tentativa."
        openedTipsCount={0}
        totalTips={challenge.tips.length}
        displayedAnalysisRequestCount={0}
        onOpen={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Solução bloqueada/i })).toBeDisabled();
    expect(screen.queryByText(challenge.solution)).not.toBeInTheDocument();
  });
});
