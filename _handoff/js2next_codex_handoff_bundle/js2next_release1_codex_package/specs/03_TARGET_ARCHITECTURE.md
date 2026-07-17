# Target Architecture

## Canonical authoring and runtime flow

```text
content packets (Markdown + frontmatter)
  → schema and semantic validation
  → normalized JSON
  → draft preview
  → human review decision
  → publication manifest
  → learner runtime catalog
```

## Proposed repository shape

```text
content/
  packets/
    javascript/
    react/
    nextjs/
  normalized/                 # generated; never hand edited
  manifests/
  legacy-supplementary/       # internal only

src/
  domain/
    curriculum/
    content/
    assessment/
    progression/
    content-trust/
  infrastructure/
    content-loader/
    local-progress/
  app/
    tracks/
    learn/
    assessments/
    review/
    progress/
    preview/
  components/
    curriculum/
    lesson/
    assessment/
    progress/
```

The supplied package uses `content/<track>/...` as its portable source layout. Codex may place it under `content/packets/` in the repository, but must preserve IDs and contracts.

## Domain boundaries

### Curriculum

Owns tracks, modules, topic placements, ordering, prerequisite edges, required/optional flags, and completion aggregation.

### Content

Owns immutable topic identity, versions, lesson blocks, objectives, sources, draft/review/publish state, and normalized packet loading.

### Assessment

Owns question versions, assessment sets, scoring, attempt evaluation, explanations, and objective-level misses. It must not write directly to browser storage.

### Progression

Owns topic/module/track progress, review items, mastery calculations, unlocking recommendations, and completion rules. It uses a storage adapter.

### Infrastructure

Release 1 implements a local storage adapter. A later release can add a server adapter without changing domain types.

## Recommended routes

- `/tracks`
- `/tracks/[track]`
- `/learn/[track]/[module]`
- `/learn/[track]/[module]/[topic]`
- `/learn/[track]/[module]/[topic]/quiz`
- `/assessments/module/[module]`
- `/assessments/cumulative/[track]`
- `/review`
- `/progress`
- `/preview/content/[topicId]` — draft/internal only

Existing `/topic/[slug]` URLs may redirect when a verified mapping exists.

## Server and client responsibilities

Use Server Components for catalog and published/draft-preview content reads where practical. Use Client Components only for interactivity such as answers, retries, navigation state, reflection, settings, and local progress hydration.

No API, server action, auth, or database is required for Release 1.
