# Segurança da análise no Worker

- O token Firebase é recebido exclusivamente por `Authorization: Bearer`, validado com certificados públicos Firebase, algoritmo RS256, `aud`, `iss`, expiração e `sub`.
- CORS aceita apenas origens configuradas; `*` não é usado.
- O request tem lista fechada de campos e limites para corpo, código, representação e contexto.
- O Worker busca o desafio no catálogo interno pelo `challengeId`; não aceita prompt, critérios, modelo ou solução enviados pelo navegador.
- Código e comentários do estudante são delimitados como dados não confiáveis no prompt, portanto não podem alterar instruções ou schema.
- O rate limit é por UID autenticado e protege picos de uso; não é contabilidade exata.
- Logs de desenvolvimento guardam apenas metadados técnicos seguros, nunca tokens, prompt integral, código ou solução.

`cloudflare/.dev.vars` e `.env*` estão ignorados pelo Git. A URL do Worker não é segredo. Remova manualmente qualquer chave Gemini antiga de `.env.local`.
