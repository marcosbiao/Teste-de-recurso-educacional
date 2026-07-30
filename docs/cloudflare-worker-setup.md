# Cloudflare Worker de análise

O Worker é a única fronteira remota da análise: `POST /api/analyze` e `GET /health`. Configure `cloudflare/.dev.vars` a partir do exemplo, sem versioná-lo. `FIREBASE_PROJECT_ID` deve ser o mesmo projeto usado pelo frontend; `ALLOWED_ORIGINS` recebe uma lista separada por vírgulas.

O arquivo `wrangler.jsonc` usa o binding nativo `AI` e o rate limiter `ANALYSIS_RATE_LIMITER` (10 requisições/minuto por UID). Antes de produção, substitua o `namespace_id` de exemplo pelo namespace criado na conta Cloudflare e ajuste as origens de produção.

Desenvolvimento: `npm run worker:dev`, `npm run worker:test` e `npm run worker:build`. Depois de validar o Worker, configure no frontend `VITE_ANALYSIS_API_URL=https://<worker>.<subdominio>.workers.dev/api/analyze`.

O deploy é deliberadamente manual:

```bash
npx wrangler login
npx wrangler deploy --config cloudflare/wrangler.jsonc
```
