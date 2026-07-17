# Preserve, Replace, and Archive Matrix

## Preserve or adapt

- Next.js App Router, React, TypeScript, and Tailwind.
- Existing responsive shell, layout patterns, design tokens, and accessibility settings.
- Useful `CodeBlock`, knowledge-check, progress, search, and feedback components.
- Pure prerequisite, mastery, review, recommendation, and migration utilities when their behavior matches this contract.
- Content identity, source metadata, claim validation, and audit concepts.
- Local progress export/import.
- Stable routes or IDs only where semantic equivalence is demonstrated.

Preservation is never automatic. Each item must pass the target contract and tests.

## Replace

- `TopicFamily` as the curriculum hierarchy.
- The current `TopicBundle` registry as canonical learning authority.
- Existing learner-facing lessons, challenges, Q&A, and practices.
- Existing completion fallback and hardcoded topic-loop requirements.
- The mandatory Learn → Challenge → Q&A composition.
- Old topic ordering, grouping, and naming where they conflict with the approved map.
- Any rule that makes browser storage inseparable from the progression domain.
- Compatibility exports after the new catalog is stable.

## Archive

Create an internal-only snapshot of:

- `src/data/topics/**`
- current lesson/challenge/Q&A/practice registries
- current curriculum map
- project-specific learning examples
- content trust records associated only with old instructional text
- legacy local progress schema and migration documentation

The archive must be outside the new runtime import graph and clearly labeled `legacy-supplementary`.

## Never do

- Do not silently merge old text into new packets.
- Do not preserve an old item only because it already has tests.
- Do not map old mastery to new mastery without verified semantic equivalence.
- Do not delete the archive in the same change that performs the cutover.
