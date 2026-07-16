import type { UnifiedProfile } from './types';

export interface CapabilityDefinition {
  readonly id: string;
  readonly title: string;
  readonly requiredTopicIds: readonly string[];
}

export interface CapabilityProgress {
  readonly completedTopics: number;
  readonly totalTopics: number;
  readonly earned: boolean;
}

export const capabilityDefinitions: readonly CapabilityDefinition[] = [
  {
    id: 'js-foundations',
    title: 'JavaScript Foundations',
    requiredTopicIds: ['closures-in-javascript', 'async-js-promises'],
  },
  {
    id: 'react-core',
    title: 'React Core',
    requiredTopicIds: ['components-and-jsx', 'state-and-events'],
  },
  {
    id: 'state-management',
    title: 'State Management',
    requiredTopicIds: ['use-reducer-and-context', 'use-effect-and-custom-hooks'],
  },
  {
    id: 'nextjs-app-router',
    title: 'Next.js App Router',
    requiredTopicIds: ['app-router-and-layouts', 'server-data-fetching'],
  },
  {
    id: 'rsc-boundaries',
    title: 'RSC Boundaries',
    requiredTopicIds: ['server-vs-client-components'],
  },
  {
    id: 'production-ready',
    title: 'Production Ready',
    requiredTopicIds: ['production-deployment'],
  },
  {
    id: 'architecture-thinking',
    title: 'Architecture Thinking',
    requiredTopicIds: ['architecture-decisions'],
  },
];

const capabilityById = new Map(capabilityDefinitions.map((def) => [def.id, def]));

export function getCapability(id: string): CapabilityDefinition | undefined {
  return capabilityById.get(id);
}

export function reconcileCapabilities(profile: UnifiedProfile): string[] {
  const existing = Array.from(new Set(profile.earnedCapabilities));
  const earned = new Set(existing);
  const newlyEarned: string[] = [];
  for (const def of capabilityDefinitions) {
    if (earned.has(def.id)) continue;
    if (checkCapability(profile, def)) {
      newlyEarned.push(def.id);
    }
  }
  if (newlyEarned.length === 0) return existing;
  return [...existing, ...newlyEarned];
}

export function checkCapability(profile: UnifiedProfile, def: CapabilityDefinition): boolean {
  return def.requiredTopicIds.every((topicId) => isTopicRequirementComplete(profile, topicId));
}

export function getCapabilityProgress(profile: UnifiedProfile, def: CapabilityDefinition): CapabilityProgress {
  const completedTopics = def.requiredTopicIds.filter((topicId) => isTopicRequirementComplete(profile, topicId)).length;
  return {
    completedTopics,
    totalTopics: def.requiredTopicIds.length,
    earned: profile.earnedCapabilities.includes(def.id),
  };
}

export function diffCapabilities(previous: readonly string[], current: readonly string[]): readonly string[] {
  const prevSet = new Set(previous);
  return current.filter((id) => !prevSet.has(id));
}

function isTopicRequirementComplete(profile: UnifiedProfile, topicId: string): boolean {
  const record = profile.masteryRecords[topicId];
  return record !== undefined
    && record.mastery >= 0.8
    && profile.topicProgress?.[topicId]?.stage === 'complete';
}
