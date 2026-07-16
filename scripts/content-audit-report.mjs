import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({
  root,
  logLevel: 'error',
  resolve: { alias: { '@': path.join(root, 'src') } },
});

try {
  const { formatContentAuditSummary, summarizeContentAudit } = await server.ssrLoadModule('/src/lib/content/audit-report.ts');
  const summary = summarizeContentAudit();
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n${formatContentAuditSummary(summary)}\n`);
} finally {
  await server.close();
}
