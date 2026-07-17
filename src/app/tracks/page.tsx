import Link from 'next/link';
import { curriculum } from '@/domain/curriculum';
import { CurriculumBadge, CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';

export default function TracksPage() {
  return <div className="space-y-8"><CurriculumNav /><CurriculumHeader eyebrow="Release 1 curriculum" title="Choose your track" description="Follow the canonical path from JavaScript foundations through React and Next.js." /><div className="grid gap-6 md:grid-cols-3">{curriculum.tracks.map((track) => <Link key={track.id} href={`/tracks/${track.slug}`} className="card block p-6 transition-colors hover:border-teal/50"><CurriculumBadge tone="accent">Track {track.order}</CurriculumBadge><h2 className="mt-4 text-2xl font-semibold text-ink">{track.title}</h2><p className="mt-2 text-sm text-ink-light">{track.modules.length} modules · {track.modules.reduce((count, module) => count + module.topics.length, 0)} topics</p><span className="mt-6 inline-block text-sm font-semibold text-teal">Explore track →</span></Link>)}</div></div>;
}
