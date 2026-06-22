import type {
  CodeOrderingChallenge,
  OrderingValidationIssue,
  OrderingValidationResult
} from '../types/workshop';

type FeedbackRuleEvaluator = (order: string[], challenge: CodeOrderingChallenge) => boolean;

const FEEDBACK_RULE_EVALUATORS: Record<string, FeedbackRuleEvaluator> = {
  'declaration-after-read': (order) => isBefore(order, 'read-salary', 'declare-values'),
  'condition-before-input': (order) =>
    isBefore(order, 'exempt-guard', 'read-salary') || isBefore(order, 'first-band-open', 'read-salary'),
  'tax-chain-before-exemption': (order) => isBefore(order, 'first-band-open', 'exempt-guard'),
  'first-calculation-outside-scope': (order) =>
    !isBetween(order, 'calc-first-band', 'first-band-open', 'second-band-open'),
  'second-branch-without-first-calculation': (order) => isBefore(order, 'second-band-open', 'calc-first-band'),
  'second-calculation-outside-scope': (order) =>
    !isBetween(order, 'calc-second-band', 'second-band-open', 'top-band-open'),
  'else-before-second-calculation': (order) => isBefore(order, 'top-band-open', 'calc-second-band'),
  'top-calculation-outside-scope': (order) =>
    !isBetween(order, 'calc-top-band', 'top-band-open', 'progressive-chain-close'),
  'chain-closed-too-early': (order) => isBefore(order, 'progressive-chain-close', 'calc-top-band'),
  'output-before-processing': (order) =>
    isBefore(order, 'show-tax', 'calc-first-band')
    || isBefore(order, 'show-tax', 'calc-second-band')
    || isBefore(order, 'show-tax', 'calc-top-band')
    || isBefore(order, 'show-tax', 'progressive-chain-close'),
  'program-ended-before-output': (order) => isBefore(order, 'program-end', 'show-tax'),
  'else-if-without-predecessor': (order) =>
    isBefore(order, 'second-band-open', 'first-band-open') || isBefore(order, 'top-band-open', 'second-band-open'),
  'incomplete-solution': (order, challenge) => order.length < challenge.blocks.length
};

export function validateCodeOrderingSolution(
  challenge: CodeOrderingChallenge,
  orderedBlockIds: string[]
): OrderingValidationResult {
  const blockIds = challenge.blocks.map((block) => block.id);
  const blockIdSet = new Set(blockIds);
  const uniqueOrderedIds = new Set(orderedBlockIds);

  const unknownBlockIds = orderedBlockIds.filter((blockId) => !blockIdSet.has(blockId));
  if (unknownBlockIds.length > 0) {
    return issueResult({
      id: 'unknown-block',
      message: 'A solução contém blocos que não pertencem a esta atividade.',
      relatedBlockIds: unknownBlockIds,
      priority: 130
    });
  }

  const duplicateBlockIds = orderedBlockIds.filter((blockId, index) => orderedBlockIds.indexOf(blockId) !== index);
  if (duplicateBlockIds.length > 0) {
    return issueResult({
      id: 'duplicate-block',
      message: 'Um mesmo bloco aparece mais de uma vez na solução. Cada bloco deve ser usado apenas uma vez.',
      relatedBlockIds: Array.from(new Set(duplicateBlockIds)),
      priority: 125
    });
  }

  if (orderedBlockIds.length < blockIds.length) {
    return issueResult({
      id: 'incomplete-solution',
      message: getRuleMessage(challenge, 'incomplete-solution')
        ?? 'A solução ainda está incompleta. Posicione todos os blocos antes de verificar a ordem.',
      relatedBlockIds: blockIds.filter((blockId) => !uniqueOrderedIds.has(blockId)),
      priority: 60
    });
  }

  const missingBlockIds = blockIds.filter((blockId) => !uniqueOrderedIds.has(blockId));
  if (missingBlockIds.length > 0) {
    return issueResult({
      id: 'missing-block',
      message: 'Há blocos obrigatórios ausentes na solução.',
      relatedBlockIds: missingBlockIds,
      priority: 120
    });
  }

  const structuralIssues = [
    ...getScopeIssues(challenge, orderedBlockIds),
    ...getDependencyIssues(challenge, orderedBlockIds),
    ...getSpecificFeedbackIssues(challenge, orderedBlockIds)
  ];

  if (structuralIssues.length > 0) {
    return issueResult(
      structuralIssues.sort((left, right) => right.priority - left.priority)[0]
    );
  }

  const acceptedOrders = challenge.acceptedOrders ?? [];
  const accepted = acceptedOrders.some((acceptedOrder) => areSameOrder(acceptedOrder, orderedBlockIds));
  if (accepted) {
    return { isValid: true };
  }

  return issueResult(getFirstMismatchIssue(challenge, orderedBlockIds));
}

export function composeCodeFromBlockIds(challenge: CodeOrderingChallenge, orderedBlockIds: string[]) {
  const blocksById = new Map(challenge.blocks.map((block) => [block.id, block]));
  return orderedBlockIds
    .map((blockId) => blocksById.get(blockId)?.code ?? '')
    .join('\n\n');
}

function getScopeIssues(challenge: CodeOrderingChallenge, orderedBlockIds: string[]): OrderingValidationIssue[] {
  return challenge.scopeRelationships.flatMap((relationship) => {
    return relationship.childBlockIds
      .filter((childBlockId) => !isBetween(orderedBlockIds, childBlockId, relationship.parentBlockId, relationship.closingBlockId))
      .map((childBlockId) => ({
        id: `scope-${childBlockId}`,
        message: `O bloco de processamento precisa permanecer dentro do escopo correto antes de continuar.`,
        relatedBlockIds: [relationship.parentBlockId, childBlockId, relationship.closingBlockId],
        priority: 70
      }));
  });
}

function getDependencyIssues(challenge: CodeOrderingChallenge, orderedBlockIds: string[]): OrderingValidationIssue[] {
  return challenge.dependencies
    .filter((dependency) => isBefore(orderedBlockIds, dependency.afterBlockId, dependency.beforeBlockId))
    .map((dependency) => ({
      id: `dependency-${dependency.beforeBlockId}-${dependency.afterBlockId}`,
      message: dependency.feedback,
      relatedBlockIds: [dependency.beforeBlockId, dependency.afterBlockId],
      priority: 65
    }));
}

function getSpecificFeedbackIssues(challenge: CodeOrderingChallenge, orderedBlockIds: string[]): OrderingValidationIssue[] {
  return challenge.feedbackRules
    .filter((rule) => rule.id !== 'incomplete-solution')
    .filter((rule) => FEEDBACK_RULE_EVALUATORS[rule.id]?.(orderedBlockIds, challenge))
    .map((rule) => ({
      id: rule.id,
      message: rule.message,
      relatedBlockIds: rule.relatedBlockIds,
      priority: rule.priority
    }));
}

function getFirstMismatchIssue(challenge: CodeOrderingChallenge, orderedBlockIds: string[]): OrderingValidationIssue {
  const acceptedOrder = challenge.acceptedOrders?.[0] ?? [];
  const mismatchIndex = orderedBlockIds.findIndex((blockId, index) => blockId !== acceptedOrder[index]);
  const relatedBlockIds = mismatchIndex >= 0
    ? [acceptedOrder[mismatchIndex], orderedBlockIds[mismatchIndex]].filter(Boolean)
    : [];

  return {
    id: 'order-mismatch',
    message: 'A sequência ainda não forma o programa esperado. Revise o primeiro ponto em que a estrutura deixa de seguir a lógica do problema.',
    relatedBlockIds,
    priority: 40
  };
}

function getRuleMessage(challenge: CodeOrderingChallenge, ruleId: string) {
  return challenge.feedbackRules.find((rule) => rule.id === ruleId)?.message;
}

function issueResult(issue: OrderingValidationIssue): OrderingValidationResult {
  return {
    isValid: false,
    issue
  };
}

function isBefore(order: string[], beforeBlockId: string, afterBlockId: string) {
  const beforeIndex = order.indexOf(beforeBlockId);
  const afterIndex = order.indexOf(afterBlockId);

  return beforeIndex >= 0 && afterIndex >= 0 && beforeIndex < afterIndex;
}

function isBetween(order: string[], blockId: string, startBlockId: string, endBlockId: string) {
  const blockIndex = order.indexOf(blockId);
  const startIndex = order.indexOf(startBlockId);
  const endIndex = order.indexOf(endBlockId);

  return startIndex >= 0 && blockIndex > startIndex && endIndex > blockIndex;
}

function areSameOrder(left: string[], right: string[]) {
  return left.length === right.length && left.every((blockId, index) => blockId === right[index]);
}
