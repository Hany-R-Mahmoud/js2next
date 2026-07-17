import type { AssessmentProfileType } from './types';

const PROFILE_LABELS: Readonly<Record<AssessmentProfileType, string>> = {
  conceptual: 'Conceptual and mental-model review',
  workflow: 'Developer workflow and decision scenarios',
  hybrid: 'Mental model plus practical code reasoning',
  coding: 'Code-reading, debugging, and implementation challenge',
};

export function assessmentProfileLabel(type: AssessmentProfileType): string {
  return PROFILE_LABELS[type];
}
