# UI and Responsive QA Receipt

- Build under test: production `next build` completed successfully on 2026-07-15.
- Route surface: 11 routes checked through a production server, all returned HTTP 200:
  - `/`
  - `/dashboard`
  - `/curriculum`
  - `/challenge`
  - `/qa`
  - `/best-practices`
  - `/progress`
  - `/settings`
  - `/design-system`
  - `/lesson/expansion-runtime-schema-boundaries`
  - `/challenge/expansion-design-runtime-schema-boundary`

## Fresh fixes represented in the current build

- The design-system showcase uses a canonical source-backed challenge, so the real challenge answer/feedback primitive renders.
- Navigation uses inline SVG icons paired with text labels; platform-dependent emoji glyphs are no longer part of the shared shell.
- Long source hostnames and paths can break inside the attribution row at narrow widths.
- Mobile/tablet code blocks place Copy in normal flow above the code; desktop retains the hover affordance with reserved code space.
- OS-level `prefers-reduced-motion` now reduces animation and transition durations, in addition to the app-level reduced-motion setting.

## Evidence and remaining QA work

- Fresh real-browser observation covered the showcase at desktop and 375px, including the drawer trigger, wrapping, action states, progress states, source rows, and canonical challenge controls.
- The route sweep confirms the new content, adaptive dashboard copy, locked lesson prerequisites, and source-backed challenge route render in production.
- The complete retained screenshot matrix at 320/375/768/1024/1280 for every route is still a release-evidence task; the current browser connector can produce transient compositor-black full-page captures, so those artifacts must be regenerated and retained by the final QA pass.
- No Lighthouse score is claimed here; a real Chrome Lighthouse median run remains a separate performance-release gate.
