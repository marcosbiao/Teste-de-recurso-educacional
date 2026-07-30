# Estratégia de Testes e Garantia de Qualidade

Este documento descreve a infraestrutura de testes implementada para o aplicativo educacional de desafios C.

## 1. Como Rodar os Testes

Os scripts de teste estão configurados no `package.json`:

- `npm test`: Roda todos os testes em modo interativo (Vitest).
- `npm run test:run`: Roda todos os testes uma única vez (CI/CD).
- `npm run test:ui`: Abre a interface gráfica do Vitest para depuração visual.
- `npm run test:coverage`: Gera um relatório de cobertura de código na pasta `coverage/`.
- `npm run lint`: Valida tipos com TypeScript para garantir integridade estática.

## 2. Estrutura de Testes

Os testes estão organizados por responsabilidade:

- `src/services/__tests__/`: Testes unitários e de integração para serviços (Auth, Firestore, Análise, Persistência, Exportação).
- `src/utils/__tests__/`: Testes unitários para funções puras e utilitários (CSV, Mapeamento).
- `src/__tests__/ui/`: Testes de interface (React Testing Library) para fluxos de usuário.
- `src/__tests__/firestore/`: Testes para as regras de segurança do Firestore.
- `src/__tests__/pedagogical/`: Testes para validar o conteúdo dos desafios e lógica pedagógica.
- `legacy/express-server/src/__tests__/`: testes preservados apenas como referência da arquitetura Express inativa.

## 3. Cobertura Atual

A base de testes cobre os seguintes pontos críticos:

- **Normalização de Dados**: Garantia de que tentativas e perfis sempre tenham valores padrão seguros.
- **Camada de Análise (IA)**: Validação da construção de prompts, tratamento de JSON inválido e fallback.
- **Fluxo Principal da UI**: Seleção de desafio, edição de código, verificação e exibição de feedback.
- **Persistência**: Salvamento local (LocalStorage) e remoto (Firestore) com tratamento de falhas.
- **Segurança (Rules)**: Validação de que apenas o dono pode ler/escrever seus dados e que tentativas são imutáveis.
- **Exportação**: Geração correta de arquivos JSON e CSV com escape de caracteres especiais.
- **Backend**: Validação de payloads, tratamento de erros da API e integração com o motor de análise.
- **Conteúdo Pedagógico**: Verificação de integridade dos desafios, dicas e soluções.

## 4. Como Adicionar Novos Testes

1. **Testes Unitários**: Crie arquivos `.test.ts` na pasta `__tests__` próxima ao arquivo original.
2. **Testes de UI**: Utilize o `render` do `@testing-library/react` e simule interações com `fireEvent` ou `userEvent`.
3. **Mocks**: Utilize o `vi.mock()` do Vitest para isolar dependências externas (Firebase, Gemini). O arquivo `src/test/setup.ts` já contém mocks globais úteis.

## 5. Próximos Passos Recomendados

- **Testes de Performance**: Validar o tempo de resposta da UI com grandes volumes de código.
- **Testes de Acessibilidade**: Utilizar `jest-axe` para validar a acessibilidade dos componentes.
- **Testes de E2E**: Implementar Playwright ou Cypress para testes de ponta a ponta em ambiente real (opcional, dado o escopo atual).
- **Harden Rules**: Expandir os testes de regras para cobrir cenários de RBAC (Admin) mais complexos.
