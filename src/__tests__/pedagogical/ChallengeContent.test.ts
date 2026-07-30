import { describe, it, expect } from 'vitest';
import { CHALLENGES } from '../../challenges/index';
import { TRAILS } from '../../components/home/homeData';

describe('Conteúdo Pedagógico dos Desafios', () => {
  it('todos os desafios devem ter campos obrigatórios', () => {
    CHALLENGES.forEach(challenge => {
      expect(challenge.id).toBeDefined();
      expect(challenge.title).toBeDefined();
      expect(challenge.problem).toBeDefined();
      expect(challenge.solution).toBeDefined();
      expect(Array.isArray(challenge.tips)).toBe(true);
      expect(Array.isArray(challenge.commonErrors)).toBe(true);
    });
  });

  it('desafios específicos devem ter o conteúdo esperado', () => {
    const desafio1 = CHALLENGES.find(c => c.id === 'desafio1_condicionais_basico');
    expect(desafio1?.title).toContain('Estrutura Condicional');
    expect(desafio1?.tips.some(t => t.text.includes('if'))).toBe(true);
  });

  it('não deve haver IDs duplicados nos desafios', () => {
    const ids = CHALLENGES.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('a solução deve ser um código C válido (básico)', () => {
    CHALLENGES.forEach(challenge => {
      expect(challenge.solution).toContain('int main');
      expect(challenge.solution).toContain('printf');
    });
  });

  it('mantém a saída de bloqueio de acesso padronizada', () => {
    const challenge = CHALLENGES.find(c => c.id === 'lacos_validar_senha_tres_tentativas');
    expect(challenge).toBeDefined();

    const challengeText = JSON.stringify(challenge);
    expect(challengeText).toContain('Acesso bloqueado');
    expect(challengeText).not.toContain('Acesso blocked');
    expect(challengeText).not.toContain('acesso bloqueado');
    expect(challenge?.examples.some(example => example.output === 'Acesso bloqueado')).toBe(true);
    expect(challenge?.solution).toContain('printf("Acesso bloqueado\\n");');
  });

  it('mantém o comportamento de vetores maiores que 10 para o caso sem resultados', () => {
    const challenge = CHALLENGES.find(c => c.id === 'vetores_maiores_que_dez');
    expect(challenge).toBeDefined();

    expect(challenge?.examples).toContainEqual({
      input: '1 2 3 4 5 6 7 8',
      output: 'Nenhum'
    });
    expect(challenge?.solution).toContain('encontrou = 0');
    expect(challenge?.solution).toContain('encontrou = 1');
    expect(challenge?.solution).toContain('printf("Nenhum\\n");');
    expect(challenge?.orientation.expectedLogic).toContain('imprimir "Nenhum"');
  });

  it('mantém a contagem correta de pares no exemplo de matriz 3x3', () => {
    const challenge = CHALLENGES.find(c => c.id === 'matrizes_contar_pares');
    expect(challenge).toBeDefined();

    expect(challenge?.examples).toContainEqual({
      input: '1 2 3 4 5 6 7 8 10',
      output: 'Total de pares: 5'
    });
    expect(challenge?.orientation.cases).toContain('2, 4, 6, 8 e 10');
    expect(challenge?.orientation.cases).toContain('total 5');
    expect(challenge?.orientation.cases).not.toContain('total 4');
  });

  it('mantém o mapeamento CCI correto das trilhas', () => {
    const competencyByTrail = Object.fromEntries(TRAILS.map(trail => [trail.id, trail.competency]));

    expect(competencyByTrail).toMatchObject({
      representacao: 'CCI01',
      condicionais: 'CCI04',
      lacos: 'CCI05',
      vetores: 'CCI06',
      matrizes: 'CCI06',
      funcoes: 'CCI07'
    });
    expect(competencyByTrail.matrizes).not.toBe('CCI07');
    expect(competencyByTrail.funcoes).not.toBe('CCI08');
  });
});
