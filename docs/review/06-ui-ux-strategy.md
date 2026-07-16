# UI/UX Strategy

## Decision

- Use `learn-react` as the interaction and layout base.
- Borrow `learn-next` visual warmth:
  - Paper-like light theme.
  - Teal for progress/learning.
  - Coral/vermillion for action and challenge energy.
  - Warm neutral surfaces for long reading sessions.
- Make light mode the intentional default for a learning product; retain dark mode as an explicit preference.
- Keep UI calm. Content and reasoning are the product; decoration should not compete with them.

## Surface priorities

- Onboarding:
  - Ask goal, baseline, time budget, and preferred explanation mode.
  - Use a short diagnostic to calibrate instead of trusting self-rating alone.
  - Explain why each answer changes the path.
  - Allow skip, but label the result as an uncalibrated starting point.
- Dashboard:
  - Show one recommended next action.
  - Show why it is recommended.
  - Show review queue and due count.
  - Show current streak only as a secondary signal.
  - Show estimated time for today’s package.
- Curriculum:
  - Show prerequisite graph/path.
  - Distinguish locked, available, in progress, review, and mastered states.
  - Keep all labels text-based; icons are supporting signals only.
- Lesson reader:
  - Keep progress visible.
  - Keep prediction and confidence controls near the question.
  - Use a sticky desktop outline only if it does not reduce reading width.
  - Keep code examples copyable and readable on mobile.
  - Add “explain differently” without hiding the canonical explanation.
- Challenge workspace:
  - Place scenario, constraints, acceptance criteria, and answer area in one flow.
  - Keep hints staged.
  - Show attempt count and mastery impact.
  - Separate “submitted” from “passed.”
  - Show rubric feedback after the attempt.
- Q&A/practices:
  - Search and filter by topic, level, and category.
  - Show source and verification date.
  - Link back to lessons and challenges.
- Progress:
  - Show mastery plus confidence.
  - Show weak/high-confidence misconceptions.
  - Show next review date.
  - Preserve reflections as private local notes.

## Visual system

- Typography:
  - Use one display family and one readable body family.
  - Keep code in a dedicated mono family.
  - Avoid all-caps body copy and excessive font-weight changes.
- Color:
  - Teal: progress, confirmed understanding, focus.
  - Coral/vermillion: primary action, challenge, attention.
  - Warm paper: reading surface.
  - Red: error only, not ordinary difficulty.
- Components:
  - One button hierarchy.
  - One card treatment.
  - One progress-bar behavior.
  - One feedback/status pattern using `aria-live`.
  - One code block with copy and language/path metadata.
- Motion:
  - Use small transitions for state changes.
  - Respect `prefers-reduced-motion` and explicit learner setting.
  - Never use animation to communicate information that is unavailable statically.

## Accessibility baseline

- Use semantic HTML before ARIA.
- Provide:
  - Skip link.
  - Visible focus.
  - Keyboard access for every action.
  - Labels for every input.
  - Correct heading order.
  - `aria-current` for active navigation.
  - `aria-expanded` for accordions.
  - `aria-live` for answer feedback and saved status.
  - Sufficient contrast aligned with [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
- Do not rely on emoji-only navigation meaning.
- Test:
  - Keyboard-only onboarding.
  - Keyboard-only lesson and challenge flow.
  - Screen-reader names for controls.
  - Mobile width at 320px, 375px, and 768px.
  - Dark/light themes.
  - Reduced motion.

## Known UI issues from current projects

- `learn-next`:
  - Sidebar is clear on desktop but mobile navigation relies on a menu overlay that needs full keyboard/focus QA.
  - Navigation uses emoji icons that should remain decorative, with text always present.
  - Brand says “Learn React” while product includes Next.js.
  - Screenshot shows a strong light reading surface but no intentional dark-mode strategy.
  - Challenge UI visually suggests submission but does not currently score the work.
- `learn-react`:
  - Shell is more coherent and accessible.
  - System dark mode can make the product appear dark by default; decide and document default theme.
  - Mobile nav is a horizontal strip; verify discoverability and overflow behavior.
  - Tutor action bar has useful actions but needs clear semantics for what each action changes.
- Both:
  - Add empty/error/loading states consistently.
  - Add an explicit “last saved” state for local progress.
  - Avoid oversized dashboard cards that push the next action below the fold.

## UX success measures

- New learner reaches the first diagnostic question in under 30 seconds.
- Learner can explain why the next lesson was chosen.
- Learner can start a lesson without searching for the primary action.
- A wrong answer gives a useful next step, not only “incorrect.”
- A completed lesson exposes a transfer task.
- A review item can be started in one action.
- Keyboard user can complete the same flow as pointer user.
- Visual QA confirms no clipping, unreadable code, or state ambiguity at target widths.
