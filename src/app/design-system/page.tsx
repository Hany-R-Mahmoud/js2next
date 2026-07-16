'use client';

import Accordion from '@/components/shared/Accordion';
import ChallengeAnswerForm from '@/components/shared/ChallengeAnswerForm';
import CodeBlock from '@/components/shared/CodeBlock';
import MasteryBadge from '@/components/shared/MasteryBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import SourceAttribution from '@/components/shared/SourceAttribution';
import { challenges } from '@/data/challenges';

const showcaseChallenge = challenges.find((challenge) => challenge.slug === 'expansion-design-runtime-schema-boundary');

export default function DesignSystemPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Design system showcase</p>
        <h1 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          Shared learning surfaces
        </h1>
        <p className="mt-2 text-ink-light">
          A route for checking the documented primitives, interaction states, source treatment, and responsive wrapping before changing product screens.
        </p>
      </header>

      <section className="grid gap-6 border-y border-paper-warm py-6 lg:grid-cols-2" aria-labelledby="surface-guidance-title">
        <div>
          <h2 id="surface-guidance-title" className="text-lg font-semibold text-ink">Surface guidance</h2>
          <p className="mt-2 text-sm text-ink-light">Use a card when a learner needs to compare, resume, or act on a distinct piece of work. Use a disclosure when detail is useful but not required on first read.</p>
        </div>
        <div className="lg:border-l lg:border-paper-warm lg:pl-6">
          <h3 className="text-sm font-semibold text-ink">Prefer open flow when</h3>
          <div className="mt-3 border-y border-dashed border-paper-warm py-3 text-sm text-ink-light">
            <p className="font-medium text-ink">One explanation, one action</p>
            <p className="mt-1">Keep short guidance and a single next step in the page flow instead of wrapping it in another card or disclosure.</p>
          </div>
        </div>
      </section>

      <section className="card p-6" aria-labelledby="actions-title">
        <h2 id="actions-title" className="text-lg font-semibold text-ink">Actions and states</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary">Primary action</button>
          <button type="button" className="btn-secondary">Secondary action</button>
          <button type="button" className="btn-vermillion">Recovery action</button>
          <button type="button" className="btn-secondary" disabled>Disabled action</button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2" aria-label="Progress and mastery states">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink">Progress states</h2>
          <div className="mt-4 space-y-5">
            <ProgressBar value={0} label="Not started" />
            <ProgressBar value={42} label="In progress" color="coral" />
            <ProgressBar value={100} label="Complete" color="teal" />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink">Mastery states</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <MasteryBadge level="beginner" mastery={0} />
            <MasteryBadge level="intermediate" mastery={0.42} />
            <MasteryBadge level="advanced" mastery={0.82} />
            <MasteryBadge level="expert" mastery={0.96} />
          </div>
        </div>
      </section>

      <section className="card p-6" aria-labelledby="card-states-title">
        <h2 id="card-states-title" className="text-lg font-semibold text-ink">Learning card states</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-[12px] border border-paper-warm bg-slate p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">Default</p>
            <h3 className="mt-2 font-semibold text-ink">Continue the concept</h3>
            <p className="mt-1 text-sm text-ink-light">A calm entry point with one clear next action.</p>
          </article>
          <article className="rounded-lg border border-teal/40 bg-teal/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">Active</p>
            <h3 className="mt-2 font-semibold text-ink">Review is ready</h3>
            <p className="mt-1 text-sm text-ink-light">Use accent color for a meaningful state change.</p>
          </article>
          <article className="rounded-lg border border-paper-warm bg-paper-dark/50 p-4 opacity-75">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Locked</p>
            <h3 className="mt-2 font-semibold text-ink">Prerequisite needed</h3>
            <p className="mt-1 text-sm text-ink-light">Explain the condition instead of hiding the content.</p>
          </article>
        </div>
      </section>

      <section className="card p-6" aria-labelledby="reading-title">
        <h2 id="reading-title" className="text-lg font-semibold text-ink">Reading and source primitives</h2>
        <CodeBlock
          code={'const result = ProfileSchema.safeParse(input);\nif (!result.success) return showFieldErrors(result.error.issues);'}
          language="typescript"
          filePath="form-action.ts"
        />
        <Accordion title="Expandable explanation" defaultOpen>
          <p className="text-sm leading-relaxed text-ink-light">
            The source treatment exposes the checked date, context, source type, hostname, and pathname so repeated links remain distinguishable.
          </p>
        </Accordion>
        <SourceAttribution kind="lesson" slug="expansion-runtime-schema-boundaries" />
      </section>

      <section aria-labelledby="challenge-title">
        <h2 id="challenge-title" className="mb-3 text-lg font-semibold text-ink">Challenge feedback states</h2>
        {showcaseChallenge && (
          <ChallengeAnswerForm
            challenge={showcaseChallenge}
            hintsUsed={0}
            revealed={false}
            onSubmit={() => undefined}
          />
        )}
      </section>
    </div>
  );
}
