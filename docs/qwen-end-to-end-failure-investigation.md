# Investigação ponta a ponta do Qwen

| Hipótese | Evidência | Resultado | Correção/Teste |
| --- | --- | --- | --- |
| Binding ou modelo indisponível | Smoke real respondeu com chat completion | Descartada | `GET /debug/qwen-smoke` |
| `response_format` incompatível | Foi removido; pipeline controlado continuou válido | Descartada | Smoke e pipeline sem `response_format` |
| Raciocínio esgota saída mínima | 100/256 tokens: `reasoning_content`, `finishReason: length`, sem content | Confirmada no smoke mínimo | Smoke usa `/no_think` com 100 tokens |
| Parser não reconhece resposta | `choices[0].message.content` extraído e JSON analisado | Descartada | testes do parser |
| JSON/contrato/pedagogia do combustível | Pipeline fixo chegou a `pedagogy_validated` | Descartada no caso controlado | `POST /debug/analyze-pipeline` |
| Critério de saída sem prioridade | Pipeline apontou `crit8` | Descartada | teste combustível |
| CORS, token, persistência, renderização | Exigem requisição autenticada no navegador | Não testada neste ambiente | usar requestId correlacionado |
| Firestore rejeita `cloudflare_qwen` | Regra atual conhecida aceita modos legados | Pendente | feedback deve permanecer visível; regras não foram alteradas |

As rotas `/debug/qwen-smoke` e `/debug/analyze-pipeline` só existem quando `ENVIRONMENT=development`, não retornam prompt, resposta bruta, código, token ou critérios completos.
