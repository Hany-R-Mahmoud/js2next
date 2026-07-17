import { contentCatalog } from '@/lib/content/catalog';
import { contentKey, type ContentKind } from '@/lib/content/identity';

export default function SourceAttribution({ kind, slug }: { readonly kind: ContentKind; readonly slug: string }) {
  const record = contentCatalog.find((entry) => entry.id === contentKey(kind, slug));
  if (!record || record.sourceMetadata.length === 0) return null;

  const versions = Array.from(new Set(record.sourceMetadata.flatMap((source) => source.frameworkVersion ?? [])));
  const verifiedAt = record.sourceMetadata.reduce((latest, source) => source.lastVerifiedAt > latest ? source.lastVerifiedAt : latest, '');
  const verifiedLabel = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(verifiedAt));
  const sourceLabels = {
    official: 'Official documentation',
    standard: 'Web standard',
    research: 'Research paper',
    community: 'Community reference',
  } as const;
  const sources = record.sourceMetadata.map((source) => {
    const url = new URL(source.sourceUrl);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const shortPath = pathSegments.length > 0 ? `/${pathSegments[pathSegments.length - 1]}` : '';
    return { ...source, location: `${url.hostname.replace(/^www\./, '')}${shortPath}` };
  });

  return (
    <aside className="mt-4 border-t border-paper-warm pt-3 text-xs text-ink-muted" aria-label="Sources and verification">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-semibold text-ink">Sources and verification</span>
        <span>Checked {verifiedLabel}</span>
        {versions.map((version) => <span key={version}>Context: {version}</span>)}
      </div>
      <ul className="mt-2 space-y-1.5">
        {sources.map((source) => (
          <li key={source.sourceUrl}>
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 max-w-full items-center gap-1 break-words py-2 text-teal hover:underline"
            >
              <span className="shrink-0">{sourceLabels[source.sourceType]}:</span>
              <span className="shrink-0" aria-hidden="true">·</span>
              <span className="min-w-0">{source.location}</span>
              <span className="shrink-0" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
