import { topicBundles } from '@/content/topics';
import type { Level, TopicFamily } from '@/types';
import { contentKey, type ContentKind } from './identity';
import type { SourceMetadata } from './validate';

const contentReviewDate = '2026-07-15';
export const CONTENT_SCHEMA_VERSION = 1 as const;

export interface CanonicalContentRecord {
  readonly schemaVersion: typeof CONTENT_SCHEMA_VERSION;
  readonly id: string;
  readonly kind: ContentKind;
  readonly slug: string;
  readonly title: string;
  readonly topicId: string;
  readonly topicFamily?: TopicFamily;
  readonly level?: Level | number;
  readonly tags: readonly string[];
  readonly sourceMetadata: readonly SourceMetadata[];
}

export function buildContentCatalog(): readonly CanonicalContentRecord[] {
  return [
    ...topicBundles.map(({ lesson }) => ({
      schemaVersion: CONTENT_SCHEMA_VERSION,
      id: contentKey('lesson', lesson.slug),
      kind: 'lesson' as const,
      slug: lesson.slug,
      title: lesson.title,
      topicId: lesson.slug,
      topicFamily: lesson.topicFamily,
      level: lesson.level,
      tags: [lesson.topicFamily],
      sourceMetadata: lesson.metadata.sources.map((sourceUrl) => makeSource(sourceUrl, lesson.metadata.lastUpdated, lesson.metadata.nextVersion ?? lesson.metadata.reactVersion)),
    })),
    ...topicBundles.flatMap(({ lesson, challenges }) => challenges.map((challenge) => ({
      schemaVersion: CONTENT_SCHEMA_VERSION,
      id: contentKey('challenge', challenge.slug),
      kind: 'challenge' as const,
      slug: challenge.slug,
      title: challenge.title,
      topicId: lesson.slug,
      topicFamily: challenge.topicFamily,
      level: challenge.level,
      tags: [challenge.topicFamily],
      sourceMetadata: [...(challenge.sourceLink ? [challenge.sourceLink] : []), ...(challenge.sourceLinks ?? [])].map((sourceUrl) => makeSource(sourceUrl, contentReviewDate, versionForContent(sourceUrl, challenge.topicFamily))),
    }))),
    ...topicBundles.flatMap(({ qa }) => qa.map((item) => ({
      schemaVersion: CONTENT_SCHEMA_VERSION,
      id: contentKey('qa', item.id),
      kind: 'qa' as const,
      slug: item.id,
      title: item.question,
      topicId: item.topicId,
      topicFamily: item.topicFamily,
      level: item.level,
      tags: item.tags,
      sourceMetadata: [...(item.sourceLink ? [item.sourceLink] : []), ...(item.sourceLinks ?? [])].map((sourceUrl) => makeSource(sourceUrl, contentReviewDate, versionForCategory(item.category, sourceUrl))),
    }))),
    ...topicBundles.flatMap(({ practices }) => practices.map((practice) => ({
      schemaVersion: CONTENT_SCHEMA_VERSION,
      id: contentKey('practice', practice.id),
      kind: 'practice' as const,
      slug: practice.id,
      title: practice.title,
      topicId: practice.topicId,
      topicFamily: practice.topicFamily,
      tags: practice.tags,
      sourceMetadata: [...(practice.sourceLink ? [practice.sourceLink] : []), ...(practice.sourceLinks ?? [])].map((sourceUrl) => makeSource(sourceUrl, contentReviewDate, practice.nextVersion ?? practice.reactVersion ?? versionForSource(sourceUrl))),
    }))),
  ];
}

export const contentCatalog = buildContentCatalog();

function makeSource(sourceUrl: string, lastVerifiedAt: string, frameworkVersion?: string): SourceMetadata {
  return {
    sourceUrl,
    sourceType: sourceTypeFor(sourceUrl),
    lastVerifiedAt,
    ...(frameworkVersion ? { frameworkVersion } : {}),
  };
}

function sourceTypeFor(sourceUrl: string): SourceMetadata['sourceType'] {
  if (sourceUrl.includes('doi.org')) return 'research';
  if (sourceUrl.includes('w3.org')) return 'standard';
  if (sourceUrl.includes('react.dev') || sourceUrl.includes('nextjs.org') || sourceUrl.includes('developer.mozilla.org') || sourceUrl.includes('cheatsheetseries.owasp.org') || sourceUrl.includes('testing-library.com') || sourceUrl.includes('tanstack.com') || sourceUrl.includes('typescriptlang.org') || sourceUrl.includes('playwright.dev') || sourceUrl.includes('redux.js.org') || sourceUrl.includes('redux-toolkit.js.org') || sourceUrl.includes('reactrouter.com') || sourceUrl.includes('github.com/pmndrs/zustand') || sourceUrl.includes('zod.dev')) return 'official';
  return 'community';
}

function versionForFamily(topicFamily: TopicFamily): string | undefined {
  if (topicFamily === 'nextjs-foundations' || topicFamily === 'rsc-client' || topicFamily === 'nextjs-data' || topicFamily === 'production') return 'Next.js 15.5.20';
  if (topicFamily === 'react-mental-model' || topicFamily === 'state-behavior' || topicFamily === 'app-quality' || topicFamily === 'architecture') return 'React 19.2.7';
  return undefined;
}

function versionForContent(sourceUrl: string, topicFamily: TopicFamily): string | undefined {
  if (versionForSource(sourceUrl)) return versionForSource(sourceUrl);
  return sourceUrl.includes('react.dev') || sourceUrl.includes('nextjs.org') ? versionForFamily(topicFamily) : undefined;
}

function versionForCategory(category: 'react' | 'nextjs' | 'debugging' | 'architecture' | 'performance' | 'testing' | 'accessibility', sourceUrl: string): string | undefined {
  const sourceVersion = versionForSource(sourceUrl);
  if (sourceVersion) return sourceVersion;
  if (category === 'nextjs') return 'Next.js 15.5.20';
  if (category === 'react' || category === 'debugging' || category === 'architecture' || category === 'testing') return 'React 19.2.7';
  return undefined;
}

function versionForSource(sourceUrl: string): string | undefined {
  if (sourceUrl.includes('nextjs.org')) return 'Next.js 15.5.20';
  if (sourceUrl.includes('react.dev')) return 'React 19.2.7';
  return undefined;
}
