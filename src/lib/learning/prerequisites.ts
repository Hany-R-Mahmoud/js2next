export interface MasteryLookup {
  readonly mastery: number;
}

export function unmetPrerequisites(
  prerequisiteIds: readonly string[],
  mastery: Readonly<Record<string, MasteryLookup>>,
): readonly string[] {
  return prerequisiteIds.filter((id) => (mastery[id]?.mastery ?? 0) < 0.8);
}
