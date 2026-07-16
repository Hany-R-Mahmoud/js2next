import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--color-midnight-ink) / <alpha-value>)',
        'paper-dark': 'rgb(var(--color-slate-700) / <alpha-value>)',
        'paper-warm': 'rgb(var(--color-slate-600) / <alpha-value>)',
        ink: 'rgb(var(--color-pure-white) / <alpha-value>)',
        'ink-light': 'rgb(var(--color-cloud-gray) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ash) / <alpha-value>)',
        vermillion: 'rgb(var(--color-peloton-red) / <alpha-value>)',
        'vermillion-dark': 'rgb(var(--color-peloton-red-dark) / <alpha-value>)',
        coral: 'rgb(var(--color-coral) / <alpha-value>)',
        teal: 'rgb(var(--color-signal-blue) / <alpha-value>)',
        'teal-dark': 'rgb(var(--color-signal-blue-light) / <alpha-value>)',
        'code-bg': 'rgb(var(--color-code-bg) / <alpha-value>)',
        'code-text': 'rgb(var(--color-cloud-gray) / <alpha-value>)',
        'code-accent': 'rgb(var(--color-code-accent) / <alpha-value>)',
        success: 'rgb(var(--color-lime-badge) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        midnight: 'rgb(var(--color-midnight-ink) / <alpha-value>)',
        slate: 'rgb(var(--color-slate-900) / <alpha-value>)',
        'slate-secondary': 'rgb(var(--color-slate-700) / <alpha-value>)',
        cloud: 'rgb(var(--color-cloud-gray) / <alpha-value>)',
        ash: 'rgb(var(--color-ash) / <alpha-value>)',
        'signal-blue': 'rgb(var(--color-signal-blue) / <alpha-value>)',
        'lime-badge': 'rgb(var(--color-lime-badge) / <alpha-value>)',
        'deep-navy': 'rgb(var(--color-deep-navy) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
