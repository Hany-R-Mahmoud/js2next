'use client';

import Link from 'next/link';
import { useState } from 'react';
import StageTabs from '@/components/shared/StageTabs';
import type { Module, Track } from '@/domain/curriculum';

type ModuleTab = 'learn' | 'challenge' | 'review' | 'reflect';

const moduleTabs = [
  { id: 'learn', label: 'Learn', description: 'Work through the topics' },
  { id: 'challenge', label: 'Challenge', description: 'Check module mastery' },
  { id: 'review', label: 'Review', description: 'Repair weak spots' },
  { id: 'reflect', label: 'Reflect', description: 'See what comes next' },
] as const;

export default function ModuleStageTabs({ track, module }: { readonly track: Track; readonly module: Module }) {
  const [activeTab, setActiveTab] = useState<ModuleTab>('learn');

  return <div className="space-y-5">
    <StageTabs items={moduleTabs} activeId={activeTab} onChange={setActiveTab} ariaLabel="Module stages" />

    {activeTab === 'learn' && <section id="module-panel-learn" role="tabpanel" aria-labelledby="stage-tab-learn" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Topic path</h2>
          <p className="mt-1 text-sm text-ink-light">Read each topic in order. Prerequisite guidance is a soft warning.</p>
        </div>
        <span className="text-sm text-ink-muted">{module.topics.length} topics</span>
      </div>
      <ol className="grid gap-4 md:grid-cols-2" aria-label={`${module.title} topics`}>
        {module.topics.map((topic) => <li key={topic.id}><Link href={`/learn/${track.slug}/${module.slug}/${topic.slug}`} className="card block h-full p-5 transition-colors hover:border-teal/50"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-paper-warm bg-slate-secondary px-2.5 py-1 text-xs font-semibold text-ink-light">Topic {topic.order}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${topic.required ? 'border-teal/40 bg-teal/10 text-teal-dark' : 'border-paper-warm bg-slate-secondary text-ink-light'}`}>{topic.required ? 'Required' : 'Optional'}</span>{topic.advanced ? <span className="rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">Advanced</span> : null}</div><h3 className="mt-3 font-semibold text-ink">{topic.title}</h3><p className="mt-2 text-sm text-ink-light">{topic.estimatedMinutes} min · Difficulty {topic.difficulty}</p></Link></li>)}
      </ol>
    </section>}

    {activeTab === 'challenge' && <section id="module-panel-challenge" role="tabpanel" aria-labelledby="stage-tab-challenge" className="card space-y-5 p-6">
      <div>
        <p className="surface-eyebrow">Module challenge</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Check the whole module</h2>
        <p className="mt-2 max-w-2xl leading-7 text-ink-light">Use the module review to test connected understanding across its topics. You can retry it without losing earlier evidence.</p>
      </div>
      <Link href={`/assessments/module/${module.id}`} className="btn-primary inline-flex w-fit">Open module challenge</Link>
    </section>}

    {activeTab === 'review' && <section id="module-panel-review" role="tabpanel" aria-labelledby="stage-tab-review" className="card space-y-5 p-6">
      <div>
        <p className="surface-eyebrow">Targeted review</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Return to missed objectives</h2>
        <p className="mt-2 max-w-2xl leading-7 text-ink-light">Assessment misses become local review items. Use the queue to focus on the ideas that need another pass.</p>
      </div>
      <Link href="/review" className="btn-primary inline-flex w-fit">Open review queue</Link>
    </section>}

    {activeTab === 'reflect' && <section id="module-panel-reflect" role="tabpanel" aria-labelledby="stage-tab-reflect" className="card space-y-5 p-6">
      <div>
        <p className="surface-eyebrow">Path ahead</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">See where this module leads</h2>
        <p className="mt-2 max-w-2xl leading-7 text-ink-light">When this module feels solid, continue to the next module in the track or revisit any topic from the Learn tab.</p>
      </div>
      {track.modules.find((candidate) => candidate.order === module.order + 1) ? <Link href={`/learn/${track.slug}/${track.modules.find((candidate) => candidate.order === module.order + 1)?.slug ?? ''}`} className="btn-primary inline-flex w-fit">Continue to next module</Link> : <Link href={`/assessments/cumulative/${track.slug}`} className="btn-primary inline-flex w-fit">Open track review</Link>}
    </section>}
  </div>;
}
