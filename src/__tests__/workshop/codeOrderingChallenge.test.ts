import { describe, expect, it } from 'vitest';
import { progressiveIncomeTaxOrderingChallenge } from '../../data/codeOrderingChallenges';
import {
  composeCodeFromBlockIds,
  validateCodeOrderingSolution
} from '../../domain/codeOrderingValidator';

const challenge = progressiveIncomeTaxOrderingChallenge;
const canonicalOrder = challenge.acceptedOrders![0];

function withMovedBlock(order: string[], blockId: string, targetIndex: number) {
  const nextOrder = order.filter((currentBlockId) => currentBlockId !== blockId);
  nextOrder.splice(targetIndex, 0, blockId);
  return nextOrder;
}

function normalizeCode(code: string) {
  return code.replace(/\s+/g, '');
}

describe('Atividade de Ordenação de Código - imposto progressivo', () => {
  it('cadastra os metadados principais da atividade', () => {
    expect(challenge.id).toBe('imposto-progressivo-condicionais');
    expect(challenge.slug).toBe('imposto-progressivo-condicionais');
    expect(challenge.competencyId).toBe('CCI04');
    expect(challenge.difficulty).toBe(3);
    expect(challenge.language).toBe('c');
    expect(challenge.status).toBe('published');
  });

  it('mantém exatamente 13 blocos com IDs únicos', () => {
    const blockIds = challenge.blocks.map((block) => block.id);
    expect(challenge.blocks).toHaveLength(13);
    expect(new Set(blockIds).size).toBe(13);
  });

  it('mantém a ordem inicial com todos os blocos e diferente da ordem canônica', () => {
    const blockIds = challenge.blocks.map((block) => block.id).sort();
    expect([...challenge.initialBlockOrder].sort()).toEqual(blockIds);
    expect(challenge.initialBlockOrder).not.toEqual(canonicalOrder);
  });

  it('mantém a ordem aceita com todos os blocos cadastrados', () => {
    const blockIds = challenge.blocks.map((block) => block.id).sort();
    expect([...canonicalOrder].sort()).toEqual(blockIds);
    expect(challenge.equivalentGroups).toEqual([]);
  });

  it('compõe a solução canônica a partir dos blocos cadastrados', () => {
    const composedCode = composeCodeFromBlockIds(challenge, canonicalOrder);
    expect(normalizeCode(composedCode)).toBe(normalizeCode(challenge.solutionCode));
  });

  it('aceita a solução canônica usando IDs estáveis', () => {
    const result = validateCodeOrderingSolution(challenge, canonicalOrder);
    expect(result.isValid).toBe(true);
  });

  it('aceita todas as ordens cadastradas em acceptedOrders', () => {
    challenge.acceptedOrders?.forEach((acceptedOrder) => {
      expect(validateCodeOrderingSolution(challenge, acceptedOrder).isValid).toBe(true);
    });
  });

  it('rejeita inversões sem criar equivalências artificiais', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'calc-second-band', canonicalOrder.indexOf('second-band-open'));
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).not.toBeUndefined();
  });

  it('rejeita a ordem inicial embaralhada com feedback específico', () => {
    const result = validateCodeOrderingSolution(challenge, challenge.initialBlockOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('declaration-after-read');
    expect(result.issue?.relatedBlockIds).toEqual(['declare-values', 'read-salary']);
  });

  it('detecta leitura antes da declaração', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'read-salary', canonicalOrder.indexOf('declare-values'));
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('declaration-after-read');
  });

  it('detecta condição antes da leitura', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'exempt-guard', canonicalOrder.indexOf('read-salary'));
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('condition-before-input');
  });

  it('detecta cadeia tributável antes da isenção', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'first-band-open', canonicalOrder.indexOf('exempt-guard'));
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('tax-chain-before-exemption');
  });

  it('detecta cálculo fora do primeiro escopo', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'calc-first-band', canonicalOrder.indexOf('second-band-open') + 1);
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('first-calculation-outside-scope');
  });

  it('detecta cálculo fora do segundo escopo', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'calc-second-band', canonicalOrder.indexOf('top-band-open') + 1);
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('second-calculation-outside-scope');
  });

  it('detecta cálculo fora do terceiro escopo', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'calc-top-band', canonicalOrder.indexOf('progressive-chain-close') + 1);
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('top-calculation-outside-scope');
  });

  it('detecta saída antes do processamento', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'show-tax', canonicalOrder.indexOf('progressive-chain-close'));
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('output-before-processing');
  });

  it('detecta encerramento antes da saída', () => {
    const invalidOrder = withMovedBlock(canonicalOrder, 'program-end', canonicalOrder.indexOf('show-tax'));
    const result = validateCodeOrderingSolution(challenge, invalidOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('program-ended-before-output');
  });

  it('detecta solução incompleta antes de avaliar a ordem', () => {
    const result = validateCodeOrderingSolution(challenge, canonicalOrder.slice(0, 12));
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('incomplete-solution');
  });

  it('detecta blocos duplicados por ID', () => {
    const duplicatedOrder = [...canonicalOrder.slice(0, -1), 'show-tax'];
    const result = validateCodeOrderingSolution(challenge, duplicatedOrder);
    expect(result.isValid).toBe(false);
    expect(result.issue?.id).toBe('duplicate-block');
  });
});
