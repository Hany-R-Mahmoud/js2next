import Link from 'next/link';
import type { PrerequisiteEdge, Topic } from '@/domain/curriculum';
import { curriculum, findTopicById } from '@/domain/curriculum';
import { CurriculumBadge } from './CurriculumHeader';

export function PrerequisiteNotice({ topic, edges }: { readonly topic: Topic; readonly edges: readonly PrerequisiteEdge[] }) {
  if (edges.length === 0) return null;
  return (
    <aside className="rounded-xl border border-warning/40 bg-warning/10 p-4" aria-labelledby="prerequisites-title">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="prerequisites-title" className="font-semibold text-ink">Prerequisites</h2>
        <CurriculumBadge tone="warning">Soft gate</CurriculumBadge>
      </div>
      <p className="mt-2 text-sm leading-6 text-ink-light">You can continue. Review these topics first if your mastery is below 80%.</p>
      <ul className="mt-3 space-y-2 text-sm">
        {edges.map((edge) => {
          const prerequisite = findTopicById(edge.fromTopicId);
          return prerequisite ? <li key={`${edge.fromTopicId}-${topic.id}`}><Link className="text-teal underline-offset-4 hover:underline" href={`/learn/${trackFor(prerequisite.id)}/${moduleSlugFor(prerequisite.id)}/${prerequisite.slug}`}>{prerequisite.title}</Link><span className="ml-2 text-ink-muted">{edge.kind === 'required' ? 'required' : 'recommended'}</span></li> : null;
        })}
      </ul>
    </aside>
  );
}

function trackFor(topicId: string): string { return topicId.startsWith('JS-') ? 'javascript' : topicId.startsWith('R-') ? 'react' : 'nextjs'; }
function moduleSlugFor(topicId: string): string {
  const topic = findTopicById(topicId);
  if (!topic) return '';
  const moduleRecord = curriculum.tracks.flatMap((track) => track.modules).find((candidate) => candidate.topics.some((item) => item.id === topic.id));
  return moduleRecord?.slug ?? '';
}
