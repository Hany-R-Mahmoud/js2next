export function safeNextPath(value: string | null): string {
  if (value === null || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/home';
  try {
    const parsed = new URL(value, 'https://js2next.invalid');
    return parsed.origin === 'https://js2next.invalid' ? `${parsed.pathname}${parsed.search}${parsed.hash}` : '/home';
  } catch {
    return '/home';
  }
}
