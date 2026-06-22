import {
  Bug,
  Code2,
  ListOrdered,
  Puzzle,
  SearchCode
} from 'lucide-react';
import type {
  ChallengeFormat,
  ChallengeFormatId,
  WorkshopActivity,
  WorkshopCategoryOption,
  WorkshopSortOption
} from '../types/workshop';
import { CODE_ORDERING_ACTIVITIES } from './codeOrderingChallenges';

export const CHALLENGE_FORMATS: ChallengeFormat[] = [
  {
    id: 'guided',
    title: 'Desafio Guiado',
    shortDescription:
      'O estudante escreve o código, recebe uma análise da IA e é orientado sobre o que precisa revisar ou fazer em seguida.',
    longDescription:
      'O estudante escreve o código, recebe uma análise da IA e é orientado sobre o que precisa revisar ou fazer em seguida.',
    accentColor: '#8B5CF6',
    darkColor: '#2E1065',
    status: 'available',
    actionLabel: 'Acessar desafios',
    icon: Code2,
    visual: 'guided-code',
    theme: {
      border: 'border-violet-400/50',
      surface: 'bg-violet-500/10',
      glow: 'shadow-violet-500/20',
      iconWrap: 'bg-violet-400/15 border-violet-300/25',
      icon: 'text-violet-200',
      text: 'text-violet-100',
      mutedText: 'text-violet-200/70',
      line: 'bg-violet-300',
      softLine: 'bg-violet-300/25',
      button: 'bg-violet-500 text-white hover:bg-violet-400 active:bg-violet-600',
      focus: 'focus-visible:outline-violet-300'
    }
  },
  {
    id: 'code-ordering',
    title: 'Ordenação de Código',
    shortDescription:
      'O estudante organiza linhas ou blocos embaralhados para construir uma solução funcional.',
    longDescription:
      'O estudante organiza linhas ou blocos embaralhados para construir uma solução funcional.',
    accentColor: '#2589FF',
    darkColor: '#0F2B5F',
    status: 'available',
    actionLabel: 'Explorar formato',
    icon: ListOrdered,
    visual: 'ordered-blocks',
    theme: {
      border: 'border-blue-400/50',
      surface: 'bg-blue-500/10',
      glow: 'shadow-blue-500/20',
      iconWrap: 'bg-blue-400/15 border-blue-300/25',
      icon: 'text-blue-200',
      text: 'text-blue-100',
      mutedText: 'text-blue-200/70',
      line: 'bg-blue-300',
      softLine: 'bg-blue-300/25',
      button: 'bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600',
      focus: 'focus-visible:outline-blue-300'
    }
  },
  {
    id: 'code-completion',
    title: 'Completar Código',
    shortDescription:
      'O estudante recebe uma solução parcialmente construída e preenche os trechos ausentes.',
    longDescription:
      'O estudante recebe uma solução parcialmente construída e preenche os trechos ausentes.',
    accentColor: '#22C55E',
    darkColor: '#064E3B',
    status: 'testing',
    actionLabel: 'Explorar formato',
    icon: Puzzle,
    visual: 'completion-blanks',
    theme: {
      border: 'border-emerald-400/50',
      surface: 'bg-emerald-500/10',
      glow: 'shadow-emerald-500/20',
      iconWrap: 'bg-emerald-400/15 border-emerald-300/25',
      icon: 'text-emerald-200',
      text: 'text-emerald-100',
      mutedText: 'text-emerald-200/70',
      line: 'bg-emerald-300',
      softLine: 'bg-emerald-300/25',
      button: 'bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600',
      focus: 'focus-visible:outline-emerald-300'
    }
  },
  {
    id: 'variable-tracing',
    title: 'Rastreamento de Variável',
    shortDescription:
      'O estudante acompanha a evolução do estado do programa e indica os valores assumidos pelas variáveis passo a passo.',
    longDescription:
      'O estudante acompanha a evolução do estado do programa e indica os valores assumidos pelas variáveis passo a passo.',
    accentColor: '#F59E0B',
    darkColor: '#78350F',
    status: 'testing',
    actionLabel: 'Explorar formato',
    icon: SearchCode,
    visual: 'variable-table',
    theme: {
      border: 'border-amber-400/50',
      surface: 'bg-amber-500/10',
      glow: 'shadow-amber-500/20',
      iconWrap: 'bg-amber-400/15 border-amber-300/25',
      icon: 'text-amber-200',
      text: 'text-amber-100',
      mutedText: 'text-amber-200/70',
      line: 'bg-amber-300',
      softLine: 'bg-amber-300/25',
      button: 'bg-amber-500 text-slate-950 hover:bg-amber-300 active:bg-amber-600',
      focus: 'focus-visible:outline-amber-300'
    }
  },
  {
    id: 'debugging',
    title: 'Encontrar e Corrigir o Erro',
    shortDescription:
      'O estudante recebe um programa com defeito, localiza o problema e modifica o código para corrigi-lo.',
    longDescription:
      'O estudante recebe um programa com defeito, localiza o problema e modifica o código para corrigi-lo.',
    accentColor: '#EF4444',
    darkColor: '#7F1D1D',
    status: 'testing',
    actionLabel: 'Explorar formato',
    icon: Bug,
    visual: 'debug-lines',
    theme: {
      border: 'border-rose-400/50',
      surface: 'bg-rose-500/10',
      glow: 'shadow-rose-500/20',
      iconWrap: 'bg-rose-400/15 border-rose-300/25',
      icon: 'text-rose-200',
      text: 'text-rose-100',
      mutedText: 'text-rose-200/70',
      line: 'bg-rose-300',
      softLine: 'bg-rose-300/25',
      button: 'bg-rose-500 text-white hover:bg-rose-400 active:bg-rose-600',
      focus: 'focus-visible:outline-rose-300'
    }
  }
];

export const WORKSHOP_ACTIVITIES: WorkshopActivity[] = [
  ...CODE_ORDERING_ACTIVITIES
];

export const WORKSHOP_CATEGORY_OPTIONS: WorkshopCategoryOption[] = [
  { id: 'ordenacao-de-codigo', label: 'Ordenação de Código' },
  { id: 'condicionais', label: 'Condicionais' },
  { id: 'lacos', label: 'Laços de repetição' },
  { id: 'vetores', label: 'Vetores' },
  { id: 'matrizes', label: 'Matrizes' },
  { id: 'funcoes', label: 'Funções e procedimentos' },
  { id: 'recursao', label: 'Recursão' }
];

export const WORKSHOP_SORT_OPTIONS: Array<{ id: WorkshopSortOption; label: string }> = [
  { id: 'title', label: 'Título' },
  { id: 'category', label: 'Categoria' },
  { id: 'competency', label: 'Competência' },
  { id: 'recent', label: 'Mais recentes' }
];

export function getChallengeFormatById(id: ChallengeFormatId): ChallengeFormat | undefined {
  return CHALLENGE_FORMATS.find((format) => format.id === id);
}

export function isChallengeFormatId(value: string): value is ChallengeFormatId {
  return CHALLENGE_FORMATS.some((format) => format.id === value);
}
