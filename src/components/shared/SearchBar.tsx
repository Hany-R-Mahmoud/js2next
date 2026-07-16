'use client';

import { useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search...', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputId = `search-${useId()}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={inputId} className="sr-only">Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full min-h-11 px-4 py-3 pl-10 rounded-[10px] border border-paper-warm bg-slate
                   focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                   placeholder:text-ink-muted text-ink"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}
