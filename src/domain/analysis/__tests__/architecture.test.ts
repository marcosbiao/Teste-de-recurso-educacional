import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => fs.readFileSync(path, 'utf8');

describe('arquitetura ativa de análise', () => {
  it('usa uma única fachada Worker e não expõe SDK ou prompt ao frontend', () => {
    expect(read('src/hooks/useChallengeState.ts')).toContain('../services/analysisService');
    expect(read('src/services/analysisService.ts')).toContain('CloudflareWorkerTransport');
    expect(read('src/services/analysisService.ts')).not.toContain('@google/genai');
    expect(read('src/services/transports/cloudflareWorkerTransport.ts')).toContain('Authorization');
    expect(read('src/services/transports/cloudflareWorkerTransport.ts')).not.toContain('prompt');
  });

  it('mantém prompt e modelo somente no Worker', () => {
    expect(read('cloudflare/src/ai/buildAnalysisPrompt.ts')).toContain('@cf/qwen/qwen3-30b-a3b-fp8');
    expect(read('cloudflare/src/ai/buildAnalysisPrompt.ts')).toContain('TENTATIVA_NAO_CONFIAVEL');
    expect(read('package.json')).not.toContain('@google/genai');
    expect(read('package.json')).toContain('worker:build');
    expect(fs.existsSync('legacy/express-server/README.md')).toBe(true);
  });
  it("mantém avaliações privadas fora da árvore de código do navegador", () => {
    expect(fs.existsSync("cloudflare/src/evaluation/getChallengeEvaluation.ts")).toBe(true);
    expect(fs.existsSync("src/evaluation")).toBe(false);
    expect(read("src/services/transports/cloudflareWorkerTransport.ts")).not.toContain("cloudflare/src/evaluation");
  });
});
