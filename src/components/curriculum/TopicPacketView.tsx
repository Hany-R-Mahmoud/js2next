import type { TopicPacket } from '@/domain/curriculum/packet';

export function TopicPacketView({ packet }: { readonly packet: TopicPacket }) {
  return (
    <div className="space-y-8">
      <section className="card p-6" aria-labelledby="why-title">
        <p className="surface-eyebrow">Why it matters</p>
        <h2 id="why-title" className="mt-2 text-xl font-semibold text-ink">Build the model before the syntax</h2>
        <p className="mt-3 max-w-3xl leading-7 text-ink-light">{packet.whyThisMatters}</p>
      </section>
      <section aria-labelledby="objectives-title">
        <h2 id="objectives-title" className="text-xl font-semibold text-ink">Objectives</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {packet.learningObjectives.map((objective) => <li key={objective.id} className="card p-4"><p className="text-xs font-semibold uppercase tracking-wide text-teal">{objective.cognitiveLevel}</p><p className="mt-2 text-sm leading-6 text-ink-light">{objective.text}</p></li>)}
        </ul>
      </section>
      <section className="rounded-xl border border-teal/30 bg-teal/5 p-6" aria-labelledby="mental-model-title">
        <h2 id="mental-model-title" className="text-xl font-semibold text-ink">Mental model</h2>
        <p className="mt-3 leading-7 text-ink-light">{packet.mentalModel}</p>
      </section>
      <section aria-labelledby="sections-title">
        <h2 id="sections-title" className="text-xl font-semibold text-ink">Lesson</h2>
        <div className="mt-4 space-y-4">
          {packet.sections.map((section) => section.type === 'concept' ? <article key={section.id} className="card p-6"><h3 className="text-lg font-semibold text-ink">{section.title}</h3><p className="mt-3 leading-7 text-ink-light">{section.body}</p></article> : <article key={section.id} className="card overflow-hidden"><div className="border-b border-paper-warm px-6 py-4"><h3 className="font-semibold text-ink">{section.title}</h3><p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">Display-only example · {section.language}</p></div><pre className="overflow-x-auto bg-code-bg p-6 text-sm leading-7 text-code-text"><code>{section.source}</code></pre>{section.explanation ? <p className="px-6 py-4 text-sm leading-6 text-ink-light">{section.explanation}</p> : null}</article>)}
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6" aria-labelledby="mistakes-title"><h2 id="mistakes-title" className="text-xl font-semibold text-ink">Common mistakes</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-light">{packet.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></div>
        <div className="card p-6" aria-labelledby="summary-title"><h2 id="summary-title" className="text-xl font-semibold text-ink">Summary</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-light">{packet.summary.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
    </div>
  );
}
