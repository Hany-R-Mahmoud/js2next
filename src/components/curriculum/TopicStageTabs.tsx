'use client';

import Link from 'next/link';
import { useState } from 'react';
import StageTabs from '@/components/shared/StageTabs';
import type { TopicPacket } from '@/domain/curriculum/packet';
import type { Module, Topic } from '@/domain/curriculum';
import { TopicPacketView } from './TopicPacketView';

type TopicTab = 'overview' | 'learn' | 'practice' | 'review' | 'reflect';

const topicTabs = [
  { id: 'overview', label: 'Overview', description: 'See the outcome' },
  { id: 'learn', label: 'Learn', description: 'Read the model' },
  { id: 'practice', label: 'Apply', description: 'Take the challenge' },
  { id: 'review', label: 'Review', description: 'Repair weak spots' },
  { id: 'reflect', label: 'Reflect', description: 'Make it yours' },
] as const;

interface TopicStageTabsProps {
  readonly trackSlug: string;
  readonly module: Module;
  readonly topic: Topic;
  readonly packet: TopicPacket;
}

export default function TopicStageTabs({ trackSlug, module, topic, packet }: TopicStageTabsProps) {
  const [activeTab, setActiveTab] = useState<TopicTab>('overview');
  const topicHref = `/learn/${trackSlug}/${module.slug}/${topic.slug}`;
  const nextTopic = module.topics.find((candidate) => candidate.order === topic.order + 1);

  return <div className="space-y-5">
    <StageTabs items={topicTabs} activeId={activeTab} onChange={setActiveTab} ariaLabel="Topic stages" />

    {activeTab === 'overview' && <section id="stage-panel-overview" role="tabpanel" aria-labelledby="stage-tab-overview" className="card space-y-6 p-6">
      <div>
        <p className="surface-eyebrow">Your outcome</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">{packet.learningObjectives[0]?.text ?? packet.title}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-ink-light">{packet.whyThisMatters}</p>
      </div>
      <div className="rounded-xl border border-teal/30 bg-teal/5 p-5" aria-labelledby="mental-model-title">
        <h3 id="mental-model-title" className="font-semibold text-ink">Mental model</h3>
        <p className="mt-2 leading-7 text-ink-light">{packet.mentalModel}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2" aria-label="Learning objectives">
        {packet.learningObjectives.map((objective) => <li key={objective.id} className="rounded-lg border border-slate-secondary bg-slate p-4 text-sm text-ink-light">{objective.text}</li>)}
      </ul>
      <button type="button" className="btn-primary" onClick={() => setActiveTab('learn')}>Start the explanation</button>
    </section>}

    {activeTab === 'learn' && <section id="stage-panel-learn" role="tabpanel" aria-labelledby="stage-tab-learn" className="space-y-4"><TopicPacketView packet={packet} mode="lesson" /></section>}

    {activeTab === 'practice' && <section id="stage-panel-practice" role="tabpanel" aria-labelledby="stage-tab-practice" className="card space-y-5 p-6">
      <div>
        <p className="surface-eyebrow">Applied practice</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Use the idea in a real decision</h2>
        <p className="mt-2 leading-7 text-ink-light">Take the topic quiz, inspect the reasoning, and retry until the model is usable.</p>
      </div>
      <Link href={`${topicHref}/quiz`} className="btn-primary inline-flex w-fit">Open topic challenge</Link>
    </section>}

    {activeTab === 'review' && <section id="stage-panel-review" role="tabpanel" aria-labelledby="stage-tab-review" className="card space-y-5 p-6">
      <div>
        <p className="surface-eyebrow">Transfer check</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Review what needs another look</h2>
        <p className="mt-2 leading-7 text-ink-light">Use targeted review for missed objectives, or take the full module review when you are ready.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/review" className="btn-primary">Open review queue</Link>
        <Link href={`/assessments/module/${module.id}`} className="btn-secondary">Review this module</Link>
      </div>
    </section>}

    {activeTab === 'reflect' && <section id="stage-panel-reflect" role="tabpanel" aria-labelledby="stage-tab-reflect" className="card space-y-5 p-6">
      <div>
        <p className="surface-eyebrow">Make it yours</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">Carry the idea into the next topic</h2>
        <p className="mt-2 leading-7 text-ink-light">Read the summary, name the mistake you want to avoid, then continue when you are ready.</p>
      </div>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-ink-light">{packet.summary.map((item) => <li key={item}>{item}</li>)}</ul>
      {nextTopic ? <Link href={`/learn/${trackSlug}/${module.slug}/${nextTopic.slug}`} className="btn-primary inline-flex w-fit">Continue to next topic</Link> : <Link href={`/learn/${trackSlug}/${module.slug}`} className="btn-primary inline-flex w-fit">Return to module</Link>}
    </section>}
  </div>;
}
