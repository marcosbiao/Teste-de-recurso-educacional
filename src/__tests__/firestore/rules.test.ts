import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { initializeTestEnvironment, RulesTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe.skip('Firestore Rules', () => {
  let testEnv: RulesTestEnvironment;
  const PROJECT_ID = 'test-project';
  const rules = readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf8');

  beforeEach(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: { rules }
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it('deve permitir que o dono crie uma tentativa válida com o novo contrato', async () => {
    const aliceContext = testEnv.authenticatedContext('alice', { email: 'alice@example.com', email_verified: true });
    const aliceAttempt = aliceContext.firestore().doc('users/alice/attempts/attempt-1');

    await assertSucceeds(aliceAttempt.set({
      userId: 'alice',
      challengeId: 'desafio1_condicionais_basico',
      challengeVersion: '1.0.0',
      timestamp: new Date(),
      code: 'int main() {}',
      category: 'tentativa inicial',
      confidence: 'media',
      tipsUsed: [],
      studentFeedback: {
        positiveObservation: 'A leitura da entrada foi iniciada.',
        primaryIssue: {
          hasIssue: true,
          type: 'caso_nao_tratado',
          concept: 'estrutura condicional',
          evidence: 'A condição numero > 0 é seguida diretamente por else.',
          explanation: 'O caso zero está sendo agrupado com os negativos.'
        },
        guidingQuestion: 'Qual valor não é positivo nem negativo?',
        nextAction: 'Crie um tratamento separado para o caso em que o valor seja zero.'
      },
      teacherDiagnosis: {
        hypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
        confidence: 'alta'
      },
      feedback: { good: ['A leitura da entrada foi iniciada.'], review: ['O caso zero está sendo agrupado com os negativos.', 'Evidência: A condição numero > 0 é seguida diretamente por else.'], nextStep: 'Crie um tratamento separado para o caso em que o valor seja zero.' },
      difficultyHypothesis: 'O estudante reconheceu a estrutura condicional, mas ainda não separou todos os casos.',
      errorType: ['caso_nao_tratado'],
      suggestedNextStep: 'Crie um tratamento separado para o caso em que o valor seja zero.',
      analysisSummary: 'O caso zero está sendo agrupado com os negativos.',
      analysisMode: 'gemini_primary',
      modelUsed: 'gemini-flash-latest',
      promptVersion: '3.1.0',
      sessionId: 'sess-1',
      processMetrics: {
        timeSinceSessionStart: 10,
        verificationIndex: 1,
        tipsCountAtSubmission: 0
      }
    }));
  });

  it('deve impedir a criação de tentativa para outro userId', async () => {
    const aliceContext = testEnv.authenticatedContext('alice', { email: 'alice@example.com', email_verified: true });
    const bobAttempt = aliceContext.firestore().doc('users/bob/attempts/attempt-1');

    await assertFails(bobAttempt.set({ userId: 'bob', challengeId: 'desafio1_condicionais_basico' }));
  });
});
