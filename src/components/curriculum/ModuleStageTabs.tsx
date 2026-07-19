'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Module, Track } from '@/domain/curriculum';
import StageTabs, { type StageTabItem } from '@/components/shared/StageTabs';
import { buildCanonicalProgress } from '@/components/progress/progress-model';
import { useProgressState } from '@/components/progress/useProgressState';
import { initialModuleStage, moduleStageStates, nextRequiredTopic } from './stage-state';

type ModuleStageId = 'overview' | 'learn' | 'practice' | 'check' | 'reflect';

const moduleTabs: readonly StageTabItem<ModuleStageId>[] = [
  { id: 'overview', label: 'Overview', description: 'See the module goal' },
  { id: 'learn', label: 'Learn', description: 'Work through topics' },
  { id: 'practice', label: 'Practice', description: 'Strengthen weak spots' },
  { id: 'check', label: 'Check', description: 'Test module mastery' },
  { id: 'reflect', label: 'Reflect', description: 'See what comes next' },
];

export default function ModuleStageTabs({ track, module }: { readonly track: Track; readonly module: Module }) {
  const { state, hydrated } = useProgressState();
  const [activeTab, setActiveTab] = useState<ModuleStageId>('overview');
  const progress = buildCanonicalProgress(state);
  const moduleSummary = progress.tracks.flatMap((item) => item.modules).find((item) => item.id === module.id);
  const requiredTopics = module.topics.filter((topic) => topic.required);
  const snapshot = { requiredTopics, state, reviewPercent: moduleSummary?.reviewPercent ?? 0 };
  const stageStates = moduleStageStates(snapshot);
  const tabItems = moduleTabs.map((tab) => ({ ...tab, ...stageStates.find((stage) => stage.id === tab.id) }));
  const nextTopic = nextRequiredTopic(module, state);

  useEffect(() => {
    if (hydrated) setActiveTab(initialModuleStage({ requiredTopics, state, reviewPercent: moduleSummary?.reviewPercent ?? 0 }));
  }, [hydrated, module.id, moduleSummary?.reviewPercent, requiredTopics, state]);

  return <div className="space-y-5">
    <StageTabs items={tabItems} activeId={activeTab} onChange={setActiveTab} ariaLabel="Module stages" />

    {activeTab === 'overview' && <section id="stage-panel-overview" role="tabpanel" aria-labelledby="stage-tab-overview" className="card space-y-5 p-6">
      <div><p className="surface-eyebrow">Module overview</p><h2 className="mt-2 text-2xl font-bold text-ink">Build connected understanding</h2><p className="mt-2 max-w-2xl leading-7 text-ink-light">Complete the required topics, then pass the module check at 80% to finish this module.</p></div>
      <div className="rounded-lg border border-teal/30 bg-teal/5 p-4 text-sm text-ink-light"><strong className="text-ink">Progress:</strong> {moduleSummary?.masteredTopicCount ?? 0}/{moduleSummary?.requiredTopicCount ?? requiredTopics.length} required topics mastered · Module check {moduleSummary?.reviewPercent ?? 0}%</div>
      <button type="button" className="btn-primary w-fit" onClick={() => setActiveTab('learn')}>Continue to Learn</button>
    </section>}

    {activeTab === 'learn' && <section id="stage-panel-learn" role="tabpanel" aria-labelledby="stage-tab-learn" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold text-ink">Topic path</h2><p className="mt-1 text-sm text-ink-light">Read each topic in order and follow the stage guidance inside it.</p></div><span className="text-sm text-ink-muted">{module.topics.length} topics</span></div>
      <ol className="grid gap-4 md:grid-cols-2" aria-label={`${module.title} topics`}>
        {module.topics.map((topic) => { const topicProgress = state.topicProgress[topic.id]; const mastered = (topicProgress?.masteryPercent ?? 0) >= 80; return <li key={topic.id}><Link href={`/learn/${track.slug}/${module.slug}/${topic.slug}`} className="card block h-full p-5 transition-colors hover:border-teal/50"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-paper-warm bg-slate-secondary px-2.5 py-1 text-xs font-semibold text-ink-light">Topic {topic.order}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${mastered ? 'border-success/40 bg-success/10 text-success' : topic.required ? 'border-teal/40 bg-teal/10 text-teal-dark' : 'border-paper-warm bg-slate-secondary text-ink-light'}`}>{mastered ? 'Mastered' : topic.required ? 'Required' : 'Optional'}</span></div><h3 className="mt-3 font-semibold text-ink">{topic.title}</h3><p className="mt-2 text-sm text-ink-light">{topic.estimatedMinutes} min · Difficulty {topic.difficulty}</p><p className="mt-3 text-xs font-semibold text-ink-muted">{mastered ? 'Done' : topicProgress?.lessonCompleted ? 'Practice next' : 'Ready to learn'}</p></Link></li>; })}
      </ol>
    </section>}

    {activeTab === 'practice' && <section id="stage-panel-practice" role="tabpanel" aria-labelledby="stage-tab-practice" className="card space-y-5 p-6">
      <div><p className="surface-eyebrow">Practice</p><h2 className="mt-2 text-2xl font-bold text-ink">Strengthen the remaining topics</h2><p className="mt-2 leading-7 text-ink-light">Return to the next required topic that is not yet mastered.</p></div>
      {nextTopic ? <Link href={`/learn/${track.slug}/${module.slug}/${nextTopic.slug}`} className="btn-primary inline-flex w-fit">Continue with {nextTopic.title}</Link> : <button type="button" className="btn-primary w-fit" onClick={() => setActiveTab('check')}>Continue to Check</button>}
    </section>}

    {activeTab === 'check' && <section id="stage-panel-check" role="tabpanel" aria-labelledby="stage-tab-check" className="card space-y-5 p-6">
      <div><p className="surface-eyebrow">Check</p><h2 className="mt-2 text-2xl font-bold text-ink">Test module mastery</h2><p className="mt-2 leading-7 text-ink-light">All required topics are mastered. Take the module assessment and reach 80% to complete it.</p></div>
      <Link href={`/assessments/module/${module.id}`} className="btn-primary inline-flex w-fit">Open module check</Link>
    </section>}

    {activeTab === 'reflect' && <section id="stage-panel-reflect" role="tabpanel" aria-labelledby="stage-tab-reflect" className="card space-y-5 p-6">
      <div><p className="surface-eyebrow">Reflect</p><h2 className="mt-2 text-2xl font-bold text-ink">Module complete</h2><p className="mt-2 leading-7 text-ink-light">All required topics are mastered and the module check reached 80%.</p></div>
      <p className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm font-semibold text-success" role="status">Module progress is updated in Home and Progress.</p>
      {track.modules.find((candidate) => candidate.order === module.order + 1) ? <Link href={`/learn/${track.slug}/${track.modules.find((candidate) => candidate.order === module.order + 1)?.slug ?? ''}`} className="btn-primary inline-flex w-fit">Continue to next module</Link> : <Link href={`/assessments/cumulative/${track.slug}`} className="btn-primary inline-flex w-fit">Open track review</Link>}
    </section>}
  </div>;
}
