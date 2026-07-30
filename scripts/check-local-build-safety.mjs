import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const forbidden = [
  { name: 'GEMINI_API_KEY', pattern: /GEMINI_API_KEY/i },
  { name: 'Google GenAI SDK', pattern: /@google\/genai/i },
  { name: 'prompt interno', pattern: /<ENUNCIADO_CONFIAVEL>|<CRITERIOS_CONFIAVEIS>/i },
];

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]));
  return nested.flat();
}

const root = 'dist';
try {
  const violations = [];
  for (const file of await files(root)) {
    const content = await readFile(file, 'utf8');
    for (const rule of forbidden) if (rule.pattern.test(content)) violations.push({ file, rule: rule.name });
  }
  if (violations.length) {
    for (const violation of violations) console.error(`Falha de segurança no bundle: ${violation.file} (${violation.rule}).`);
    process.exitCode = 1;
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
