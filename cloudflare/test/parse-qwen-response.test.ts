import { describe, expect, it } from 'vitest';
import { describeWorkersAiResponse, extractTextFromWorkersAiResponse, parseQwenResponse } from '../src/ai/parseQwenResponse';

const json = JSON.stringify({ category: 'parcialmente correta' });

describe('parseQwenResponse', () => {
  for (const [name, payload] of [
    ['response', { response: json }], ['text', { text: json }], ['result', { result: json }], ['chat completion', { choices: [{ message: { content: json } }] }],
    ['choice text', { choices: [{ text: json }] }], ['output text', { output_text: json }], ['output content', { output: [{ content: [{ text: json }] }] }],
  ] as const) it(`aceita ${name}`, () => expect(parseQwenResponse(payload)).toEqual({ category: 'parcialmente correta' }));

  it('aceita cercas e texto curto antes ou depois de um único JSON', () => {
    expect(parseQwenResponse({ choices: [{ message: { content: `\`\`\`json\n${json}\n\`\`\`` } }] })).toEqual({ category: 'parcialmente correta' });
    expect(parseQwenResponse({ response: `Resultado:\n${json}\nFim.` })).toEqual({ category: 'parcialmente correta' });
  });
  it('rejeita ausência de texto, choices vazias, content não textual e objeto desconhecido', () => {
    for (const payload of [{}, { choices: [] }, { choices: [{ message: { content: {} } }] }, { output: [] }]) expect(() => extractTextFromWorkersAiResponse(payload)).toThrow();
  });
  it('rejeita JSON ambíguo e mantém metadados somente como forma segura', () => {
    expect(() => parseQwenResponse({ response: `${json}\n${json}` })).toThrow();
    expect(describeWorkersAiResponse({ choices: [{ message: { content: json } }], usage: { total_tokens: 12 }, model: 'qwen' }, json)).toMatchObject({ choicesCount: 1, hasMessageContent: true, hasUsage: true, model: 'qwen', extractedTextLength: json.length });
  });
});
