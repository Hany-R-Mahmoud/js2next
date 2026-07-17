export const trackIds = ['javascript', 'react', 'nextjs'] as const;
export type TrackId = (typeof trackIds)[number];

export type CurriculumEdgeKind = 'required' | 'recommended';

export interface Subtopic {
  readonly id: string;
  readonly title: string;
  readonly order: number;
}

export interface Topic {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly order: number;
  readonly required: boolean;
  readonly optional: boolean;
  readonly advanced: boolean;
  readonly contentType: string;
  readonly estimatedMinutes: number;
  readonly difficulty: number;
  readonly requiredPrerequisiteTopicIds: readonly string[];
  readonly recommendedPrerequisiteTopicIds: readonly string[];
  readonly packetPath: string;
  readonly markdownPath: string;
  readonly status: 'draft' | 'reviewed' | 'published' | 'archived';
  readonly reviewStatus: 'pending-human-review' | 'approved' | 'needs-revision';
  readonly subtopics: readonly Subtopic[];
}

export interface Module {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly order: number;
  readonly topics: readonly Topic[];
  readonly requiredTopicIds: readonly string[];
  readonly optionalTopicIds: readonly string[];
  readonly assessmentId: string;
  readonly masteryThresholdPercent: number;
}

export interface Track {
  readonly id: TrackId;
  readonly slug: TrackId;
  readonly title: string;
  readonly order: number;
  readonly modules: readonly Module[];
}

export interface PrerequisiteEdge {
  readonly fromTopicId: string;
  readonly toTopicId: string;
  readonly kind: CurriculumEdgeKind;
  readonly policy: string;
  readonly masteryThresholdPercent: number;
}

export interface Curriculum {
  readonly schemaVersion: string;
  readonly product: string;
  readonly release: string;
  readonly tracks: readonly Track[];
  readonly prerequisiteEdges: readonly PrerequisiteEdge[];
}

export interface CurriculumLocation {
  readonly track: Track;
  readonly module: Module;
  readonly topic?: Topic;
}
