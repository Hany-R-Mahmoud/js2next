import { describe, expect, it } from 'vitest';
import { volatileClaims } from './claims';
import { buildContentCatalog } from './catalog';

const liveDescribe = process.env.LIVE_SOURCE_CHECK === '1' ? describe : describe.skip;
const sourceUrls = Array.from(new Set([
  ...buildContentCatalog().flatMap((record) => record.sourceMetadata.map((source) => source.sourceUrl)),
  ...volatileClaims.map((claim) => claim.sourceUrl),
]));

liveDescribe('published source links', () => {
  it('resolve with a successful HTTP response', async () => {
    const failures: string[] = [];
    let nextIndex = 0;

    async function checkNext(): Promise<void> {
      while (nextIndex < sourceUrls.length) {
        const url = sourceUrls[nextIndex++];
        const result = await fetchSource(url);
        if (!result.ok) failures.push(`${url} -> ${result.status}`);
      }
    }

    await Promise.all(Array.from({ length: Math.min(8, sourceUrls.length) }, () => checkNext()));
    expect(failures).toEqual([]);
  }, 120_000);
});

async function fetchSource(url: string): Promise<{ ok: boolean; status: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      signal: controller.signal,
    });
    await response.body?.cancel();
    return { ok: response.status >= 200 && response.status < 400, status: response.status };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(timeout);
  }
}
