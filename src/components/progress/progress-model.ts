import { curriculum } from '@/domain/curriculum/loader';
import type { Topic, TrackId } from '@/domain/curriculum/types';
import type { AssessmentAttempt, ProgressState } from '@/domain/progression/types';

export const progressStorageKey = 'js2next.local-progress';

export type CanonicalTopic = {
  readonly id: string;
  readonly title: string;
  readonly trackId: TrackId;
  readonly trackTitle: string;
  readonly moduleId: string;
  readonly moduleTitle: string;
  readonly required: boolean;
  readonly masteryPercent: number;
  readonly status: string;
  readonly href: string;
};

export type CanonicalModuleSummary = {
  readonly id: string;
  readonly title: string;
  readonly requiredTopicCount: number;
  readonly masteredTopicCount: number;
  readonly completionPercent: number;
  readonly reviewPercent: number;
  readonly complete: boolean;
};

export type CanonicalTrackSummary = {
  readonly id: TrackId;
  readonly title: string;
  readonly moduleCount: number;
  readonly completeModuleCount: number;
  readonly completionPercent: number;
  readonly reviewPercent: number;
  readonly complete: boolean;
  readonly modules: readonly CanonicalModuleSummary[];
};

export type CanonicalProgress = {
  readonly topics: readonly CanonicalTopic[];
  readonly topicMasteredCount: number;
  readonly tracks: readonly CanonicalTrackSummary[];
};

export function buildCanonicalProgress(state: ProgressState): CanonicalProgress {
  const tracks = curriculum.tracks.map((track) => {
    const modules = track.modules.map((module) => {
      const requiredTopics = module.topics.filter((topic) => topic.required);
      const masteredTopicCount = requiredTopics.filter((topic) => isMastered(state, topic.id)).length;
      const reviewPercent = latestAttempt(state, module.assessmentId)?.scorePercent ?? 0;
      const completionPercent = percentage(masteredTopicCount, requiredTopics.length);
      return {
        id: module.id,
        title: module.title,
        requiredTopicCount: requiredTopics.length,
        masteredTopicCount,
        completionPercent,
        reviewPercent: percentage(reviewPercent, 100),
        complete: masteredTopicCount === requiredTopics.length && reviewPercent >= 80,
      } satisfies CanonicalModuleSummary;
    });
    const completeModuleCount = modules.filter((module) => module.complete).length;
    const reviewPercent = latestAttempt(state, `${track.id.toUpperCase()}-CUMULATIVE-REVIEW`)?.scorePercent ?? 0;
    return {
      id: track.id,
      title: track.title,
      moduleCount: modules.length,
      completeModuleCount,
      completionPercent: percentage(completeModuleCount, modules.length),
      reviewPercent: percentage(reviewPercent, 100),
      complete: completeModuleCount === modules.length && reviewPercent >= 80,
      modules,
    } satisfies CanonicalTrackSummary;
  });

  const topics = curriculum.tracks.flatMap((track) => track.modules.flatMap((module) => module.topics.map((topic) => toCanonicalTopic(track.id, track.title, module.id, module.title, topic, state))));
  return { topics, topicMasteredCount: topics.filter((topic) => topic.masteryPercent >= 80).length, tracks };
}

function toCanonicalTopic(trackId: TrackId, trackTitle: string, moduleId: string, moduleTitle: string, topic: Topic, state: ProgressState): CanonicalTopic {
  return {
    id: topic.id,
    title: topic.title,
    trackId,
    trackTitle,
    moduleId,
    moduleTitle,
    required: topic.required,
    masteryPercent: percentage(state.topicProgress[topic.id]?.masteryPercent ?? 0, 100),
    status: state.topicProgress[topic.id]?.status ?? 'not-started',
    href: `/learn/${trackId}/${moduleId}/${topic.slug}`,
  };
}

function latestAttempt(state: ProgressState, assessmentId: string): AssessmentAttempt | undefined {
  let latest: AssessmentAttempt | undefined;
  for (const attempt of state.assessmentAttempts) {
    if (attempt.assessmentId === assessmentId) latest = attempt;
  }
  return latest;
}

function isMastered(state: ProgressState, topicId: string): boolean {
  return (state.topicProgress[topicId]?.masteryPercent ?? 0) >= 80;
}

function percentage(value: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((value / total) * 100);
}
