import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  CircleHelp,
  CornerDownLeft,
  Lightbulb,
  MoveVertical,
  RotateCcw,
  Send,
  Trash2,
  Undo2,
  XCircle
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism-tomorrow.css';
import { validateCodeOrderingSolution } from '../../domain/codeOrderingValidator';
import { useCodeOrderingProgress } from '../../hooks/useCodeOrderingProgress';
import type {
  BlockSemanticCategory,
  CodeOrderingBlock,
  CodeOrderingChallenge,
  OrderingValidationResult
} from '../../types/workshop';

interface CodeOrderingActivityPageProps {
  challenge: CodeOrderingChallenge;
  onBackToWorkshop: () => void;
}

type DragSource = 'available' | 'solution';

interface DragState {
  blockId: string;
  source: DragSource;
}

const CATEGORY_META: Record<BlockSemanticCategory, { label: string; color: string; border: string; bg: string }> = {
  structure: {
    label: 'Estrutura',
    color: '#3B82F6',
    border: 'border-blue-400/60',
    bg: 'bg-blue-400/10'
  },
  declaration: {
    label: 'Declaração',
    color: '#8B5CF6',
    border: 'border-violet-400/60',
    bg: 'bg-violet-400/10'
  },
  'input-output': {
    label: 'Entrada e saída',
    color: '#22D3EE',
    border: 'border-cyan-300/60',
    bg: 'bg-cyan-300/10'
  },
  'control-flow': {
    label: 'Decisão',
    color: '#F59E0B',
    border: 'border-amber-400/60',
    bg: 'bg-amber-400/10'
  },
  processing: {
    label: 'Processamento',
    color: '#EC4899',
    border: 'border-pink-400/60',
    bg: 'bg-pink-400/10'
  },
  termination: {
    label: 'Finalização',
    color: '#64748B',
    border: 'border-slate-400/60',
    bg: 'bg-slate-400/10'
  }
};

export function CodeOrderingActivityPage({ challenge, onBackToWorkshop }: CodeOrderingActivityPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const {
    solutionOrder,
    revealedHintCount,
    isCompleted,
    canUndo,
    canRedo,
    addBlock,
    removeBlock,
    moveBlock,
    insertPlacedBlock,
    clearSolution,
    resetActivity,
    undo,
    redo,
    revealNextHint,
    markCompleted
  } = useCodeOrderingProgress(challenge);

  const [selectedAvailableBlockId, setSelectedAvailableBlockId] = React.useState<string | null>(null);
  const [selectedPlacedBlockId, setSelectedPlacedBlockId] = React.useState<string | null>(null);
  const [dragState, setDragState] = React.useState<DragState | null>(null);
  const [validationResult, setValidationResult] = React.useState<OrderingValidationResult | null>(null);
  const [showHowItWorks, setShowHowItWorks] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState('');

  const blocksById = React.useMemo(() => {
    return new Map(challenge.blocks.map((block) => [block.id, block]));
  }, [challenge.blocks]);

  const availableBlockIds = React.useMemo(() => {
    return challenge.initialBlockOrder.filter((blockId) => !solutionOrder.includes(blockId));
  }, [challenge.initialBlockOrder, solutionOrder]);

  const relatedBlockIds = validationResult?.issue?.relatedBlockIds ?? [];
  const positionedCount = solutionOrder.length;
  const totalBlocks = challenge.blocks.length;
  const visibleHints = challenge.hints.slice(0, revealedHintCount);

  React.useEffect(() => {
    setValidationResult(null);
  }, [solutionOrder]);

  React.useEffect(() => {
    if (isCompleted) {
      setAnnouncement('Atividade concluída corretamente.');
    }
  }, [isCompleted]);

  const handleVerify = () => {
    const result = validateCodeOrderingSolution(challenge, solutionOrder);
    setValidationResult(result);

    if (result.isValid) {
      markCompleted();
      setAnnouncement('Solução correta. Atividade concluída.');
      return;
    }

    setAnnouncement(result.issue?.message ?? 'A solução ainda precisa de ajustes.');
  };

  const handleDropAt = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    const draggedBlockId = event.dataTransfer.getData('text/plain') || dragState?.blockId;
    if (!draggedBlockId) return;

    if (solutionOrder.includes(draggedBlockId)) {
      insertPlacedBlock(draggedBlockId, index);
    } else {
      addBlock(draggedBlockId, index);
    }

    setSelectedAvailableBlockId(null);
    setSelectedPlacedBlockId(draggedBlockId);
    setAnnouncement(`Bloco movido para a posição ${index + 1}.`);
    setDragState(null);
  };

  const handleAddSelectedAt = (index: number) => {
    if (!selectedAvailableBlockId) return;
    addBlock(selectedAvailableBlockId, index);
    setSelectedPlacedBlockId(selectedAvailableBlockId);
    setSelectedAvailableBlockId(null);
    setAnnouncement(`Bloco inserido na posição ${index + 1}.`);
  };

  const handleAddBlock = (blockId: string) => {
    addBlock(blockId);
    setSelectedPlacedBlockId(blockId);
    setSelectedAvailableBlockId(null);
    setAnnouncement('Bloco adicionado ao final da solução.');
  };

  const handleRemoveBlock = (blockId: string) => {
    removeBlock(blockId);
    setSelectedPlacedBlockId(null);
    setAnnouncement('Bloco devolvido para a lista de disponíveis.');
  };

  const handleMoveBlock = (blockId: string, direction: -1 | 1) => {
    const currentIndex = solutionOrder.indexOf(blockId);
    moveBlock(blockId, direction);

    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < solutionOrder.length) {
      setAnnouncement(`Bloco movido para a posição ${nextIndex + 1}.`);
    }
  };

  const handleAvailableKeyDown = (event: React.KeyboardEvent, blockId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAddBlock(blockId);
    }
  };

  const handlePlacedKeyDown = (event: React.KeyboardEvent, blockId: string) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      handleMoveBlock(blockId, -1);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      handleMoveBlock(blockId, 1);
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      handleRemoveBlock(blockId);
    }

    if (event.key === 'Escape') {
      setSelectedPlacedBlockId(null);
      setSelectedAvailableBlockId(null);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050b1b] text-white selection:bg-cyan-300/30">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050b1b]/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onBackToWorkshop}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black uppercase tracking-widest text-slate-100 transition-all hover:border-blue-300/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar à Oficina
            </button>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-200/70">Oficina Interativa de Código</p>
              <h1 className="text-2xl font-black tracking-tight text-white">Ordenação de Código</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHowItWorks((current) => !current)}
            aria-expanded={showHowItWorks}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-sm font-black uppercase tracking-widest text-blue-100 transition-all hover:bg-blue-300/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200 active:scale-[0.98]"
          >
            <CircleHelp className="h-4 w-4" aria-hidden="true" />
            Como funciona
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(420px,1.1fr)] xl:grid-cols-[minmax(280px,0.85fr)_minmax(420px,1.25fr)_minmax(320px,0.9fr)]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-widest text-blue-200/80">
              Atividade de prática · CCI04
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white">
              {challenge.title}
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-slate-300">
              {challenge.statement}
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
            <h3 className="text-lg font-black tracking-tight text-white">Entrada</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">{challenge.inputDescription}</p>
            <h3 className="mt-5 text-lg font-black tracking-tight text-white">Saída</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">{challenge.outputDescription}</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ExampleBox title="Exemplo de entrada" value={challenge.exampleInput} />
              <ExampleBox title="Exemplo de saída" value={challenge.exampleOutput} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
            <div className="grid gap-3 text-sm">
              <MetaRow label="Categoria" value={challenge.categoryLabel} />
              <MetaRow label="Competência" value={`${challenge.competencyId}. ${challenge.competencyLabel}`} />
              <MetaRow label="Dificuldade" value={`${challenge.difficulty} - Intermediário`} />
            </div>
          </section>

          <section className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-amber-200" aria-hidden="true" />
              <h3 className="text-lg font-black tracking-tight text-white">Dicas progressivas</h3>
            </div>
            <div className="mt-4 space-y-3">
              {visibleHints.map((hint, index) => (
                <p key={hint} className="rounded-2xl border border-amber-200/15 bg-slate-950/35 p-4 text-sm font-medium leading-relaxed text-amber-50">
                  <span className="font-black">Dica {index + 1}: </span>
                  {hint}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={revealNextHint}
              disabled={revealedHintCount >= challenge.hints.length}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-300/15 px-4 py-2 text-sm font-black uppercase tracking-widest text-amber-50 transition-all hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Solicitar próxima dica
            </button>
          </section>
        </aside>

        <section className="min-w-0 space-y-5">
          <AnimatePresence>
            {showHowItWorks && (
              <motion.section
                initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                className="rounded-3xl border border-blue-300/20 bg-blue-300/10 p-5"
              >
                <h2 className="text-xl font-black tracking-tight text-white">Como funciona</h2>
                <p className="mt-3 text-base font-medium leading-relaxed text-blue-50">
                  Arraste blocos para a solução ou selecione um bloco disponível e escolha uma posição. Na solução, use os botões de mover, devolver, desfazer e refazer. Pelo teclado, Enter ou Espaço adiciona um bloco disponível; nas peças posicionadas, as setas movem e Delete devolve.
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          <section
            aria-labelledby="solution-title"
            aria-describedby="solution-status"
            className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-200/70">Sua solução</p>
                <h2 id="solution-title" className="mt-1 text-3xl font-black tracking-tight text-white">
                  Organize o programa
                </h2>
                <p className="mt-2 text-base font-medium text-slate-300">
                  Organize os blocos para construir o programa.
                </p>
              </div>
              <p id="solution-status" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-black uppercase tracking-widest text-slate-200">
                {positionedCount} de {totalBlocks} blocos posicionados
              </p>
            </div>

            <div className="sr-only" aria-live="polite">
              {announcement}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <ToolbarButton onClick={undo} disabled={!canUndo} label="Desfazer" icon={<Undo2 className="h-4 w-4" />} />
              <ToolbarButton onClick={redo} disabled={!canRedo} label="Refazer" icon={<RotateCcw className="h-4 w-4" />} />
              <ToolbarButton onClick={clearSolution} disabled={solutionOrder.length === 0} label="Limpar tudo" icon={<Trash2 className="h-4 w-4" />} />
              <ToolbarButton onClick={resetActivity} label="Reiniciar" icon={<CornerDownLeft className="h-4 w-4" />} />
            </div>

            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-slate-950/55 p-4">
              <InsertionDropZone
                index={0}
                selectedAvailableBlockId={selectedAvailableBlockId}
                onDropAt={handleDropAt}
                onInsertSelected={handleAddSelectedAt}
              />

              <div className="space-y-3">
                {solutionOrder.map((blockId, index) => {
                  const block = blocksById.get(blockId);
                  if (!block) return null;

                  return (
                    <React.Fragment key={block.id}>
                      <CodeBlockCard
                        block={block}
                        stateLabel={`Posição ${index + 1}`}
                        isPlaced
                        isSelected={selectedPlacedBlockId === block.id}
                        isRelatedToIssue={relatedBlockIds.includes(block.id)}
                        isSuccess={isCompleted}
                        onSelect={() => {
                          setSelectedPlacedBlockId(block.id);
                          setSelectedAvailableBlockId(null);
                        }}
                        onKeyDown={(event) => handlePlacedKeyDown(event, block.id)}
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', block.id);
                          setDragState({ blockId: block.id, source: 'solution' });
                        }}
                        onDragEnd={() => setDragState(null)}
                        controls={(
                          <div className="flex flex-wrap gap-2">
                            <IconButton
                              label="Mover bloco para cima"
                              onClick={() => handleMoveBlock(block.id, -1)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              label="Mover bloco para baixo"
                              onClick={() => handleMoveBlock(block.id, 1)}
                              disabled={index === solutionOrder.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </IconButton>
                            <IconButton label="Devolver bloco para disponíveis" onClick={() => handleRemoveBlock(block.id)}>
                              <CornerDownLeft className="h-4 w-4" />
                            </IconButton>
                          </div>
                        )}
                      />
                      <InsertionDropZone
                        index={index + 1}
                        selectedAvailableBlockId={selectedAvailableBlockId}
                        onDropAt={handleDropAt}
                        onInsertSelected={handleAddSelectedAt}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              {solutionOrder.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-slate-400">
                  Arraste blocos para cá ou selecione um bloco disponível e escolha uma posição.
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleVerify}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200 active:scale-[0.98]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Verificar solução
              </button>

              {selectedAvailableBlockId && (
                <p className="text-sm font-bold text-blue-100">
                  Bloco selecionado. Escolha uma posição na área de montagem.
                </p>
              )}
            </div>

            <FeedbackPanel
              validationResult={validationResult}
              isCompleted={isCompleted}
              successFeedback={challenge.successFeedback}
            />
          </section>
        </section>

        <aside className="min-w-0 space-y-5 lg:col-span-2 xl:col-span-1">
          <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/25 xl:sticky xl:top-24">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Ordem inicial embaralhada</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Blocos disponíveis</h2>
              </div>
              <MoveVertical className="h-5 w-5 text-blue-200" aria-hidden="true" />
            </div>

            <div className="mt-5 space-y-2.5">
              {availableBlockIds.map((blockId) => {
                const block = blocksById.get(blockId);
                if (!block) return null;

                return (
                  <CodeBlockCard
                    key={block.id}
                    block={block}
                    stateLabel="Disponível"
                    isSelected={selectedAvailableBlockId === block.id}
                    isRelatedToIssue={relatedBlockIds.includes(block.id)}
                    onSelect={() => {
                      setSelectedAvailableBlockId(block.id);
                      setSelectedPlacedBlockId(null);
                    }}
                    onKeyDown={(event) => handleAvailableKeyDown(event, block.id)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', block.id);
                      setDragState({ blockId: block.id, source: 'available' });
                    }}
                    onDragEnd={() => setDragState(null)}
                    controls={(
                      <button
                        type="button"
                        onClick={() => handleAddBlock(block.id)}
                        className="inline-flex min-h-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-100 transition-all hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200"
                      >
                        Adicionar
                      </button>
                    )}
                  />
                );
              })}

              {availableBlockIds.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 text-center text-sm font-bold text-slate-300">
                  Todos os blocos foram posicionados.
                </p>
              )}
            </div>

            <CategoryLegend />
          </section>
        </aside>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/70 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-sm font-bold text-slate-300">{challenge.id}</p>
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">
              Progresso: {positionedCount}/{totalBlocks} blocos · {isCompleted ? 'Concluída' : 'Em andamento'}
            </p>
          </div>
          <button
            type="button"
            disabled={!isCompleted}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-widest text-slate-100 transition-all enabled:hover:border-blue-200/40 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima atividade
            {isCompleted ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <XCircle className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </footer>
    </div>
  );
}

function ExampleBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-base font-semibold text-cyan-100">{value}</pre>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold leading-relaxed text-slate-200">{value}</p>
    </div>
  );
}

function ToolbarButton({
  label,
  icon,
  disabled = false,
  onClick
}: {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-100 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {icon}
      {label}
    </button>
  );
}

function IconButton({
  label,
  disabled = false,
  onClick,
  children
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200"
    >
      {children}
    </button>
  );
}

function InsertionDropZone({
  index,
  selectedAvailableBlockId,
  onDropAt,
  onInsertSelected
}: {
  index: number;
  selectedAvailableBlockId: string | null;
  onDropAt: (event: React.DragEvent, index: number) => void;
  onInsertSelected: (index: number) => void;
}) {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDropAt(event, index)}
      className="my-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-2 text-center transition-colors hover:border-blue-300/40 hover:bg-blue-300/10"
    >
      <button
        type="button"
        onClick={() => onInsertSelected(index)}
        disabled={!selectedAvailableBlockId}
        className="min-h-10 w-full rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors enabled:text-blue-100 enabled:hover:bg-blue-300/10 disabled:cursor-not-allowed"
      >
        Posição {index + 1} {selectedAvailableBlockId ? '· inserir selecionado' : ''}
      </button>
    </div>
  );
}

function CodeBlockCard({
  block,
  stateLabel,
  isPlaced = false,
  isSelected,
  isRelatedToIssue,
  isSuccess = false,
  controls,
  onSelect,
  onKeyDown,
  onDragStart,
  onDragEnd
}: {
  block: CodeOrderingBlock;
  stateLabel: string;
  isPlaced?: boolean;
  isSelected: boolean;
  isRelatedToIssue: boolean;
  isSuccess?: boolean;
  controls: React.ReactNode;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onDragStart: (event: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const category = CATEGORY_META[block.category];

  return (
    <article
      tabIndex={0}
      draggable
      onClick={onSelect}
      onFocus={onSelect}
      onKeyDown={onKeyDown}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      aria-label={`${stateLabel}. Bloco ${CATEGORY_META[block.category].label}. ${block.explanation}`}
      aria-selected={isSelected}
      className={`
        group relative overflow-hidden rounded-2xl border bg-slate-950/85 p-3 shadow-xl shadow-black/25 transition-all
        ${category.border}
        ${isSelected ? 'ring-2 ring-blue-200/70' : ''}
        ${isRelatedToIssue ? 'border-red-400 ring-2 ring-red-300/60' : ''}
        ${isSuccess && isPlaced ? 'border-emerald-300 ring-2 ring-emerald-300/40' : ''}
        focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200
      `}
    >
      <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: category.color }} />
      <div className="absolute left-1 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950" aria-hidden="true" />
      <div className="pl-2">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${category.border} ${category.bg} text-slate-100`}>
              {category.label}
            </span>
            {isRelatedToIssue && (
              <span className="rounded-full border border-red-300/40 bg-red-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-red-100">
                Revisar relação
              </span>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            {controls}
          </div>
        </div>
        <CodePreview code={block.code} />
      </div>
    </article>
  );
}

function CodePreview({ code }: { code: string }) {
  const highlightedCode = React.useMemo(() => {
    return Prism.highlight(code, Prism.languages.c, 'c');
  }, [code]);

  return (
    <pre className="custom-scrollbar overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-[#1f2430] p-2.5 font-mono text-[13px] leading-snug text-slate-100 sm:text-[13px]">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}

function FeedbackPanel({
  validationResult,
  isCompleted,
  successFeedback
}: {
  validationResult: OrderingValidationResult | null;
  isCompleted: boolean;
  successFeedback: string;
}) {
  if (!validationResult && !isCompleted) return null;

  if (isCompleted || validationResult?.isValid) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-5 rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-5 text-emerald-50"
      >
        <div className="flex gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-200" aria-hidden="true" />
          <p className="text-base font-semibold leading-relaxed">{successFeedback}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-5 rounded-3xl border border-red-300/30 bg-red-500/10 p-5 text-red-50"
    >
      <div className="flex gap-3">
        <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-200" aria-hidden="true" />
        <p className="text-base font-semibold leading-relaxed">{validationResult?.issue?.message}</p>
      </div>
    </div>
  );
}

function CategoryLegend() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Legenda das categorias</h3>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {(Object.keys(CATEGORY_META) as BlockSemanticCategory[]).map((categoryId) => {
          const category = CATEGORY_META[categoryId];
          return (
            <div key={categoryId} className="flex items-center gap-2 text-sm font-bold text-slate-300">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} aria-hidden="true" />
              {category.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
