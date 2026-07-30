# Desafios Guiados

Aplicação educacional para desafios de programação em C com acompanhamento de progresso e feedback pedagógico.

## Configuração local

1. Instale dependências: `npm install`.
2. Copie `.env.example` para `.env.local` e defina `VITE_ANALYSIS_API_URL=http://127.0.0.1:8787/api/analyze`.
3. Copie `cloudflare/.dev.vars.example` para `cloudflare/.dev.vars` e informe o `FIREBASE_PROJECT_ID` e as origens locais permitidas.
4. Em terminais separados, execute `npm run worker:dev` e `npm run dev`.

O navegador obtém um Firebase ID token sob demanda e o envia no cabeçalho Authorization. Critérios diagnósticos, prompt e modelo ficam exclusivamente no Worker. O fallback pedagógico local permanece disponível para falhas temporárias do Worker/modelo.

## Scripts

- `npm run lint`, `npm run test:run`, `npm run build`
- `npm run worker:dev`, `npm run worker:test`, `npm run worker:build`

Consulte [a configuração do Worker](docs/cloudflare-worker-setup.md), [as proteções](docs/cloudflare-security.md) e [a validação do Qwen](docs/qwen-analysis-validation.md). O deploy é manual e não é executado por este repositório.

## Estrutura

- `src/`: frontend React e fallback local.
- `cloudflare/`: Worker, autenticação, prompt, catálogo interno e validação.
- `legacy/express-server/`: referência histórica que não participa do fluxo ativo.
