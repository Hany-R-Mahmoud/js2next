import type { ParsedMarkdownPacket } from './types.ts';

const FRONTMATTER_DELIMITER = /^---\s*$/;

function parseScalar(value: string): string | number | boolean {
  const trimmed = value.trim();
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === 'true' || trimmed === 'false') return trimmed === 'true';
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseListValue(value: string): readonly string[] {
  const trimmed = value.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [String(parseScalar(trimmed))];
  const inner = trimmed.slice(1, -1).trim();
  return inner.length === 0 ? [] : inner.split(',').map((item) => String(parseScalar(item)));
}

export function parseMarkdownPacket(source: string): ParsedMarkdownPacket {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  if (lines[0] === undefined || !FRONTMATTER_DELIMITER.test(lines[0])) {
    throw new Error('Markdown packet must begin with YAML frontmatter.');
  }
  const end = lines.findIndex((line, index) => index > 0 && FRONTMATTER_DELIMITER.test(line));
  if (end < 0) throw new Error('Markdown packet frontmatter is not terminated.');
  const frontmatter: Record<string, string | number | boolean | readonly string[]> = {};
  let currentListKey: string | undefined;
  for (const line of lines.slice(1, end)) {
    if (line.trim() === '') continue;
    const listItem = /^-\s+(.+)$/.exec(line.trim());
    if (listItem !== null && currentListKey !== undefined) {
      const prior = frontmatter[currentListKey];
      const values = Array.isArray(prior) ? prior : [];
      frontmatter[currentListKey] = [...values, String(parseScalar(listItem[1] ?? ''))];
      continue;
    }
    const match = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (match === null) throw new Error(`Invalid frontmatter line: ${line}`);
    const key = match[1] ?? '';
    const value = match[2] ?? '';
    if (value === '') {
      frontmatter[key] = [];
      currentListKey = key;
    } else {
      frontmatter[key] = value.startsWith('[') ? parseListValue(value) : parseScalar(value);
      currentListKey = undefined;
    }
  }
  return { frontmatter, body: lines.slice(end + 1).join('\n').trim() };
}
