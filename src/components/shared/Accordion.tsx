'use client';

import { useId, useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="border border-slate-secondary rounded-[12px] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between min-h-11 px-4 py-3 bg-slate-secondary/50 hover:bg-slate-secondary transition-colors text-left"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="font-medium text-ink">{title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div id={contentId} className="px-4 py-3 border-t border-slate-secondary bg-slate/30">
          {children}
        </div>
      )}
    </div>
  );
}
