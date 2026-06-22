import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpDown,
  Bug,
  Check,
  Code2,
  GripVertical,
  MessageSquareCode,
  Puzzle,
  Search,
  TableProperties,
  TextCursorInput,
  Wrench
} from 'lucide-react';
import type { ChallengeFormat } from '../../types/workshop';

interface ChallengeFormatCardProps {
  format: ChallengeFormat;
  isSelected: boolean;
  onAction: (format: ChallengeFormat) => void;
}

export function ChallengeFormatCard({ format, isSelected, onAction }: ChallengeFormatCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = format.icon;

  return (
    <motion.article
      layout={!shouldReduceMotion}
      whileHover={shouldReduceMotion ? undefined : { y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-3xl border ${format.theme.border} bg-slate-950/75 p-5 shadow-2xl ${format.theme.glow} backdrop-blur`}
      aria-labelledby={`format-${format.id}-title`}
    >
      <div className={`absolute inset-x-0 top-0 h-24 ${format.theme.surface} blur-2xl opacity-75`} />
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${format.theme.iconWrap}`}>
            <Icon className={`h-5 w-5 ${format.theme.icon}`} aria-hidden="true" />
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${format.theme.iconWrap} ${format.theme.mutedText}`}>
            {format.status === 'available' ? 'Disponível' : 'Área de testes'}
          </span>
        </div>

        <FormatVisual format={format} />

        <div className="mt-6 flex flex-1 flex-col">
          <h2 id={`format-${format.id}-title`} className="text-xl font-black leading-tight tracking-tight text-white">
            {format.title}
          </h2>
          <p className="mt-3 flex-1 text-base font-medium leading-relaxed text-slate-300">
            {format.shortDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAction(format)}
          aria-label={`${format.actionLabel}: ${format.title}`}
          aria-current={isSelected ? 'page' : undefined}
          className={`mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-widest transition-all ${format.theme.button} ${format.theme.focus} focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-[0.98]`}
        >
          {format.actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}

function FormatVisual({ format }: { format: ChallengeFormat }) {
  switch (format.visual) {
    case 'guided-code':
      return <GuidedCodeVisual format={format} />;
    case 'ordered-blocks':
      return <OrderedBlocksVisual format={format} />;
    case 'completion-blanks':
      return <CompletionBlanksVisual format={format} />;
    case 'variable-table':
      return <VariableTableVisual format={format} />;
    case 'debug-lines':
      return <DebugLinesVisual format={format} />;
    default:
      return null;
  }
}

function WindowShell({
  format,
  children
}: {
  format: ChallengeFormat;
  children: React.ReactNode;
}) {
  return (
    <div className={`h-40 rounded-2xl border ${format.theme.border} bg-slate-950/80 p-3 shadow-inner shadow-black/40`}>
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
      </div>
      {children}
    </div>
  );
}

function CodeLine({
  format,
  width = 'w-full',
  soft = false
}: {
  format: ChallengeFormat;
  width?: string;
  soft?: boolean;
}) {
  return <span className={`block h-2 rounded-full ${width} ${soft ? format.theme.softLine : format.theme.line}`} />;
}

function GuidedCodeVisual({ format }: { format: ChallengeFormat }) {
  return (
    <WindowShell format={format}>
      <div className="space-y-3">
        <CodeLine format={format} width="w-2/3" />
        <CodeLine format={format} width="w-5/6" soft />
        <CodeLine format={format} width="w-1/2" soft />
      </div>
      <div className={`mt-5 flex items-center gap-2 rounded-xl border ${format.theme.border} ${format.theme.surface} px-3 py-2`}>
        <MessageSquareCode className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
        <div className="flex-1 space-y-1.5">
          <CodeLine format={format} width="w-3/4" />
          <CodeLine format={format} width="w-1/2" soft />
        </div>
        <Check className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
      </div>
    </WindowShell>
  );
}

function OrderedBlocksVisual({ format }: { format: ChallengeFormat }) {
  return (
    <div className={`h-40 rounded-2xl border ${format.theme.border} bg-slate-950/80 p-3 shadow-inner shadow-black/40`}>
      <div className="space-y-2.5">
        {[2, 1, 3].map((order, index) => (
          <div
            key={order}
            className={`flex items-center gap-3 rounded-xl border ${format.theme.border} ${index === 1 ? format.theme.surface : 'bg-white/5'} px-3 py-2`}
          >
            <GripVertical className={`h-4 w-4 ${format.theme.mutedText}`} aria-hidden="true" />
            <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black ${format.theme.surface} ${format.theme.text}`}>
              {order}
            </span>
            <CodeLine format={format} width={index === 2 ? 'w-1/2' : 'w-2/3'} soft={index !== 1} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center">
        <ArrowUpDown className={`h-5 w-5 ${format.theme.icon}`} aria-hidden="true" />
      </div>
    </div>
  );
}

function CompletionBlanksVisual({ format }: { format: ChallengeFormat }) {
  return (
    <WindowShell format={format}>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Code2 className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
          <CodeLine format={format} width="w-2/3" soft />
        </div>
        <div className={`flex items-center gap-2 rounded-xl border border-dashed ${format.theme.border} ${format.theme.surface} px-3 py-2`}>
          <TextCursorInput className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
          <span className={`h-2 w-16 rounded-full ${format.theme.line}`} />
          <span className="h-2 w-10 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center gap-3">
          <Puzzle className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
          <CodeLine format={format} width="w-1/2" soft />
        </div>
      </div>
    </WindowShell>
  );
}

function VariableTableVisual({ format }: { format: ChallengeFormat }) {
  const rows = [
    ['1', '0', '0'],
    ['2', '1', '3'],
    ['3', '2', '6']
  ];

  return (
    <div className={`h-40 rounded-2xl border ${format.theme.border} bg-slate-950/80 p-3 shadow-inner shadow-black/40`}>
      <div className="mb-3 flex items-center gap-2">
        <TableProperties className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
        <CodeLine format={format} width="w-2/3" />
      </div>
      <div className={`overflow-hidden rounded-xl border ${format.theme.border}`}>
        <div className={`grid grid-cols-3 ${format.theme.surface} text-center text-xs font-black uppercase tracking-wider ${format.theme.text}`}>
          <span className="border-r border-white/10 py-2">passo</span>
          <span className="border-r border-white/10 py-2">i</span>
          <span className="py-2">soma</span>
        </div>
        {rows.map((row) => (
          <div key={row.join('-')} className="grid grid-cols-3 border-t border-white/10 text-center text-sm font-bold text-slate-300">
            {row.map((value, columnIndex) => (
              <span key={`${value}-${columnIndex}`} className="border-r border-white/10 py-1.5 last:border-r-0">
                {value}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DebugLinesVisual({ format }: { format: ChallengeFormat }) {
  return (
    <WindowShell format={format}>
      <div className="space-y-3">
        <CodeLine format={format} width="w-3/4" soft />
        <div className={`flex items-center gap-2 rounded-xl border ${format.theme.border} ${format.theme.surface} px-3 py-2`}>
          <Bug className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
          <CodeLine format={format} width="w-1/2" />
          <Search className={`ml-auto h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          <Wrench className={`h-4 w-4 ${format.theme.icon}`} aria-hidden="true" />
          <CodeLine format={format} width="w-2/3" soft />
        </div>
      </div>
    </WindowShell>
  );
}
