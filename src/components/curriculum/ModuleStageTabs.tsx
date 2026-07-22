'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Module, Track } from '@/domain/curriculum';
import { recordReflection } from '@/domain/progression/core';
import StageTabs, { type StageTabItem } from '@/components/shared/StageTabs';
import { buildCanonicalProgress } from '@/components/progress/progress-model';
import { updateProgress, useProgressState } from '@/components/progress/useProgressState';
import PracticeClient from '@/components/practice/PracticeClient';
import type { PracticeSet } from '@/components/practice/types';
import { initialModuleStage, moduleStageStates } from './stage-state';

type ModuleStageId = 'learn' | 'practice' | 'check' | 'reflect';
const moduleTabs: readonly StageTabItem<ModuleStageId>[] = [
  { id: 'learn', label: 'Learn', description: 'Work through topics' },
  { id: 'practice', label: 'Practice', description: 'Strengthen weak spots' },
  { id: 'check', label: 'Check', description: 'Test module mastery' },
  { id: 'reflect', label: 'Reflect', description: 'See what comes next' },
];

export default function ModuleStageTabs({ track, module, practiceSets }: { readonly track: Track; readonly module: Module; readonly practiceSets: readonly PracticeSet[] }) {
  const { state, hydrated } = useProgressState();
  const initialized = useRef(false);
  const [activeTab, setActiveTab] = useState<ModuleStageId>('learn');
  const progress = buildCanonicalProgress(state);
  const moduleSummary = progress.tracks.flatMap((item) => item.modules).find((item) => item.id === module.id);
  const requiredTopics = useMemo(() => module.topics.filter((topic) => topic.required), [module.topics]);
  const practiceCompleted = (state.practiceAttempts ?? []).some((attempt) => attempt.kind === 'module-practice' && attempt.ownerId === module.id);
  const checkAttempted = state.assessmentAttempts.some((attempt) => attempt.assessmentId === module.assessmentId);
  const snapshot = useMemo(() => ({ requiredTopics, state, reviewPercent: moduleSummary?.reviewPercent ?? 0, practiceCompleted, checkAttempted }), [checkAttempted, moduleSummary?.reviewPercent, practiceCompleted, requiredTopics, state]);
  const stageStates = moduleStageStates(snapshot);
  const tabItems = moduleTabs.map((tab) => ({ ...tab, ...stageStates.find((stage) => stage.id === tab.id) }));
  const nextTopic = module.topics.find((topic) => topic.required && (state.topicProgress[topic.id]?.masteryPercent ?? 0) < 80);
  const practicedTopics = practiceSets.filter((set) => state.topicProgress[set.ownerId]?.lessonCompleted === true);
  const modulePractice: PracticeSet = { ownerId: module.id, kind: 'module-practice', trackId: track.slug as PracticeSet['trackId'], title: `${module.title} practice`, questions: practicedTopics.flatMap((set) => set.questions).slice(0, 8) };

  useEffect(() => {
    if (hydrated && !initialized.current) {
      initialized.current = true;
      setActiveTab(initialModuleStage(snapshot));
    }
  }, [hydrated, snapshot]);

  return <div className="space-y-5">
    <StageTabs items={tabItems} activeId={activeTab} onChange={setActiveTab} ariaLabel="Module stages" />

    {activeTab === 'learn' && <section id="stage-panel-learn" role="tabpanel" aria-labelledby="stage-tab-learn" className="space-y-4"><div className="card flex flex-wrap items-end justify-between gap-4 p-6"><div><p className="surface-eyebrow">Module goal</p><h2 className="mt-2 text-2xl font-bold text-ink">Build connected understanding</h2><p className="mt-2 max-w-2xl leading-7 text-ink-light">Complete the topic path, strengthen weak spots in Practice, then take the module Check at 80%.</p></div><p className="text-sm text-ink-muted">{moduleSummary?.masteredTopicCount ?? 0}/{moduleSummary?.requiredTopicCount ?? requiredTopics.length} required topics mastered</p></div><ol className="grid gap-4 md:grid-cols-2" aria-label={`${module.title} topics`}>{module.topics.map((topic) => { const topicProgress = state.topicProgress[topic.id]; const mastered = (topicProgress?.masteryPercent ?? 0) >= 80; return <li key={topic.id}><Link href={`/learn/${track.slug}/${module.slug}/${topic.slug}`} className="card block h-full p-5 transition-colors hover:border-teal/50"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-paper-warm bg-slate-secondary px-2.5 py-1 text-xs font-semibold text-ink-light">Topic {topic.order}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${mastered ? 'border-success/40 bg-success/10 text-success' : topic.required ? 'border-teal/40 bg-teal/10 text-teal-dark' : 'border-paper-warm bg-slate-secondary text-ink-light'}`}>{mastered ? 'Mastered' : topic.required ? 'Required' : 'Optional'}</span></div><h3 className="mt-3 font-semibold text-ink">{topic.title}</h3><p className="mt-2 text-sm text-ink-light">{topic.estimatedMinutes} min · Difficulty {topic.difficulty}</p><p className="mt-3 text-xs font-semibold text-ink-muted">{mastered ? 'Done' : topicProgress?.lessonCompleted ? 'Practice next' : 'Ready to learn'}</p></Link></li>; })}</ol></section>}

    {activeTab === 'practice' && <section id="stage-panel-practice" role="tabpanel" aria-labelledby="stage-tab-practice">{modulePractice.questions.length ? <PracticeClient set={modulePractice} backHref={`/learn/${track.slug}/${module.slug}`} /> : <div className="card space-y-4 p-6"><h2 className="text-2xl font-bold text-ink">Start with Learn</h2><p className="leading-7 text-ink-light">Complete at least one topic lesson to assemble module Practice.</p>{nextTopic && <Link href={`/learn/${track.slug}/${module.slug}/${nextTopic.slug}`} className="btn-primary inline-flex w-fit">Open {nextTopic.title}</Link>}</div>}</section>}

    {activeTab === 'check' && <section id="stage-panel-check" role="tabpanel" aria-labelledby="stage-tab-check" className="card space-y-5 p-6"><div><p className="surface-eyebrow">Check</p><h2 className="mt-2 text-2xl font-bold text-ink">Test module mastery</h2><p className="mt-2 leading-7 text-ink-light">All required topics must be mastered before the module Check opens. Your module score is currently {moduleSummary?.reviewPercent ?? 0}%.</p></div><Link href={`/assessments/module/${module.id}`} className="btn-primary inline-flex w-fit">{checkAttempted ? 'Retry module Check' : 'Open module Check'}</Link></section>}

    {activeTab === 'reflect' && <ModuleReflectionPanel module={module} track={track} moduleSummary={moduleSummary} nextTopic={nextTopic} />}
  </div>;
}

function ModuleReflectionPanel({ module, track, moduleSummary, nextTopic }: { readonly module: Module; readonly track: Track; readonly moduleSummary: ReturnType<typeof buildCanonicalProgress>['tracks'][number]['modules'][number] | undefined; readonly nextTopic: Module['topics'][number] | undefined }) {
  const [retrieval, setRetrieval] = useState('');
  const [application, setApplication] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [saved, setSaved] = useState(false);
  const save = () => { const submittedAt = new Date().toISOString(); updateProgress((state) => recordReflection(state, { id: `reflection-${module.id}`, ownerId: module.id, kind: 'module-reflection', retrieval, application, confidence, submittedAt })); setSaved(true); };
  return <section id="stage-panel-reflect" role="tabpanel" aria-labelledby="stage-tab-reflect" className="card space-y-5 p-6"><div><p className="surface-eyebrow">Reflect</p><h2 className="mt-2 text-2xl font-bold text-ink">Turn the module into a working model</h2><p className="mt-2 leading-7 text-ink-light">Review your {moduleSummary?.reviewPercent ?? 0}% Check result, name the connection you can now explain, and choose your next action.</p></div><p className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm font-semibold text-success" role="status">Module Check submitted. Capture the takeaway that will help you use it later.</p><div className="space-y-4"><label className="block"><span className="font-semibold text-ink">Key takeaway</span><span className="mt-1 block text-sm leading-6 text-ink-light">What is the most important connection across this module?</span><textarea dir="auto" value={retrieval} onChange={(event) => setRetrieval(event.target.value)} className="mt-2 min-h-24 w-full rounded-lg border border-slate-secondary bg-slate-secondary p-3 text-sm text-white" /></label><label className="block"><span className="font-semibold text-ink">Next application</span><span className="mt-1 block text-sm leading-6 text-ink-light">Where will you apply this model in a project or code review?</span><textarea dir="auto" value={application} onChange={(event) => setApplication(event.target.value)} className="mt-2 min-h-24 w-full rounded-lg border border-slate-secondary bg-slate-secondary p-3 text-sm text-white" /></label><label className="block"><span className="font-semibold text-ink">Confidence: {confidence} of 5</span><input type="range" min="1" max="5" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} className="mt-3 w-full accent-teal" /></label></div><div className="flex flex-wrap gap-3"><button type="button" className="btn-secondary" onClick={save}>{saved ? 'Reflection saved' : 'Save reflection'}</button>{nextTopic ? <Link href={`/learn/${track.slug}/${module.slug}/${nextTopic.slug}`} className="btn-primary">Practice {nextTopic.title}</Link> : <Link href={`/assessments/cumulative/${track.slug}`} className="btn-primary">Open track review</Link>}</div></section>;
}
