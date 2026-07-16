'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { topicBundles, getTopicBundle } from '@/content/topics';
import { topicFamilyMeta } from '@/data/curriculum';
import CodeBlock from '@/components/shared/CodeBlock';
import ChallengeAnswerForm from '@/components/shared/ChallengeAnswerForm';
import KnowledgeCheckForm from '@/components/shared/KnowledgeCheckForm';
import LessonExtras from '@/components/shared/LessonExtras';
import SourceAttribution from '@/components/shared/SourceAttribution';
import { challengeContentId, getChallengeLessonSectionId } from '@/lib/content/identity';
import { contentCatalog } from '@/lib/content/catalog';
import { unmetPrerequisites } from '@/lib/learning/prerequisites';
import { recommendNextContent } from '@/lib/learning/recommendations';
import { capabilityDefinitions } from '@/lib/learning/capabilities';
import type { ChallengeAttempt, LessonProgress, TopicLoopStage, TopicProgress } from '@/lib/learning/types';
import { useLearnerStore } from '@/stores/learner';
import type { Challenge, LessonSection } from '@/types';

export default function TopicPage() {
  const params = useParams<{ slug: string }>();
  const bundle = getTopicBundle(params.slug);
  const { canonicalProfile, recordChallengeAttempt, saveLessonProgress, saveTopicProgress, confirmQa, setManualReview, completeTopic } = useLearnerStore();
  const [hydrated, setHydrated] = useState(false);
  const progress = bundle ? canonicalProfile.topicProgress?.[bundle.id] : undefined;
  const lessonProgress = bundle ? canonicalProfile.lessonProgress?.[bundle.id] : undefined;
  const [activeAct, setActiveAct] = useState<TopicLoopStage>(progress?.stage ?? 'learn');
  const [hintStages, setHintStages] = useState<Readonly<Record<string, number>>>({});

  useEffect(() => {
    const persist = useLearnerStore.persist;
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hydrated && progress?.stage) setActiveAct(progress.stage);
  }, [hydrated, progress?.stage]);

  const prerequisites = bundle ? unmetPrerequisites(bundle.lesson.prerequisites, canonicalProfile.masteryRecords) : [];
  const practiceChallenges = bundle?.challenges.slice(0, 3) ?? [];
  const confirmQuestions = bundle?.qa.slice(0, 5) ?? [];
  const requiredChallenges = 1;
  const requiredQuestions = 3;
  const completedChallenges = progress?.completedChallengeIds ?? [];
  const savedPracticeIds = progress?.savedPracticeIds ?? [];
  const confirmedQuestions = progress?.confirmedQaIds ?? [];
  const completedPractice = practiceChallenges.length >= requiredChallenges && practiceChallenges.some((challenge) => {
    const challengeId = challengeContentId(challenge.slug);
    return completedChallenges.includes(challengeId) || savedPracticeIds.includes(challengeId);
  });
  const completedConfirm = confirmQuestions.length >= requiredQuestions && confirmedQuestions.length >= requiredQuestions;
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

  const canVisitAct = (stage: TopicLoopStage): boolean => {
    if (stage === 'learn') return true;
    if (stage === 'practice') return progress?.stage !== undefined && progress.stage !== 'learn';
    return completedPractice || progress?.stage === 'confirm' || progress?.stage === 'complete';
  };

  const saveAct = (stage: TopicLoopStage) => {
    const startingPractice = stage === 'practice' && activeAct === 'learn';
    if (!startingPractice && !canVisitAct(stage)) return;
    const now = new Date().toISOString();
    saveTopicProgress({
      topicId: bundle.id,
      stage,
      completedChallengeIds: progress?.completedChallengeIds ?? [],
      confirmedQaIds: progress?.confirmedQaIds ?? [],
      manualReview: progress?.manualReview ?? false,
      lastVisited: now,
    });
    setActiveAct(stage);
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

  const finishTopic = () => {
    const challengeScore = completedChallenges.length >= requiredChallenges ? 1 : 0.6;
    const questionScore = confirmedQuestions.length >= requiredQuestions ? 1 : 0.6;
    completeTopic(bundle.id, Math.round((challengeScore + questionScore) * 50));
    setActiveAct('complete');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/home" className="hover:text-teal">Home</Link>
        <span>/</span>
        <span className="text-ink">{bundle.lesson.title}</span>
      </div>

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">{topicFamilyMeta[bundle.lesson.topicFamily].name}</p>
        <h1 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>{bundle.lesson.title}</h1>
        <p className="mt-2 text-ink-light">{bundle.lesson.whyMatters}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-muted">
          <span className="rounded-full bg-slate-secondary px-3 py-1">{bundle.lesson.level}</span>
          <span className="rounded-full bg-slate-secondary px-3 py-1">{bundle.lesson.estimatedMinutes} minutes</span>
        </div>
        <SourceAttribution kind="lesson" slug={bundle.lesson.slug} />
      </header>

      <div className="space-y-2" aria-label="Topic progress">
        <progress className="h-2 w-full accent-teal" value={Math.min(stageOptions.indexOf(activeAct), stageOptions.length - 1) + 1} max={stageOptions.length} aria-label="Topic loop progress" />
        <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Topic acts">
          {stageOptions.map((stage, index) => (
            <button key={stage} id={`topic-tab-${stage}`} role="tab" aria-selected={activeAct === stage} aria-controls={`topic-panel-${stage}`} type="button" onClick={() => canVisitAct(stage) && setActiveAct(stage)} disabled={!canVisitAct(stage)} className={`rounded-lg border px-3 py-3 text-left ${activeAct === stage ? 'border-teal bg-teal/10' : 'border-paper-warm bg-slate'} disabled:cursor-not-allowed disabled:opacity-50`}>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Act {index + 1}</span>
              <span className="mt-1 block text-sm font-semibold capitalize text-ink">{stage}</span>
            </button>
          ))}
        </div>
      </div>

      {activeAct === 'learn' && (
        <section id="topic-panel-learn" role="tabpanel" aria-labelledby="topic-tab-learn" className="space-y-4">
          <div>
            <h2 id="learn-title" className="mt-2 text-xl font-semibold text-ink">Understand the model before you practice</h2>
            <p className="mt-2 text-sm text-ink-light">Read the explanation, inspect the examples, and use the section anchors when you need to revisit a concept.</p>
          </div>
          {bundle.lesson.sections.map((section) => (
            <LessonSectionCard
              key={section.id}
              section={section}
              answerProgress={lessonProgress?.answerProgress}
              onAnswerSubmit={saveLessonAnswer}
            />
          ))}
          <LessonExtras
            chunks={bundle.lesson.chunks}
            diagram={bundle.lesson.diagram}
            miniProject={bundle.lesson.miniProject}
            progress={lessonProgress}
            onProgressChange={saveLessonExtensions}
          />
          {bundle.practices.length > 0 && <section className="border-t border-paper-warm pt-6" aria-labelledby="practice-notes-title"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Practice notes</p><h3 id="practice-notes-title" className="mt-2 text-lg font-semibold text-ink">Apply the idea with these guardrails</h3><div className="mt-4 space-y-3">{bundle.practices.slice(0, 3).map((practice) => <div key={practice.id} className="border-t border-paper-warm pt-3"><p className="font-medium text-ink">{practice.title}</p><p className="mt-1 text-sm text-ink-light">{practice.summary}</p></div>)}</div></section>}
          <button type="button" className="btn-primary" onClick={() => saveAct('practice')}>Continue to practice</button>
        </section>
      )}

      {activeAct === 'practice' && (
        <section id="topic-panel-practice" role="tabpanel" aria-labelledby="topic-tab-practice" className="space-y-4">
          <div>
            <h2 id="practice-title" className="mt-2 text-xl font-semibold text-ink">Try the idea in a real decision</h2>
            <p className="mt-2 text-sm text-ink-light">Choose the best answer and check your reasoning.</p>
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
          <button type="button" className="btn-primary" onClick={() => saveAct('confirm')} disabled={!completedPractice}>Continue to Q&amp;A</button>
          {!completedPractice && <p className="text-sm text-coral">Complete one scored practice check to continue.</p>}
        </section>
      )}

      {activeAct === 'confirm' && (
        <section id="topic-panel-confirm" role="tabpanel" aria-labelledby="topic-tab-confirm" className="space-y-4">
          <div>
            <h2 id="confirm-title" className="mt-2 text-xl font-semibold text-ink">Confirm what you know</h2>
            <p className="mt-2 text-sm text-ink-light">Choose the best explanation, then confirm each correct answer.</p>
          </div>
          {confirmQuestions.length < requiredQuestions && <div className="border-y border-coral/40 py-4 text-sm text-coral">This topic needs {requiredQuestions} confirmation cards before it can be completed; {confirmQuestions.length} are currently authored.</div>}
          {confirmQuestions.map((item) => {
            const confirmed = confirmedQuestions.includes(item.id);
            return (
            <article key={item.id} className={`card p-6 ${confirmed ? 'border-teal/40' : ''}`}>
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
          <button type="button" className="btn-primary" onClick={finishTopic} disabled={!completedConfirm}>Complete topic</button>
          {!completedConfirm && <p className="text-sm text-coral">Confirm {requiredQuestions} questions to finish.</p>}
        </section>
      )}

      {activeAct === 'complete' && (
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

const stageOptions: readonly TopicLoopStage[] = ['learn', 'practice', 'confirm'];

function LessonSectionCard({ section, answerProgress, onAnswerSubmit }: {
  readonly section: LessonSection;
  readonly answerProgress?: LessonProgress['answerProgress'];
  readonly onAnswerSubmit: (questionId: string, answer: string, correct: boolean, feedback: string) => void;
}) {
  return (
    <article id={`lesson-section-${section.id}`} className="card scroll-mt-6 p-6">
      {section.title && <h3 className="text-xl font-semibold text-ink">{section.title}</h3>}
      <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-ink-light">{section.content}</p>
      {section.code && <div className="mt-4"><CodeBlock code={section.code} language={section.codeLanguage ?? 'typescript'} filePath={section.codeFilePath} /></div>}
      {section.questions && <div className="mt-4 space-y-3">{section.questions.map((question) => {
        const saved = answerProgress?.[question.id];
        return (
          <div key={question.id} className="rounded-lg bg-paper-dark/50 p-4 text-sm text-ink-light">
            <p className="font-medium text-ink">{question.question}</p>
            <KnowledgeCheckForm
              question={question}
              savedAnswer={saved?.answer}
              savedCorrect={saved?.correct}
              savedFeedback={saved?.feedback}
              onSubmit={(answer, correct, feedback) => onAnswerSubmit(question.id, answer, correct, feedback)}
            />
          </div>
        );
      })}</div>}
    </article>
  );
}
