# Validação da análise Qwen

O Worker chama uma vez `@cf/qwen/qwen3-30b-a3b-fp8` pelo binding `env.AI`. Não há streaming ou segunda chamada. A resposta deve ser JSON; cercas Markdown são removidas apenas para normalização e texto livre nunca é retornado ao frontend.

Depois do parse, a validação confere contrato, todos os critérios do desafio, vínculo do problema prioritário a um critério `partial` ou `not_satisfied`, e a rubrica de especificidade/repetição. Resposta inválida produz `MODEL_RESPONSE_INVALID`; indisponibilidade e timeout produzem erro tipado. O frontend usa o fallback local apenas para falhas técnicas transitórias, não para autenticação, origem, request ou desafio inválidos.
