# Adaptive Learning Slice

- Status: implemented on 2026-07-15 inside the canonical learner profile.
- Persistence owner: `useLearnerStore` remains the only learner-state owner; no second store, scheduler, or cross-device service was introduced.

## Delivered

- Bounded local `learningEvents` trail:
  - lesson completion records topic, mastery, confidence, and timestamp;
  - challenge attempts record topic, challenge, pass/fail, hints, confidence, and timestamp;
  - the trail keeps the newest 50 events by default.
- Derived review queue:
  - `due-review` has highest priority;
  - `low-confidence` surfaces a topic below 55% confidence even when its scheduled date is later;
  - `weak-mastery` surfaces a topic below 50% mastery;
  - ordering is deterministic by priority, due date, and topic ID.
- Dashboard copy now explains why a review item is present instead of labeling every item as due.
- Existing recommendation behavior remains deterministic and separate from the queue: due lesson, weakest unfinished lesson, then new lesson.

## Deliberate limits

- Events are local and bounded; there is no analytics, reminder, timezone scheduler, or sync service.
- Confidence is learner-reported or challenge-derived; it is not presented as a calibrated probability.
- Wrong/high-confidence misconception variants, explicit prediction/reflection events, snooze controls, and 15/30/60-minute package modes remain the next adaptive increments.

## Verification

- Focused adaptation, mastery, and store tests pass.
- Typecheck and lint pass.
- Full test, source verification, production build, and browser smoke remain release gates after the next content/design-system slice.
