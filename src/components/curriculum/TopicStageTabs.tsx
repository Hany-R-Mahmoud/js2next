'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { recordLessonCompletion, recordReflection, createTopicProgress } from '@/domain/progression/core';
import type { TopicPacket } from '@/domain/curriculum/packet';
import type { Module, Topic } from '@/domain/curriculum';
import StageTabs, { type StageTabItem } from '@/components/shared/StageTabs';
import InlineMarkdown from '@/components/shared/InlineMarkdown';
import { TopicPacketView } from './TopicPacketView';
import { initialTopicStage, topicStageStates, type TopicStageId } from './stage-state';
import { updateProgress, useProgressState } from '@/components/progress/useProgressState';
import PracticeClient from '@/components/practice/PracticeClient';
import type { PracticeSet } from '@/components/practice/types';

const topicTabs: readonly StageTabItem<TopicStageId>[] = [
  { id: 'learn', label: 'Learn', description: 'Build the model' },
  { id: 'practice', label: 'Practice', description: 'Apply the idea' },
  { id: 'check', label: 'Check', description: 'Verify understanding' },
  { id: 'reflect', label: 'Reflect', description: 'Choose what comes next' },
];

export default function TopicStageTabs({ trackSlug, module, topic, packet, practiceSet }: { readonly trackSlug: string; readonly module: Module; readonly topic: Topic; readonly packet: TopicPacket; readonly practiceSet: PracticeSet }) {
  const { state, hydrated } = useProgressState();
  const initialized = useRef(false);
  const [activeTab, setActiveTab] = useState<TopicStageId>('learn');
  const topicProgress = state.topicProgress[topic.id];
  const practiceCompleted = (state.practiceAttempts ?? []).some((attempt) => attempt.kind === 'topic-practice' && attempt.ownerId === topic.id);
  const nextTopic = module.topics.find((candidate) => candidate.order === topic.order + 1);
  const stageStates = topicStageStates(topicProgress, practiceCompleted);
  const tabItems = topicTabs.map((tab) => ({ ...tab, ...stageStates.find((stage) => stage.id === tab.id) }));
  const topicHref = `/learn/${trackSlug}/${module.slug}/${topic.slug}`;

  useEffect(() => {
    if (hydrated && !initialized.current) {
      initialized.current = true;
      setActiveTab(initialTopicStage(topicProgress, practiceCompleted));
    }
  }, [hydrated, topicProgress, practiceCompleted]);

  const completeLesson = () => {
    updateProgress((current) => recordLessonCompletion(current, current.topicProgress[topic.id] ?? createTopicProgress(topic.id, 2, []), new Date().toISOString()));
    setActiveTab('practice');
  };

  return <div className="space-y-5">
    <StageTabs items={tabItems} activeId={activeTab} onChange={setActiveTab} ariaLabel="Topic stages" />

    {activeTab === 'learn' && <section id="stage-panel-learn" role="tabpanel" aria-labelledby="stage-tab-learn" className="space-y-4">
      <section className="card space-y-5 p-6" aria-labelledby="learn-outcome-title"><div><p className="surface-eyebrow">Your outcome</p><h2 id="learn-outcome-title" className="mt-2 text-2xl font-bold text-ink">{packet.learningObjectives[0] ? <InlineMarkdown text={packet.learningObjectives[0].text} /> : packet.title}</h2><p className="mt-3 max-w-2xl leading-7 text-ink-light"><InlineMarkdown text={packet.whyThisMatters} /></p></div><div className="rounded-xl border border-teal/30 bg-teal/5 p-5"><h3 className="font-semibold text-ink">Mental model</h3><p className="mt-2 leading-7 text-ink-light"><InlineMarkdown text={packet.mentalModel} /></p></div><ul className="grid gap-3 sm:grid-cols-2" aria-label="Learning objectives">{packet.learningObjectives.map((objective) => <li key={objective.id} className="rounded-lg border border-slate-secondary bg-slate p-4 text-sm text-ink-light"><InlineMarkdown text={objective.text} /></li>)}</ul></section>
      <TopicPacketView packet={packet} mode="lesson" />
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-semibold text-ink">Ready for Practice?</h2><p className="mt-1 text-sm text-ink-light">Complete the Learn stage to unlock guided Practice.</p></div><button type="button" className="btn-primary" onClick={completeLesson}>{topicProgress?.lessonCompleted ? 'Open Practice' : 'Complete Learn and open Practice'}</button></div>
    </section>}

    {activeTab === 'practice' && <section id="stage-panel-practice" role="tabpanel" aria-labelledby="stage-tab-practice"><PracticeClient set={practiceSet} backHref={topicHref} /></section>}

    {activeTab === 'check' && <section id="stage-panel-check" role="tabpanel" aria-labelledby="stage-tab-check" className="card space-y-5 p-6"><div><p className="surface-eyebrow">Check</p><h2 className="mt-2 text-2xl font-bold text-ink">Verify your understanding</h2><p className="mt-2 leading-7 text-ink-light">This scored Check uses new questions and a mastery threshold of 80%. {topicProgress?.quizAttempts.length ? <>Latest result: <strong className="text-ink">{topicProgress.quizPercent}%</strong>.</> : 'Submit a Check when you are ready to measure your understanding.'}</p></div><Link href={`${topicHref}/quiz`} className="btn-primary inline-flex w-fit">{topicProgress?.quizAttempts.length ? 'Retry topic Check' : 'Start topic Check'}</Link></section>}

    {activeTab === 'reflect' && <ReflectionPanel topic={topic} packet={packet} nextTopic={nextTopic} trackSlug={trackSlug} module={module} mastered={(topicProgress?.masteryPercent ?? 0) >= 80} />}
  </div>;
}

function ReflectionPanel({ topic, packet, nextTopic, trackSlug, module, mastered }: { readonly topic: Topic; readonly packet: TopicPacket; readonly nextTopic: Topic | undefined; readonly trackSlug: string; readonly module: Module; readonly mastered: boolean }) {
  const [retrieval, setRetrieval] = useState('');
  const [application, setApplication] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [saved, setSaved] = useState(false);
  const save = () => { const submittedAt = new Date().toISOString(); updateProgress((state) => recordReflection(state, { id: `reflection-${topic.id}`, ownerId: topic.id, kind: 'topic-reflection', retrieval, application, confidence, submittedAt })); setSaved(true); };
  return <section id="stage-panel-reflect" role="tabpanel" aria-labelledby="stage-tab-reflect" className="card space-y-5 p-6"><div><p className="surface-eyebrow">Reflect</p><h2 className="mt-2 text-2xl font-bold text-ink">{mastered ? 'Make the idea yours' : 'Find the next useful step'}</h2><p className="mt-2 leading-7 text-ink-light">{mastered ? 'Retrieve the model without looking back, then connect it to a real development decision.' : 'Your Check result points to a few areas worth practising again.'}</p></div>{!mastered && <p className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-ink-light">Review the missed objectives in Practice, then retry Check when you are ready.</p>}<div className="space-y-4"><label className="block"><span className="font-semibold text-ink">Recall prompt</span><span className="mt-1 block text-sm leading-6 text-ink-light">Without reopening the lesson, explain the central idea in {packet.title} and one example that would prove you understand it.</span><textarea dir="auto" value={retrieval} onChange={(event) => setRetrieval(event.target.value)} className="mt-2 min-h-24 w-full rounded-lg border border-slate-secondary bg-slate-secondary p-3 text-sm text-white" /></label><label className="block"><span className="font-semibold text-ink">Application note</span><span className="mt-1 block text-sm leading-6 text-ink-light">Where could you apply this model in a project?</span><textarea dir="auto" value={application} onChange={(event) => setApplication(event.target.value)} className="mt-2 min-h-24 w-full rounded-lg border border-slate-secondary bg-slate-secondary p-3 text-sm text-white" /></label><label className="block"><span className="font-semibold text-ink">Confidence: {confidence} of 5</span><input type="range" min="1" max="5" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} className="mt-3 w-full accent-teal" /></label></div><div className="flex flex-wrap gap-3"><button type="button" className="btn-secondary" onClick={save}>{saved ? 'Reflection saved' : 'Save reflection'}</button>{nextTopic ? <Link href={`/learn/${trackSlug}/${module.slug}/${nextTopic.slug}`} className="btn-primary">Continue to next topic</Link> : <Link href={`/learn/${trackSlug}/${module.slug}`} className="btn-primary">Return to module</Link>}</div></section>;
}
