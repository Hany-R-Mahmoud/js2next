import type { ReactNode } from 'react';

export default function InlineMarkdown({ text }: { readonly text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index): ReactNode => part.startsWith('**') && part.endsWith('**')
    ? <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    : part.startsWith('`') && part.endsWith('`')
      ? <code key={`${part}-${index}`} className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-[0.92em] text-code-accent">{part.slice(1, -1)}</code>
    : part);
}
