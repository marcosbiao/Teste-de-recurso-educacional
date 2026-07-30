# Relatório de prontidão para serverless

Classificação: **pronto com ressalvas**.

## Evidências atuais

- A interface chama apenas `analyzeChallengeAttempt`; os componentes não importam o SDK Gemini.
- O cliente local usa o adaptador `GeminiDirectTransport`, mantém no máximo duas chamadas e usa o fallback pedagógico local após falhas permitidas.
- Contratos serializáveis de request, response e erro estão em `src/domain/analysis/analysisTransportContract.ts`.
- O catálogo `CHALLENGE_ANALYSIS_CATALOG` é derivado dos desafios e exclui solução, template e funções executáveis.
- Limites compartilhados estão em `ANALYSIS_LIMITS`.
- `getCurrentUserIdToken()` obtém token sob demanda, sem registrar ou persistir seu conteúdo.
- Registros legados são adaptados para `analysisMode: unknown` na leitura.

## Limites e riscos

1. A chamada Gemini permanece no navegador e, portanto, a chave local continua inadequada para publicação.
2. Critérios detalhados, erros comuns e orientações ainda fazem parte do catálogo do frontend; deverão ser separados para a camada interna do Worker.
3. O contrato está definido, mas nenhum Worker, endpoint, CORS, validação remota de token ou rate limit remoto foi implementado.
4. A validação real de modelo é manual e opt-in; a suíte automatizada usa mocks.

## Próxima etapa (Worker)

Mover para o Worker o transporte Gemini, seleção de modelo, prompt/schema internos e catálogo interno; manter no cliente somente o contrato HTTP, validação de UX e o token Firebase no cabeçalho. Implementar validação remota do token, CORS, limites e secrets no ambiente remoto.

## Separação futura de dados

| Pode continuar público no frontend | Deve tornar-se interno ao Worker |
| --- | --- |
| enunciado, exemplos, dicas visíveis, competência, tempo e UI | critérios detalhados, erros comuns, evidências esperadas, orientação de diagnóstico, regras de prompt |

Nenhum deploy ou Worker foi criado nesta etapa.
