# Remediation verification matrix

Recorded against the production build served from `http://localhost:3000` on 2026-07-22.

| Journey | Evidence | Result |
|---|---|---|
| Home hydration | `/home`, persisted profile and progress rendered after hydration | No loading placeholder remained; saved profile and progress were visible |
| Mobile navigation | 375px viewport, Home/Search/Progress/More | Four targets rendered; no horizontal overflow |
| More sheet | 375px, open More, inspect destinations, close | Tracks, Review, Settings present; native dialog opened; focus returned to More |
| Mobile route transition | More → Tracks | URL became `/tracks`; curriculum heading rendered |
| Arabic search | `/search`, query `الإغلاقات` | Closures results occupied the first three result positions |
| Arabic JavaScript search | `/search`, query `جافاسكريبت` | JavaScript topic results occupied the first three result positions |
| Onboarding profile separation | Edit flow: Next.js, Advanced, Reflective, Arabic Learner | Review showed each explicit choice independently |
| Onboarding cancel | Cancel before confirmation, return to Settings | Existing Beginner/Active profile remained unchanged |
| Narrow layout | 320px Search page | Document width equaled viewport; search controls fit; mobile nav remained usable |
| Tablet/desktop layout | 768px and 1280px Home | Document width equaled viewport; desktop layout rendered without overflow |
| Runtime errors | Browser console scan across final smoke | No warnings or errors |

Automated evidence:

- `npm test`: 194 passed, 2 skipped across 53 files.
- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `git diff --check`: passed.

Known limitation: the original synthetic study completed 15 of 20 personas. U16-U20 and real Arabic-speaking learner validation remain follow-up research, not release evidence.
