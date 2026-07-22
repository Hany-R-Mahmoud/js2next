import { curriculum } from '@/domain/curriculum';
import { siteUrl } from '@/lib/seo';

export function GET(): Response {
  const base = siteUrl ?? '';
  const lines = [
    '# JS2Next',
    '',
    '> A connected learning path from JavaScript to React to Next.js, built for durable frontend understanding.',
    '',
    '## Public learning paths',
    `- [Tracks](${base}/tracks): ${curriculum.tracks.map((track) => track.title).join(', ')}.`,
    '- [JavaScript to React to Next.js path](/tracks): Ordered modules, topic lessons, practice, and mastery checks.',
    '',
    '## Content principles',
    '- Lessons explain mental models before syntax.',
    '- Practice checks reasoning, code reading, and engineering judgment.',
    '- Public topic pages are the canonical learning content.',
    '',
    '## Excluded surfaces',
    '- Personal progress, settings, review queues, search results, assessments, quizzes, and draft previews are learner or internal surfaces.',
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
