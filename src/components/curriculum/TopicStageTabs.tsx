'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { recordLessonCompletion, createTopicProgress } from '@/domain/progression/core';
import type { TopicPacket } from '@/domain/curriculum/packet';
import type { Module, Topic } from '@/domain/curriculum';
import StageTabs, { type StageTabItem } from '@/components/shared/StageTabs';
import InlineMarkdown from '@/components/shared/InlineMarkdown';
import { TopicPacketView } from './TopicPacketView';
import { initialTopicStage, topicStageStates, type TopicStageId } from './stage-state';
import { updateProgress, useProgressState } from '@/components/progress/useProgressState';

const topicTabs: readonly StageTabItem<TopicStageId>[] = [
  { id: 'overview', label: 'Overview', description: 'See the goal' },
  { id: 'learn', label: 'Learn', description: 'Study the explanation' },
  { id: 'practice', label: 'Practice', description: 'Apply the idea' },
  { id: 'check', label: 'Check', description: 'Verify understanding' },
  { id: 'reflect', label: 'Reflect', description: 'Summarize and continue' },
];

export default function TopicStageTabs({ trackSlug, module, topic, packet }: { readonly trackSlug: string; readonly module: Module; readonly topic: Topic; readonly packet: TopicPacket }) {
  const { state, hydrated } = useProgressState();
  const [activeTab, setActiveTab] = useState<TopicStageId>('overview');
  const topicProgress = state.topicProgress[topic.id];
  const nextTopic = module.topics.find((candidate) => candidate.order === topic.order + 1);
  const stageStates = topicStageStates(topicProgress);
  const tabItems = topicTabs.map((tab) => ({ ...tab, ...stageStates.find((stage) => stage.id === tab.id) }));
  const topicHref = `/learn/${trackSlug}/${module.slug}/${topic.slug}`;

  useEffect(() => {
    if (hydrated) setActiveTab(initialTopicStage(state.topicProgress[topic.id]));
  }, [hydrated, state.topicProgress, topic.id]);

  const completeLesson = () => {
    updateProgress((current) => recordLessonCompletion(
      current,
      current.topicProgress[topic.id] ?? createTopicProgress(topic.id, 1, []),
      new Date().toISOString(),
    ));
    setActiveTab('practice');
  };

  return <div className="space-y-5">
    <StageTabs items={tabItems} activeId={activeTab} onChange={setActiveTab} ariaLabel="Topic stages" />

    {activeTab === 'overview' && <section id="stage-panel-overview" role="tabpanel" aria-labelledby="stage-tab-overview" className="card space-y-6 p-6">
      <div>
        <p className="surface-eyebrow">Your outcome</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">{packet.learningObjectives[0] ? <InlineMarkdown text={packet.learningObjectives[0].text} /> : packet.title}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-ink-light"><InlineMarkdown text={packet.whyThisMatters} /></p>
      </div>
      <div className="rounded-xl border border-teal/30 bg-teal/5 p-5" aria-labelledby="mental-model-title">
        <h3 id="mental-model-title" className="font-semibold text-ink">Mental model</h3>
        <p className="mt-2 leading-7 text-ink-light"><InlineMarkdown text={packet.mentalModel} /></p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2" aria-label="Learning objectives">
        {packet.learningObjectives.map((objective) => <li key={objective.id} className="rounded-lg border border-slate-secondary bg-slate p-4 text-sm text-ink-light"><InlineMarkdown text={objective.text} /></li>)}
      </ul>
      <button type="button" className="btn-primary" onClick={() => setActiveTab('learn')}>Continue to Learn</button>
    </section>}

    {activeTab === 'learn' && <section id="stage-panel-learn" role="tabpanel" aria-labelledby="stage-tab-learn" className="space-y-4"><TopicPacketView packet={packet} mode="lesson" /><div className="card flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-semibold text-ink">Ready to practice?</h2><p className="mt-1 text-sm text-ink-light">Mark the lesson complete to unlock the topic practice.</p></div><button type="button" className="btn-primary" onClick={completeLesson}>{topicProgress?.lessonCompleted ? 'Continue to Practice' : 'Complete lesson and continue'}</button></div></section>}

    {activeTab === 'practice' && <section id="stage-panel-practice" role="tabpanel" aria-labelledby="stage-tab-practice" className="card space-y-5 p-6">
      <div><p className="surface-eyebrow">Practice</p><h2 className="mt-2 text-2xl font-bold text-ink">Apply the idea</h2><p className="mt-2 leading-7 text-ink-light">Take the topic quiz, inspect the reasoning, and retry until the model is usable.</p></div>
      <Link href={`${topicHref}/quiz`} className="btn-primary inline-flex w-fit">Start topic practice</Link>
    </section>}

    {activeTab === 'check' && <section id="stage-panel-check" role="tabpanel" aria-labelledby="stage-tab-check" className="card space-y-5 p-6">
      <div><p className="surface-eyebrow">Check</p><h2 className="mt-2 text-2xl font-bold text-ink">Verify your understanding</h2><p className="mt-2 leading-7 text-ink-light">Latest topic result: <strong className="text-ink">{topicProgress?.quizPercent ?? 0}%</strong>. {topicProgress?.status === 'mastered' ? 'Mastery reached.' : 'Review the missed objectives and try again.'}</p></div>
      <div className="flex flex-wrap gap-3"><Link href={`${topicHref}/quiz`} className="btn-primary">Retry practice</Link><Link href="/review" className="btn-secondary">Open review queue</Link></div>
    </section>}

    {activeTab === 'reflect' && <section id="stage-panel-reflect" role="tabpanel" aria-labelledby="stage-tab-reflect" className="card space-y-5 p-6">
      <div><p className="surface-eyebrow">Reflect</p><h2 className="mt-2 text-2xl font-bold text-ink">Topic complete</h2><p className="mt-2 leading-7 text-ink-light">You reached 80% mastery. Use the summary, then choose what comes next.</p></div>
      <p className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm font-semibold text-success" role="status">Topic mastery updated in your dashboard and Progress view.</p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-ink-light">{packet.summary.map((item) => <li key={item}><InlineMarkdown text={item} /></li>)}</ul>
      {nextTopic ? <Link href={`/learn/${trackSlug}/${module.slug}/${nextTopic.slug}`} className="btn-primary inline-flex w-fit">Continue to next topic</Link> : <Link href={`/learn/${trackSlug}/${module.slug}`} className="btn-primary inline-flex w-fit">Return to module</Link>}
    </section>}
  </div>;
}
