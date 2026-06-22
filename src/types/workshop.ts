import type { LucideIcon } from 'lucide-react';

export type ChallengeFormatId =
  | 'guided'
  | 'code-ordering'
  | 'code-completion'
  | 'variable-tracing'
  | 'debugging';

export type ChallengeFormatStatus = 'available' | 'testing' | 'planned';

export type ChallengeFormatVisual =
  | 'guided-code'
  | 'ordered-blocks'
  | 'completion-blanks'
  | 'variable-table'
  | 'debug-lines';

export interface ChallengeFormatTheme {
  border: string;
  surface: string;
  glow: string;
  iconWrap: string;
  icon: string;
  text: string;
  mutedText: string;
  line: string;
  softLine: string;
  button: string;
  focus: string;
}

export interface ChallengeFormat {
  id: ChallengeFormatId;
  title: string;
  shortDescription: string;
  longDescription: string;
  accentColor: string;
  darkColor: string;
  status: ChallengeFormatStatus;
  actionLabel: string;
  icon: LucideIcon;
  visual: ChallengeFormatVisual;
  theme: ChallengeFormatTheme;
}

export interface WorkshopActivity {
  id: string;
  slug?: string;
  title: string;
  description: string;
  formatId: ChallengeFormatId;
  categoryId: string;
  categoryLabel: string;
  competencyId: string;
  competencyLabel: string;
  status: ChallengeFormatStatus;
  difficulty?: number;
  language?: string;
  createdAt?: string;
}

export type BlockSemanticCategory =
  | 'structure'
  | 'declaration'
  | 'input-output'
  | 'control-flow'
  | 'processing'
  | 'termination';

export interface CodeOrderingBlock {
  id: string;
  code: string;
  category: BlockSemanticCategory;
  indentationLevel: number;
  scopeGroupId?: string;
  explanation: string;
  canonicalPosition: number;
}

export interface OrderingDependency {
  beforeBlockId: string;
  afterBlockId: string;
  feedback: string;
}

export interface EquivalentGroup {
  blockIds: string[];
  rule: 'any-order';
}

export interface ScopeRelationship {
  parentBlockId: string;
  childBlockIds: string[];
  closingBlockId: string;
}

export interface OrderingFeedbackRule {
  id: string;
  condition: string;
  relatedBlockIds: string[];
  priority: number;
  message: string;
}

export interface CodeOrderingChallenge {
  id: string;
  slug: string;
  title: string;
  statement: string;
  categoryId: string;
  categoryLabel: string;
  competencyId: string;
  competencyLabel: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  language: 'c';
  learningObjective: string;
  prerequisites: string[];
  inputDescription: string;
  outputDescription: string;
  exampleInput: string;
  exampleOutput: string;
  solutionCode: string;
  blocks: CodeOrderingBlock[];
  initialBlockOrder: string[];
  acceptedOrders?: string[][];
  dependencies: OrderingDependency[];
  equivalentGroups: EquivalentGroup[];
  scopeRelationships: ScopeRelationship[];
  hints: string[];
  feedbackRules: OrderingFeedbackRule[];
  successFeedback: string;
  status: 'draft' | 'testing' | 'published';
  createdAt?: string;
}

export interface WorkshopCategoryOption {
  id: string;
  label: string;
}

export type WorkshopSortOption = 'title' | 'category' | 'competency' | 'recent';

export interface OrderingValidationIssue {
  id: string;
  message: string;
  relatedBlockIds: string[];
  priority: number;
}

export interface OrderingValidationResult {
  isValid: boolean;
  issue?: OrderingValidationIssue;
}
