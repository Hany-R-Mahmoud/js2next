# Content migration manifest

This manifest locks the current canonical inventory before further curriculum organization work. IDs remain stable across the migration; human audit status is maintained separately in `src/lib/content/audit.ts`.

| Surface | Current owner | Migration invariant |
|---|---|---|
| Lessons | `src/data/lessons.ts` | Every lesson slug remains a topic bundle ID. |
| Challenges | `src/data/challenges.ts` and `src/content/topic-loop-content.ts` | Challenge slugs remain unique and resolve to one owning topic. |
| Q&A | `src/data/qa.ts` and `src/content/topic-loop-content.ts` | Q&A IDs remain unique and retain their topic IDs. |
| Practices | `src/data/best-practices.ts` | Practice IDs and topic ownership remain unchanged. |
| Catalog | `src/lib/content/catalog.ts` | Canonical IDs use `kind:slug` and preserve catalog order. |

The inventory tests in `src/content/topics.test.ts` and `src/lib/content/catalog.test.ts` are the executable baseline. Run `npm run audit:content` for the machine-readable and human-readable trust summary.
