'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filePath?: string;
  ariaLabel?: string;
}

export default function CodeBlock({ code, language = 'typescript', filePath, ariaLabel }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-paper-warm my-4">
      {filePath && (
        <div className="bg-code-bg/90 px-4 py-2 text-xs text-code-text/60 font-mono border-b border-white/5">
          {filePath} · {language}
        </div>
      )}
      <div className="relative bg-code-bg p-4 group">
        <button
          type="button"
          onClick={handleCopy}
          className="copy-code-button relative mb-2 ml-auto block min-h-11 min-w-11 touch-manipulation rounded bg-white/10 px-3 py-2 text-xs text-white transition-opacity hover:bg-white/20 focus-visible:opacity-100 focus-visible:outline-white lg:absolute lg:right-3 lg:top-3 lg:mb-0"
          aria-label={copyError ? 'Copy failed' : copied ? 'Copied' : 'Copy code'}
        >
          {copyError ? 'Copy failed' : copied ? 'Copied!' : 'Copy'}
        </button>
        {copyError && <p role="status" className="mb-2 text-xs text-coral">Copy failed. Select the code and copy it manually.</p>}
        <pre className="overflow-x-auto pr-4 text-sm leading-relaxed lg:pr-28" aria-label={ariaLabel ?? `${language} code example`}>
          <code className="text-code-text font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}
