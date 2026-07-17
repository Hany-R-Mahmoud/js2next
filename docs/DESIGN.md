# Learn React & Next.js Design System

## 0. Research Log

- Supplied reference: `/Users/hanyramadan/Downloads/peloton.mobile.DESIGN.md` — extracted dark surfaces, red action hierarchy, blue progress/link semantics, pill controls, 8px rhythm, and persistent mobile tab bar.
- Product fit: retained learning content hierarchy, semantic source treatment, challenge feedback, locked/completed states, and accessible desktop navigation.
- External visual research: skipped; supplied contract and existing product screens are sufficient.

## 1. Atmosphere & Identity

An energized learning studio: midnight canvas, lifted slate surfaces, crisp system typography, and small red/blue/lime signals that make the next learning action obvious. The product remains a learning platform; no Peloton logos, photography, or fitness copy are used.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---|---|
| App background | `--color-midnight-ink` / `midnight` | `#121212` | Root canvas |
| Card surface | `--color-slate-900` / `slate` | `#1F1F1F` | Learning cards and panels |
| Secondary surface | `--color-slate-700` / `slate-secondary` | `#2E2E2E` | Controls, tags, secondary navigation |
| Primary action | `--color-peloton-red` / `vermillion` | `#E63946` | CTAs, active navigation, recovery actions |
| Progress/link | `--color-signal-blue` / `teal` | `#007AFF` | Progress, links, focus, informative states |
| Achievement | `--color-lime-badge` / `lime-badge` | `#C7FF00` | Mastery and earned-capability badges |
| Primary text | `--color-pure-white` / `ink` | `#FFFFFF` | Headings and body text |
| Secondary text | `--color-cloud-gray` / `ink-light` | `#F2F2F2` | Supporting text |
| Metadata | `--color-ash` / `ink-muted` | `#8E8E93` | Labels, inactive icons, timestamps |
| Code surface | `code-bg` | `#0B0B0B` | Code blocks |

Functional aliases remain for existing route code: `paper`, `paper-dark`, `paper-warm`, `ink`, `ink-light`, `ink-muted`, `teal`, `teal-dark`, `vermillion`, `vermillion-dark`, `coral`, `success`, and `warning`. New UI uses the semantic tokens above.

## 3. Typography

System UI only; no remote font dependency.

| Role | Size | Weight | Line height |
|---|---:|---:|---:|
| Caption | 12px | 500–600 | 1.3 |
| Body small | 14px | 400–500 | 1.4 |
| Body | 16px | 400–500 | 1.4 |
| Subheading | 20px | 600 | 1.3 |
| Heading small | 24px | 600–700 | 1.2 |
| Heading | 28px | 700 | 1.2 |
| Heading large | 34px | 700 | 1.2 |

Fallback: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `sans-serif`. Code uses the platform monospace stack.

## 4. Spacing & Layout

- Base unit: 8px. Allowed rhythm: 4px, 8px, 12px, 16px, 24px, 32px, 48px.
- Shape: buttons/nav pills `999px`; cards `12px`; inputs `10px`; tags/badges `6px`.
- Shadows: card lift `0 4px 12px rgba(0,0,0,.25)`; button press `0 1px 3px rgba(0,0,0,.2)`.
- Breakpoints: mobile `<640px`, tablet `768px`, desktop `1024px`, wide `1280px`.
- Content width: `1024px` max; gutters `16px` mobile, `24px` tablet, `32px` desktop.
- Mobile shell reserves bottom-tab space and respects `env(safe-area-inset-bottom)`.
- Desktop shell keeps persistent navigation; mobile primary navigation is a fixed four-item tab bar: Home, Review, Progress, Settings. The active item stays visible on focused learning and review surfaces so the current destination remains clear.
- Topic and review flows are entered from Home; focused review intentionally uses a distraction-free full-screen shell.

## 5. Components

### App shell/navigation

Skip link, persistent desktop sidebar, fixed mobile tab bar, and bottom More sheet. States: default, active, open, closed, focus-visible. Requirements: landmark labels, `aria-current`, keyboard reachability, Escape close, focus trap/restoration, `inert` closed sheet, and safe-area padding.

### Buttons/filters

Primary and recovery actions use red pills; secondary actions use slate pills. Segmented filters use slate pills with blue active state. All controls are at least 44px high and expose hover, active, focus, disabled states.

### Learning card

Semantic `article` with eyebrow, title, summary, metadata, and one primary action. Variants: lesson, challenge, review, practice. States: default, hover, focus, locked, completed, error.

### Progress/mastery

Native progress semantics with visible numeric context. Blue indicates progress; lime indicates mastery/earned capability; color is never the only state signal.

### Code/source/challenge

Code blocks use near-black surfaces, readable mono text, labelled language/path metadata, and a visible 44px copy action. Source attribution exposes date, context, type, hostname, and path. Challenge feedback uses a live status region and preserves reasoning after submit.

### Multiple-choice checks

Conceptual questions use a labelled choice group with four 44px-minimum choice cards, a visible selected state, keyboard-operable native controls, and correct/incorrect live feedback. Free-text fields are reserved for executable code or applied project work.

### Learning stage tabs

Topic journeys use a responsive stage rail with five named states: Overview, Learn, Apply, Review, and Reflect. The active state uses blue, locked states remain visible but disabled, and each tab includes a short description so the control is understandable without relying on color. The rail uses one column on mobile, two on tablet, and five on wide screens, while keeping 44px keyboard/touch targets.

### Surface headers

Home, Progress, Settings, and focused learning surfaces use one header anatomy: optional eyebrow, balanced title, supporting description, and an optional action. This keeps the landing page's hierarchy while leaving dense lesson content quiet.

## 6. Motion & Interaction

- Micro transitions: 100–150ms. Standard transitions: 200–300ms.
- Animate only transform/opacity/filter; no layout animation.
- Reduced motion setting and `prefers-reduced-motion` collapse transitions.
- Motion exists only for navigation, disclosure, feedback, or affordance; no decorative animation.

## 7. Accessibility Constraints & Accepted Debt

- WCAG 2.2 AA target: body contrast ≥4.5:1, large text ≥3:1.
- Full keyboard reachability, visible focus, semantic landmarks, labelled controls, 44px touch targets, reduced motion, and no horizontal overflow at 320px are required.
- High contrast mode keeps black/white surfaces and white borders.

| Item | Location | Exit |
|---|---|---|
| Browser visual QA depends on locally available browser runner | `docs/review/` | Capture fresh 320/375/768/1024/1280 evidence when runner is available |
| MCQ distractors are normalized from related source-backed answers and remain human-audit pending | `src/data/topics/index.ts` | Replace individual distractors during human topic-family review when needed |
