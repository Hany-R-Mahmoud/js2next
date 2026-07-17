# Package Placement Guide for Codex

This package is portable. In `js2next`, use the following mapping unless repository inspection reveals a safer equivalent:

| Package path | Suggested repository path |
|---|---|
| `content/**` | `content/packets/**` for Markdown; generated JSON under `content/normalized/**` |
| `curriculum/curriculum.runtime.json` | canonical curriculum source or generated catalog input |
| `schemas/**` | `content/schema/**` |
| `assessments/**` | `content/assessment-source/**` or equivalent canonical authoring area |
| `manifests/**` | `content/manifests/**` |
| `fixtures/**` | test fixtures |
| `specs/**` | `docs/release-1/**` |
| `migration/**` | `docs/release-1/migration/**` |
| `references/**` | `docs/release-1/references/**` |
| `validation/**` | CI fixtures and implementation receipt |

Do not copy normalized JSON into hand-authored source directories. Build a compiler so generated output can be deleted and reproduced.

Do not put the supplied draft manifest into a production runtime path. It is intentionally non-publishable.
