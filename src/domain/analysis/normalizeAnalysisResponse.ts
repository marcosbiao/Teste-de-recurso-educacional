export class AnalysisNormalizationError extends Error {
  readonly code = 'invalid_json';
  constructor(message: string) { super(message); this.name = 'AnalysisNormalizationError'; }
}

export function normalizeAnalysisText(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }

function fencedJson(text: string): string | undefined {
  const match = text.match(/^\s*```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i);
  return match?.[1]?.trim();
}

/** Finds exactly one balanced top-level JSON object without cutting braces inside strings. */
function singleJsonObject(text: string): string | undefined {
  let start = -1; let depth = 0; let quote = ''; let escaped = false; let found: string | undefined;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"') { quote = char; continue; }
    if (char === '{') { if (depth === 0) start = index; depth += 1; continue; }
    if (char === '}' && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        if (found) return undefined;
        found = text.slice(start, index + 1);
      }
    }
  }
  return !quote && depth === 0 ? found : undefined;
}

export function normalizeAnalysisResponse(raw: unknown): unknown {
  if (raw && typeof raw === 'object') return raw;
  const text = normalizeAnalysisText(raw);
  if (!text) throw new AnalysisNormalizationError('A resposta não contém JSON.');
  const candidate = fencedJson(text) || singleJsonObject(text);
  if (!candidate) throw new AnalysisNormalizationError('A resposta não contém um único objeto JSON reconhecível.');
  try { return JSON.parse(candidate); }
  catch { throw new AnalysisNormalizationError('A resposta não contém JSON válido.'); }
}
