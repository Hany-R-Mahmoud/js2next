'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { topicBundles, getTopicBundle } from '@/content/topics';
import { topicFamilyMeta } from '@/data/curriculum';
import CodeBlock from '@/components/shared/CodeBlock';
import ChallengeAnswerForm from '@/components/shared/ChallengeAnswerForm';
import KnowledgeCheckForm from '@/components/shared/KnowledgeCheckForm';
import LessonExtras from '@/components/shared/LessonExtras';
import StageTabs from '@/components/shared/StageTabs';
import SurfaceHeader from '@/components/shared/SurfaceHeader';
import SourceAttribution from '@/components/shared/SourceAttribution';
import { challengeContentId, getChallengeLessonSectionId } from '@/lib/content/identity';
import { contentCatalog } from '@/lib/content/catalog';
import { unmetPrerequisites } from '@/lib/learning/prerequisites';
import { recommendNextContent } from '@/lib/learning/recommendations';
import { capabilityDefinitions } from '@/lib/learning/capabilities';
import type { ChallengeAttempt, LessonProgress, TopicLoopStage, TopicProgress } from '@/lib/learning/types';
import { useLearnerStore } from '@/stores/learner';
import type { Challenge, LessonSection } from '@/types';

type TopicTab = 'overview' | 'learn' | 'practice' | 'review' | 'reflect' | 'complete';

const topicTabs = [
  { id: 'overview', label: 'Overview', description: 'See the outcome' },
  { id: 'learn', label: 'Learn', description: 'Read the model' },
  { id: 'practice', label: 'Apply', description: 'Make a decision' },
  { id: 'review', label: 'Review', description: 'Transfer the idea' },
  { id: 'reflect', label: 'Reflect', description: 'Make it yours' },
] as const;

export default function TopicPage() {
  const params = useParams<{ slug: string }>();
  const bundle = getTopicBundle(params.slug);
  const { canonicalProfile, recordChallengeAttempt, saveLessonProgress, saveTopicProgress, confirmQa, setManualReview, completeTopic } = useLearnerStore();
  const [hydrated, setHydrated] = useState(false);
  const progress = bundle ? canonicalProfile.topicProgress?.[bundle.id] : undefined;
  const lessonProgress = bundle ? canonicalProfile.lessonProgress?.[bundle.id] : undefined;
  const [activeTab, setActiveTab] = useState<TopicTab>('overview');
  const [lessonSectionIndex, setLessonSectionIndex] = useState(0);
  const [hintStages, setHintStages] = useState<Readonly<Record<string, number>>>({});
  const [reflection, setReflection] = useState('');
  const initializedTopicId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const persist = useLearnerStore.persist;
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hydrated || !bundle || initializedTopicId.current === bundle.id) return;
    initializedTopicId.current = bundle.id;
    setActiveTab(progress?.stage === 'complete' ? 'complete' : progress?.reflectStarted ? 'reflect' : progress?.stage === 'confirm' ? 'review' : progress?.stage === 'practice' ? 'practice' : progress?.stage === 'learn' ? 'learn' : 'overview');
    setReflection(lessonProgress?.reflection ?? '');
  }, [bundle, hydrated, lessonProgress?.reflection, progress?.reflectStarted, progress?.stage]);

  const prerequisites = bundle ? unmetPrerequisites(bundle.lesson.prerequisites, canonicalProfile.masteryRecords) : [];
  const practiceChallenges = bundle?.challenges.slice(0, 3) ?? [];
  const reviewQuestions = bundle?.qa.slice(0, 5) ?? [];
  const requiredChallenges = 1;
  const requiredQuestions = 3;
  const completedChallenges = progress?.completedChallengeIds ?? [];
  const savedPracticeIds = progress?.savedPracticeIds ?? [];
  const confirmedQuestions = progress?.confirmedQaIds ?? [];
  const completedPractice = practiceChallenges.length >= requiredChallenges && practiceChallenges.some((challenge) => {
    const challengeId = challengeContentId(challenge.slug);
    return completedChallenges.includes(challengeId) || savedPracticeIds.includes(challengeId);
  });
  const completedReview = reviewQuestions.length >= requiredQuestions && confirmedQuestions.length >= requiredQuestions;
  const nextRecommendation = recommendNextContent(canonicalProfile, contentCatalog);
  const nextBundle = nextRecommendation ? topicBundles.find((candidate) => candidate.id === nextRecommendation.topicId && candidate.id !== bundle?.id) : undefined;
  const topicCapabilities = capabilityDefinitions.filter((definition) => canonicalProfile.earnedCapabilities.includes(definition.id) && definition.requiredTopicIds.includes(bundle?.id ?? ''));
  const relatedTopics = useMemo(
    () => topicBundles.filter((candidate) => candidate.meta.topicFamily === bundle?.meta.topicFamily && candidate.id !== bundle?.id).slice(0, 3),
    [bundle?.id, bundle?.meta.topicFamily],
  );

  if (!bundle) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Topic not found</h1>
        <Link href="/home" className="btn-primary mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  if (!hydrated) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-sm text-ink-muted">Loading topic…</p></div>;
  }

  if (prerequisites.length > 0) {
    return (
      <div className="mx-auto max-w-2xl card p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Prerequisite</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Build the foundation first</h1>
        <p className="mt-2 text-ink-light">Complete these topics at 80% mastery before starting {bundle.lesson.title}.</p>
        <ul className="mt-4 space-y-1 text-sm text-ink-light">
          {prerequisites.map((topicId) => <li key={topicId}><Link className="text-teal hover:underline" href={`/topic/${topicId}`}>{topicId}</Link></li>)}
        </ul>
        <Link href="/home" className="btn-secondary mt-6 inline-block">Back to topic map</Link>
      </div>
    );
  }

  const canVisitTab = (tab: TopicTab): boolean => {
    if (tab === 'overview' || tab === 'learn') return true;
    if (tab === 'practice') return progress?.stage !== undefined && progress.stage !== 'learn';
    if (tab === 'review') return completedPractice || progress?.stage === 'confirm' || progress?.stage === 'complete';
    if (tab === 'reflect') return completedReview || progress?.stage === 'complete';
    return progress?.stage === 'complete';
  };

  const saveStage = (stage: TopicLoopStage) => {
    const isForwardTransition = (stage === 'practice' && activeTab === 'learn') || (stage === 'confirm' && activeTab === 'practice');
    if (stage !== 'learn' && !isForwardTransition && !canVisitTab(stage === 'confirm' ? 'review' : stage)) return;
    const now = new Date().toISOString();
    saveTopicProgress({
      topicId: bundle.id,
      stage,
      completedChallengeIds: progress?.completedChallengeIds ?? [],
      confirmedQaIds: progress?.confirmedQaIds ?? [],
      manualReview: progress?.manualReview ?? false,
      lastVisited: now,
    });
    setActiveTab(stage === 'confirm' ? 'review' : stage);
  };

  const activateTab = (tab: TopicTab) => {
    const isForwardTransition = (tab === 'practice' && activeTab === 'learn') || (tab === 'review' && activeTab === 'practice');
    if (!canVisitTab(tab) && !isForwardTransition) return;
    if (tab === 'learn' && progress?.stage === undefined) saveStage('learn');
    if (tab === 'practice') saveStage('practice');
    if (tab === 'review') saveStage('confirm');
    setActiveTab(tab);
  };

  const openReflection = () => {
    const now = new Date().toISOString();
    if (progress) saveTopicProgress({ ...progress, reflectStarted: true, lastVisited: now });
    setActiveTab('reflect');
  };

  const handleChallengeAttempt = (attempt: ChallengeAttempt, challenge: Challenge) => {
    recordChallengeAttempt(attempt, challenge);
    const fallbackProgress: TopicProgress = {
      topicId: bundle.id,
      stage: 'practice',
      completedChallengeIds: [],
      confirmedQaIds: [],
      manualReview: progress?.manualReview ?? false,
      lastVisited: attempt.updatedAt,
    };
    const latest = useLearnerStore.getState().canonicalProfile.topicProgress?.[bundle.id] ?? fallbackProgress;
    saveTopicProgress({
      ...latest,
      stage: latest.stage === 'complete' ? 'complete' : 'practice',
      completedChallengeIds: attempt.scored && attempt.passed
        ? Array.from(new Set([...latest.completedChallengeIds, attempt.challengeId]))
        : latest.completedChallengeIds,
      savedPracticeIds: attempt.scored
        ? latest.savedPracticeIds ?? []
        : Array.from(new Set([...(latest.savedPracticeIds ?? []), attempt.challengeId])),
      lastVisited: attempt.updatedAt,
    });
  };

  const saveLessonAnswer = (questionId: string, answer: string, correct: boolean | undefined, feedback: string) => {
    if (!bundle || !answer.trim()) return;
    const now = new Date().toISOString();
    const current = useLearnerStore.getState().canonicalProfile.lessonProgress?.[bundle.id];
    const nextProgress: LessonProgress = {
      topicId: bundle.id,
      stepIndex: current?.stepIndex ?? 0,
      diagnosticAnswered: current?.diagnosticAnswered ?? false,
      completed: current?.completed ?? false,
      confidence: current?.confidence ?? 0.5,
      lastVisited: now,
      chunkProgress: current?.chunkProgress,
      answerProgress: {
        ...(current?.answerProgress ?? {}),
        [questionId]: {
          answer,
          attempts: (current?.answerProgress?.[questionId]?.attempts ?? 0) + 1,
          hintsRequested: current?.answerProgress?.[questionId]?.hintsRequested ?? 0,
          revealed: current?.answerProgress?.[questionId]?.revealed ?? false,
          ...(correct === undefined ? {} : { correct }),
          feedback,
        },
      },
      miniProjectDraft: current?.miniProjectDraft,
      miniProjectSubmitted: current?.miniProjectSubmitted,
      reflection: current?.reflection,
    };
    saveLessonProgress(nextProgress);
  };

  const saveLessonExtensions = (changes: Pick<LessonProgress, 'chunkProgress' | 'miniProjectDraft' | 'miniProjectSubmitted'>) => {
    if (!bundle) return;
    const current = useLearnerStore.getState().canonicalProfile.lessonProgress?.[bundle.id];
    saveLessonProgress({
      topicId: bundle.id,
      stepIndex: current?.stepIndex ?? 0,
      diagnosticAnswered: current?.diagnosticAnswered ?? false,
      completed: current?.completed ?? false,
      confidence: current?.confidence ?? 0.5,
      lastVisited: new Date().toISOString(),
      chunkProgress: changes.chunkProgress,
      answerProgress: current?.answerProgress,
      miniProjectDraft: changes.miniProjectDraft,
      miniProjectSubmitted: changes.miniProjectSubmitted,
      reflection: current?.reflection,
    });
  };

  const saveReflection = (value: string) => {
    setReflection(value);
    const current = useLearnerStore.getState().canonicalProfile.lessonProgress?.[bundle.id];
    saveLessonProgress({
      topicId: bundle.id,
      stepIndex: current?.stepIndex ?? 0,
      diagnosticAnswered: current?.diagnosticAnswered ?? false,
      completed: current?.completed ?? false,
      confidence: current?.confidence ?? 0.5,
      lastVisited: new Date().toISOString(),
      chunkProgress: current?.chunkProgress,
      answerProgress: current?.answerProgress,
      miniProjectDraft: current?.miniProjectDraft,
      miniProjectSubmitted: current?.miniProjectSubmitted,
      reflection: value,
    });
  };

  const finishTopic = () => {
    const challengeScore = completedChallenges.length >= requiredChallenges ? 1 : 0.6;
    const questionScore = confirmedQuestions.length >= requiredQuestions ? 1 : 0.6;
    completeTopic(bundle.id, Math.round((challengeScore + questionScore) * 50));
    setActiveTab('complete');
  };

  const activeSection = bundle.lesson.sections[lessonSectionIndex] ?? bundle.lesson.sections[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/home" className="inline-flex min-h-11 items-center hover:text-teal">Home</Link>
        <span>/</span>
        <span className="text-ink">{bundle.lesson.title}</span>
      </div>

      <header>
        <SurfaceHeader
          eyebrow={topicFamilyMeta[bundle.lesson.topicFamily].name}
          title={bundle.lesson.title}
          description={bundle.lesson.whyMatters}
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-muted">
          <span className="rounded-full bg-slate-secondary px-3 py-1">{bundle.lesson.level}</span>
          <span className="rounded-full bg-slate-secondary px-3 py-1">{bundle.lesson.estimatedMinutes} minutes</span>
        </div>
        <SourceAttribution kind="lesson" slug={bundle.lesson.slug} />
      </header>

      <div className="space-y-3" aria-label="Topic progress">
        <div
          className="high-contrast-progress-track h-2 w-full overflow-hidden rounded-full bg-slate-secondary"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={topicTabs.length}
          aria-valuenow={activeTab === 'complete' ? topicTabs.length : topicTabs.findIndex((tab) => tab.id === activeTab) + 1}
          aria-label="Topic journey progress"
        >
          <div
            className="high-contrast-progress h-full rounded-full bg-teal transition-[width] duration-200"
            style={{ width: `${((activeTab === 'complete' ? topicTabs.length : topicTabs.findIndex((tab) => tab.id === activeTab) + 1) / topicTabs.length) * 100}%` }}
          />
        </div>
        {activeTab !== 'complete' && <StageTabs items={topicTabs.map((tab) => ({ ...tab, disabled: !canVisitTab(tab.id) }))} activeId={activeTab} onChange={activateTab} ariaLabel="Topic stages" />}
      </div>

      {activeTab === 'overview' && (
        <section id="stage-panel-overview" role="tabpanel" aria-labelledby="stage-tab-overview" className="card space-y-6 p-6">
          <div>
            <p className="surface-eyebrow">Your outcome</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{bundle.lesson.learningObjectives[0]}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-light">{bundle.lesson.whyMatters}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {bundle.lesson.learningObjectives.map((objective) => <li key={objective} className="high-contrast-surface rounded-lg border border-paper-warm bg-paper-dark/40 p-3 text-sm text-ink-light">{objective}</li>)}
          </ul>
          <button type="button" className="btn-primary" onClick={() => activateTab('learn')}>Start the explanation</button>
        </section>
      )}

      {activeTab === 'learn' && (
        <section id="stage-panel-learn" role="tabpanel" aria-labelledby="stage-tab-learn" className="space-y-4">
          <div>
            <p className="surface-eyebrow">Knowledge</p>
            <h2 id="learn-title" className="mt-2 text-2xl font-bold text-ink">Understand one idea at a time</h2>
            <p className="mt-2 text-sm text-ink-light">{lessonSectionIndex + 1} of {bundle.lesson.sections.length} explanation sections. No graded questions here, just the model and the evidence behind it.</p>
          </div>
          {activeSection && <LessonSectionCard section={activeSection} />}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-warm pt-4">
            <button type="button" className="btn-secondary text-sm" onClick={() => setLessonSectionIndex((current) => Math.max(0, current - 1))} disabled={lessonSectionIndex === 0}>Previous idea</button>
            {lessonSectionIndex < bundle.lesson.sections.length - 1 ? (
              <button type="button" className="btn-primary text-sm" onClick={() => setLessonSectionIndex((current) => current + 1)}>Next idea</button>
            ) : (
              <button type="button" className="btn-primary text-sm" onClick={() => saveStage('practice')}>Open applied practice</button>
            )}
          </div>
        </section>
      )}

      {activeTab === 'practice' && (
        <section id="stage-panel-practice" role="tabpanel" aria-labelledby="stage-tab-practice" className="space-y-4">
          <div>
            <p className="surface-eyebrow">Applied practice</p>
            <h2 id="practice-title" className="mt-2 text-2xl font-bold text-ink">Try the idea in a real decision</h2>
            <p className="mt-2 text-sm text-ink-light">Choose the best response to a situation, then inspect the reasoning.</p>
          </div>
          {practiceChallenges.length === 0 && <div className="border-y border-coral/40 py-4 text-sm text-coral">This topic needs at least one authored practice challenge before it can be completed.</div>}
          {practiceChallenges.map((challenge, index) => {
            const savedAttempt = canonicalProfile.challengeProgress[challengeContentId(challenge.slug)];
            const hintStage = hintStages[challenge.slug] ?? savedAttempt?.hintsUsed ?? 0;
            return (
              <div key={challenge.slug} className="space-y-3">
                <div className="space-y-3 border-b border-paper-warm pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-ink">Practice {index + 1}: {challenge.title}</h3>
                    <span className="text-xs text-ink-muted">Level {challenge.level}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-light">{challenge.scenario}</p>
                  {getChallengeLessonSectionId(challenge) && <a href={`#lesson-section-${getChallengeLessonSectionId(challenge)}`} className="mt-3 inline-block text-xs text-teal hover:underline">Review the related lesson section</a>}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {hintStage < challenge.hints.length && <button type="button" className="btn-secondary text-sm" onClick={() => setHintStages((current) => ({ ...current, [challenge.slug]: hintStage + 1 }))}>Hint {hintStage + 1} · costs 10 confidence</button>}
                    {challenge.hints.slice(0, hintStage).map((hint) => <p key={hint.stage} className="w-full rounded-lg border border-coral/20 bg-coral/5 p-3 text-sm text-ink-light"><span className="font-semibold text-coral">Hint {hint.stage}:</span> {hint.text}</p>)}
                  </div>
                </div>
                <ChallengeAnswerForm challenge={challenge} lessonSectionId={getChallengeLessonSectionId(challenge)} savedAttempt={savedAttempt} hintsUsed={hintStage} revealed={savedAttempt?.revealed ?? false} onSubmit={handleChallengeAttempt} />
              </div>
            );
          })}
          {bundle.practices.length > 0 && <section className="border-t border-paper-warm pt-5" aria-labelledby="practice-notes-title"><p className="surface-eyebrow">Guardrails</p><h3 id="practice-notes-title" className="mt-2 text-lg font-semibold text-ink">Keep the decision clear</h3><div className="mt-3 space-y-3">{bundle.practices.slice(0, 3).map((practice) => <div key={practice.id} className="border-t border-paper-warm pt-3"><p className="font-medium text-ink">{practice.title}</p><p className="mt-1 text-sm text-ink-light">{practice.summary}</p></div>)}</div></section>}
          <button type="button" className="btn-primary" onClick={() => saveStage('confirm')} disabled={!completedPractice}>Open review</button>
          {!completedPractice && <p className="text-sm text-coral">Complete one scored practice check to continue.</p>}
        </section>
      )}

      {activeTab === 'review' && (
        <section id="stage-panel-review" role="tabpanel" aria-labelledby="stage-tab-review" className="space-y-4">
          <div>
            <p className="surface-eyebrow">Transfer check</p>
            <h2 id="review-title" className="mt-2 text-2xl font-bold text-ink">Use the idea in a different situation</h2>
            <p className="mt-2 text-sm text-ink-light">These checks are separate from the explanation. Look for the model in a prediction, a bug report, and a design decision.</p>
          </div>
          {reviewQuestions.length < requiredQuestions && <div className="border-y border-coral/40 py-4 text-sm text-coral">This topic needs {requiredQuestions} review cards before it can be completed; {reviewQuestions.length} are currently authored.</div>}
          {reviewQuestions.map((item) => {
            const confirmed = confirmedQuestions.includes(item.id);
            return (
            <article key={item.id} className={`card p-6 ${confirmed ? 'border-teal/40' : ''}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">{item.reviewKind === 'predict' ? 'Predict' : item.reviewKind === 'debug' ? 'Debug' : 'Trade-off'}</p>
                <p className="mt-3 rounded-lg bg-paper-dark/50 p-4 text-sm leading-6 text-ink-light">{item.reviewScenario}</p>
                <h3 className="font-semibold text-ink">{item.question}</h3>
                <KnowledgeCheckForm
                  question={{ id: item.id, question: item.question, options: item.options, correctAnswer: item.answer, expectedReasoning: item.answer }}
                  savedAnswer={lessonProgress?.answerProgress?.[`qa:${item.id}`]?.answer}
                  savedCorrect={lessonProgress?.answerProgress?.[`qa:${item.id}`]?.correct}
                  savedFeedback={lessonProgress?.answerProgress?.[`qa:${item.id}`]?.feedback}
                  onAnswerChange={(answer) => saveLessonAnswer(`qa:${item.id}`, answer, false, '')}
                  onSubmit={(answer, correct, feedback) => saveLessonAnswer(`qa:${item.id}`, answer, correct, feedback)}
                />
                <p className="mt-3 text-xs text-ink-muted">Follow-up: {item.followUp}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" className={`${confirmed ? 'btn-secondary' : 'btn-primary'} text-sm`} onClick={() => confirmQa(bundle.id, item.id)} disabled={lessonProgress?.answerProgress?.[`qa:${item.id}`]?.correct !== true}>{confirmed ? 'Confirmed' : 'Confirm answer'}</button>
                </div>
              </article>
            );
          })}
          <button type="button" className="btn-primary" onClick={openReflection} disabled={!completedReview}>Continue to reflection</button>
          {!completedReview && <p className="text-sm text-coral">Confirm {requiredQuestions} review checks to continue.</p>}
        </section>
      )}

      {activeTab === 'reflect' && (
        <section id="stage-panel-reflect" role="tabpanel" aria-labelledby="stage-tab-reflect" className="space-y-5">
          <div>
            <p className="surface-eyebrow">Make it yours</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Explain the idea without the lesson open</h2>
            <p className="mt-2 text-sm text-ink-light">Retrieval is where the concept becomes usable. Write a short answer, then capture one place you can apply it.</p>
          </div>
          <div className="card space-y-4 p-6">
            <div><p className="text-sm font-semibold text-ink">Retrieval prompt</p><p className="mt-1 text-sm leading-6 text-ink-light">{bundle.lesson.retrievalPrompt}</p></div>
            <div><p className="text-sm font-semibold text-ink">Reflection prompt</p><p className="mt-1 text-sm leading-6 text-ink-light">{bundle.lesson.reflectionPrompt}</p></div>
            <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} onBlur={(event) => saveReflection(event.target.value)} placeholder="Write the explanation or application you want to remember…" className="min-h-28 w-full resize-y rounded-[10px] border border-paper-warm bg-slate p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal" aria-label="Your reflection" />
          </div>
          <LessonExtras chunks={bundle.lesson.chunks} diagram={bundle.lesson.diagram} miniProject={bundle.lesson.miniProject} progress={lessonProgress} onProgressChange={saveLessonExtensions} />
          <button type="button" className="btn-primary" onClick={finishTopic} disabled={!completedReview}>Complete topic</button>
        </section>
      )}

      {activeTab === 'complete' && (
        <section className="card space-y-5 p-8 text-center" aria-labelledby="complete-title">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Topic complete</p>
          <h2 id="complete-title" className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>You closed the loop</h2>
          <p className="text-ink-light">You learned the model, practiced a decision, and confirmed what you can retrieve.</p>
          {topicCapabilities.length > 0 && <div className="rounded-lg border border-teal/30 bg-teal/5 p-4 text-left" role="status" aria-live="polite"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Capability earned</p><ul className="mt-2 space-y-1 text-sm font-semibold text-ink">{topicCapabilities.map((definition) => <li key={definition.id}>{definition.title}</li>)}</ul></div>}
          <button type="button" className="btn-secondary" onClick={() => setManualReview(bundle.id, !(progress?.manualReview ?? false))}>{progress?.manualReview ? 'Remove from manual review' : 'Add to manual review'}</button>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/home" className="btn-secondary">Back home</Link>
            {nextBundle && <Link href={`/topic/${nextBundle.id}`} className="btn-primary">Next suggested topic</Link>}
          </div>
        </section>
      )}

      <footer className="space-y-4 border-t border-paper-warm pt-5 text-sm text-ink-muted">
        <p>Mastery: {Math.round((canonicalProfile.masteryRecords[bundle.id]?.mastery ?? 0) * 100)}% · {bundle.lesson.estimatedMinutes} minutes</p>
        {relatedTopics.length > 0 && <div><span className="font-semibold text-ink">Related:</span> {relatedTopics.map((topic, index) => <span key={topic.id}>{index > 0 ? ' · ' : ''}<Link href={`/topic/${topic.id}`} className="text-teal hover:underline">{topic.lesson.title}</Link></span>)}</div>}
      </footer>
    </div>
  );
}

function LessonSectionCard({ section }: {
  readonly section: LessonSection;
}) {
  return (
    <article id={`lesson-section-${section.id}`} className="card scroll-mt-6 p-6">
      {section.title && <h3 className="text-xl font-semibold text-ink">{section.title}</h3>}
      <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-ink-light">{section.content}</p>
      {section.code && <div className="mt-4"><CodeBlock code={section.code} language={section.codeLanguage ?? 'typescript'} filePath={section.codeFilePath} /></div>}
    </article>
  );
}
