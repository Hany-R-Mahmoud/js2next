import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="card max-w-md p-8 text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">404</p>
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          Page not found
        </h1>
        <p className="text-ink-light">This page does not exist in the current app.</p>
        <Link href="/home" className="btn-primary inline-block">Back to Home</Link>
      </div>
    </div>
  );
}
