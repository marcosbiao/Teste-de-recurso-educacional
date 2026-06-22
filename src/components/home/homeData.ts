import type { Challenge } from '../../types';

export type TrailId = 'condicionais' | 'lacos' | 'vetores' | 'matrizes' | 'funcoes';
export type TrailStatus = 'not-started' | 'in-progress' | 'completed';

export interface TrailDefinition {
  id: TrailId;
  title: string;
  shortTitle: string;
  description: string;
  competency: string;
}

export interface TrailProgress extends TrailDefinition {
  challenges: Challenge[];
  completedCount: number;
  startedCount: number;
  percent: number;
  status: TrailStatus;
}

export const TRAILS: TrailDefinition[] = [
  {
    id: 'condicionais',
    title: 'Condicionais',
    shortTitle: 'Condicionais',
    description: 'Pratique decisões simples, múltiplas condições e classificação de casos.',
    competency: 'CCI04'
  },
  {
    id: 'lacos',
    title: 'Laços de repetição',
    shortTitle: 'Laços',
    description: 'Resolva problemas com repetição controlada, acumuladores e critérios de parada.',
    competency: 'CCI05'
  },
  {
    id: 'vetores',
    title: 'Vetores',
    shortTitle: 'Vetores',
    description: 'Pratique armazenamento, acesso por índice, percurso e busca em vetores.',
    competency: 'CCI06'
  },
  {
    id: 'matrizes',
    title: 'Matrizes',
    shortTitle: 'Matrizes',
    description: 'Explore dados em linhas e colunas, percursos aninhados e operações.',
    competency: 'CCI07'
  },
  {
    id: 'funcoes',
    title: 'Funções e procedimentos',
    shortTitle: 'Funções',
    description: 'Entenda modularização, parâmetros, retorno e chamadas de subprogramas.',
    competency: 'CCI08'
  }
];

export const COGNITIVE_OPERATION_LABELS: Record<string, string> = {
  lembrar: 'Reconhecer',
  entender: 'Compreender',
  aplicar: 'Aplicar',
  analisar: 'Analisar',
  avaliar: 'Avaliar',
  criar: 'Criar'
};

export function getTrailClassName(id: string) {
  return `trail-theme trail-theme--${id}`;
}
