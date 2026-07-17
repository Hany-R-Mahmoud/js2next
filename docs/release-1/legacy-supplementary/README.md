# Legacy supplementary archive

This directory is the Release 1 Phase B snapshot of the pre-Release 1 instructional authority.

It is **legacy-supplementary**, internal-only, and non-runtime. The archive exists to preserve rollback, historical comparison, and audit traceability while the Release 1 catalog is introduced. Runtime code must not import it, and its wording must not be copied into new learner-facing packets without separate review.

Snapshot scope:

- `snapshot/src/data/**`: topics, lessons, challenges, Q&A, practices, curriculum, examples, and registries.
- `snapshot/src/lib/content/**`: legacy content identity, source, claim, audit, and validation records/helpers.
- `snapshot/src/lib/learning/**`: legacy local-progress schema and migration-related files.
- `snapshot/docs/**`: instructional source/audit records and migration documentation tied to the old authority.

Do not migrate legacy mastery or progress into Release 1. Preserve this archive until the new catalog has completed a release cycle and rollback is no longer required.
