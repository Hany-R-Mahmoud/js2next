'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLearnerStore } from '@/stores/learner';
import { toLearnerProfile } from '@/lib/learning/migration';
import type { Level } from '@/types';

const startOptions = [
  {
    id: 'javascript',
    title: 'Start with JavaScript',
    detail: 'Closures, async code, and the language model React relies on.',
    tone: 'border-vermillion/50 bg-vermillion/5',
    focusArea: 'react-fundamentals',
    goal: 'Build the JavaScript foundation for React',
  },
  {
    id: 'react',
    title: 'Start with React',
    detail: 'Components, state, effects, and the mental model behind UI.',
    tone: 'border-teal/50 bg-teal/5',
    focusArea: 'react-fundamentals',
    goal: 'Learn React fundamentals end to end',
  },
  {
    id: 'nextjs',
    title: 'Start with Next.js',
    detail: 'App Router, Server Components, data, and shipping decisions.',
    tone: 'border-lime-badge/50 bg-lime-badge/5',
    focusArea: 'nextjs-app-router',
    goal: 'Master Next.js App Router and RSC',
  },
] as const;

const levelOptions: readonly { value: Level; label: string; detail: string }[] = [
  { value: 'beginner', label: 'Beginner', detail: 'I am building the fundamentals.' },
  { value: 'intermediate', label: 'Intermediate', detail: 'I can build with the basics and want stronger models.' },
  { value: 'advanced', label: 'Advanced', detail: 'I want deeper architecture and production trade-offs.' },
  { value: 'expert', label: 'Expert', detail: 'I want rigorous edge cases and design decisions.' },
];

const styleOptions: readonly { value: 'visual' | 'verbal' | 'active' | 'reflective'; label: string; detail: string }[] = [
  { value: 'visual', label: 'Visual', detail: 'Diagrams and spatial explanations.' },
  { value: 'verbal', label: 'Verbal', detail: 'Reading explanations and code examples.' },
  { value: 'active', label: 'Active', detail: 'Building things as I learn.' },
  { value: 'reflective', label: 'Reflective', detail: 'Theory first, then application.' },
];

const landingTopics = [
  { label: 'JavaScript', detail: 'Closures, events, async code, and the language model React relies on.', tone: 'text-vermillion' },
  { label: 'React', detail: 'Components, state, effects, reducers, and the boundaries that keep UI understandable.', tone: 'text-teal' },
  { label: 'Next.js', detail: 'App Router, Server Components, data fetching, caching, and shipping decisions.', tone: 'text-lime-badge' },
] as const;

const landingFeatures = [
  { title: 'Lessons with a reason', detail: 'Learn the concept, see the trade-off, then connect it to code you can explain.', label: 'Learn', size: 'md:col-span-5' },
  { title: 'Practice that gives context', detail: 'Work through challenges that ask why, not only whether an answer is correct.', label: 'Practice', size: 'md:col-span-4' },
  { title: 'Review that remembers', detail: 'Return to weak spots with a local progress loop built around retention.', label: 'Retain', size: 'md:col-span-3' },
] as const;

export default function HomePage() {
  const router = useRouter();
  const { canonicalProfile, setProfile, completeDiagnostic } = useLearnerStore();
  const profile = toLearnerProfile(canonicalProfile);
  const [step, setStep] = useState<'welcome' | 'start' | 'level' | 'style' | 'name' | 'review' | 'done'>(
    'welcome'
  );
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name || '');
  const [level, setLevel] = useState<Level>(profile.level);
  const [preferredStyle, setPreferredStyle] = useState<typeof profile.preferredStyle>(profile.preferredStyle);
  const [focusArea, setFocusArea] = useState(profile.focusArea || 'react-fundamentals');
  const [goal, setGoal] = useState(profile.goals[0] || 'Build a connected frontend learning model');
  const profileName = profile.name;
  const profileLevel = profile.level;
  const profileStyle = profile.preferredStyle;
  const profileFocusArea = profile.focusArea;
  const profileGoal = profile.goals[0];

  useEffect(() => {
    const persist = useLearnerStore.persist;
    const finish = () => {
      setHydrated(true);
      setEditing(new URLSearchParams(window.location.search).get('edit') === '1');
    };
    if (persist.hasHydrated()) finish();
    else return persist.onFinishHydration(finish);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setName(profileName || '');
    setLevel(profileLevel);
    setPreferredStyle(profileStyle);
    setFocusArea(profileFocusArea || 'react-fundamentals');
    setGoal(profileGoal || 'Build a connected frontend learning model');
  }, [hydrated, profileFocusArea, profileGoal, profileLevel, profileName, profileStyle]);

  const handleStartOption = (option: typeof startOptions[number]) => {
    setFocusArea(option.focusArea);
    setGoal(option.goal);
    setStep('level');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const confirmProfile = () => {
    setProfile({
      name: name || 'Developer',
      level,
      preferredStyle,
      focusArea,
      goals: Array.from(new Set([...profile.goals, goal])),
    });
    completeDiagnostic();
    setStep('done');
  };

  const handleSkipDiagnostic = () => {
    if (!profile.diagnosticComplete) {
      setProfile({ name: profile.name || 'Developer' });
      completeDiagnostic();
    }
    router.push('/tracks');
  };

  const handleLandingAction = () => {
    if (profile.diagnosticComplete && !editing) {
      router.push('/tracks');
      return;
    }
    setStep('start');
  };

  const handleStartLearning = () => {
    router.push('/tracks');
  };

  const cancelSetup = () => router.push(editing ? '/settings' : '/');

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="achievement-badge mx-auto w-fit text-lg">Ready</div>
          <h1 className="text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome, {profile.name || 'Developer'}!
          </h1>
          <p className="text-ink-light text-lg">
            Your learning path is set to <strong className="text-teal capitalize">{profile.level}</strong> level.
            We will adapt as you progress.
          </p>
          <div className="card p-6 text-left space-y-2">
            <h2 className="font-semibold text-ink">Your path includes:</h2>
            <ul className="text-sm text-ink-light space-y-1">
              {profile.level === 'beginner' && (
                <>
                  <li><span className="text-lime-badge">Included</span> JavaScript foundations for React</li>
                  <li><span className="text-lime-badge">Included</span> React mental model: components, state, effects</li>
                  <li><span className="text-lime-badge">Included</span> Next.js App Router fundamentals</li>
                  <li><span className="text-lime-badge">Included</span> Interactive challenges and Socratic lessons</li>
                </>
              )}
              {profile.level === 'intermediate' && (
                <>
                  <li><span className="text-lime-badge">Included</span> Deep React patterns (reducers, context, custom hooks)</li>
                  <li><span className="text-lime-badge">Included</span> Server Components and data fetching</li>
                  <li><span className="text-lime-badge">Included</span> Next.js App Router mastery</li>
                  <li><span className="text-lime-badge">Included</span> Production patterns and architecture</li>
                </>
              )}
              {profile.level === 'advanced' && (
                <>
                  <li><span className="text-lime-badge">Included</span> Advanced state management architecture</li>
                  <li><span className="text-lime-badge">Included</span> RSC boundaries and composition patterns</li>
                  <li><span className="text-lime-badge">Included</span> Caching, revalidation, and deployment</li>
                  <li><span className="text-lime-badge">Included</span> Performance profiling and optimization</li>
                </>
              )}
              {profile.level === 'expert' && (
                <>
                  <li><span className="text-lime-badge">Included</span> Architecture deep dives and trade-off analysis</li>
                  <li><span className="text-lime-badge">Included</span> Production debugging and failure investigation</li>
                  <li><span className="text-lime-badge">Included</span> Migration strategies and legacy code integration</li>
                  <li><span className="text-lime-badge">Included</span> Build vs buy decisions for the ecosystem</li>
                </>
              )}
            </ul>
          </div>
          <button onClick={handleStartLearning} className="btn-primary w-full text-lg">
            Start Learning →
          </button>
        </div>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <LandingPage
        hasPath={profile.diagnosticComplete}
        onPrimaryAction={handleLandingAction}
        onSkip={handleSkipDiagnostic}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-4 py-12 lg:py-20">
        {step === 'start' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="surface-eyebrow">Choose your first build</p>
              <h2 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
                Pick the layer you want to understand first.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-ink-light">You can move through the full JavaScript to React to Next.js path later. This choice only sets your first recommendation.</p>
            </div>
            <div className="grid gap-3">
              {startOptions.map((option) => (
                <button key={option.id} type="button" onClick={() => handleStartOption(option)} className={`min-h-24 rounded-xl border p-5 text-left transition-colors hover:border-teal ${option.tone}`}>
                  <span className="block text-lg font-semibold text-ink">{option.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-ink-light">{option.detail}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={handleSkipDiagnostic} className="mx-auto block text-sm text-ink-muted underline hover:text-teal">Let me browse the full map first</button>
            <button type="button" onClick={cancelSetup} className="mx-auto block min-h-11 px-3 text-sm text-ink-muted underline hover:text-teal">Cancel</button>
          </div>
        )}

        {step === 'level' && <ChoiceStep title="How familiar are you with frontend development?" description="This changes the depth and starting difficulty, not which layers you can access." options={levelOptions} selected={level} onSelect={setLevel} onNext={() => setStep('style')} onBack={() => setStep('start')} />}

        {step === 'style' && <ChoiceStep title="How do you learn best?" description="We will use this preference to shape prompts and examples. You can change it later." options={styleOptions} selected={preferredStyle} onSelect={setPreferredStyle} onNext={() => setStep('name')} onBack={() => setStep('level')} />}

        {step === 'name' && (
          <div className="text-center space-y-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              What should we call you?
            </h2>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <label htmlFor="learner-name" className="sr-only">Your name</label>
              <input
                id="learner-name"
                type="text"
                dir="auto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full min-h-11 px-4 py-3 rounded-[10px] border border-paper-warm bg-slate
                           focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent
                           text-ink placeholder:text-ink-muted text-center text-lg"
                autoFocus
              />
              <button type="submit" className="btn-primary w-full">
                Continue →
              </button>
              <button type="button" onClick={() => setStep('style')} className="min-h-11 px-3 text-sm text-ink-muted underline hover:text-teal">Back</button>
            </form>
          </div>
        )}

        {step === 'review' && <div className="mx-auto max-w-md space-y-6"><div className="text-center"><p className="surface-eyebrow">Review your setup</p><h2 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Ready to start?</h2><p className="mt-3 text-ink-light">These choices shape your first recommendation and can be changed in Settings.</p></div><dl className="card space-y-4 p-6 text-sm"><div><dt className="text-ink-muted">Starting layer</dt><dd className="mt-1 font-semibold capitalize text-ink">{focusArea.replaceAll('-', ' ')}</dd></div><div><dt className="text-ink-muted">Experience</dt><dd className="mt-1 font-semibold capitalize text-ink">{level}</dd></div><div><dt className="text-ink-muted">Learning style</dt><dd className="mt-1 font-semibold capitalize text-ink">{preferredStyle}</dd></div><div><dt className="text-ink-muted">Name</dt><dd className="mt-1 font-semibold text-ink">{name || 'Developer'}</dd></div></dl><div className="flex flex-wrap gap-3"><button type="button" className="btn-secondary flex-1" onClick={() => setStep('name')}>Edit</button><button type="button" className="btn-primary flex-1" onClick={confirmProfile}>Confirm setup</button></div><button type="button" onClick={cancelSetup} className="mx-auto block min-h-11 px-3 text-sm text-ink-muted underline hover:text-teal">Cancel</button></div>}
      </div>
    </div>
  );
}

function ChoiceStep<T extends string>({
  title,
  description,
  options,
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  readonly title: string;
  readonly description: string;
  readonly options: readonly { value: T; label: string; detail: string }[];
  readonly selected: T;
  readonly onSelect: (value: T) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="surface-eyebrow">Your learning setup</p>
        <h2 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-light">{description}</p>
      </div>
      <div className="grid gap-3">
        {options.map((option) => (
          <button key={option.value} type="button" onClick={() => onSelect(option.value)} className={`min-h-20 rounded-xl border p-4 text-left transition-colors ${selected === option.value ? 'border-teal bg-teal/10' : 'border-paper-warm bg-slate hover:border-teal/60'}`} aria-pressed={selected === option.value}>
            <span className="block font-semibold text-ink">{option.label}</span>
            <span className="mt-1 block text-sm leading-6 text-ink-light">{option.detail}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onBack} className="btn-secondary flex-1">Back</button>
        <button type="button" onClick={onNext} className="btn-primary flex-1">Continue →</button>
      </div>
    </div>
  );
}

function LandingPage({
  hasPath,
  onPrimaryAction,
  onSkip,
}: {
  hasPath: boolean;
  onPrimaryAction: () => void;
  onSkip: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = document.querySelectorAll<HTMLElement>('[data-landing-reveal]');
    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('landing-reveal-visible');
            observer?.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
      sections.forEach((section) => observer?.observe(section));
    } else {
      sections.forEach((section) => section.classList.add('landing-reveal-visible'));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="landing-canvas min-h-[100dvh] overflow-x-clip text-ink">
      <div className="landing-ambient landing-ambient-blue" aria-hidden="true" />
      <div className="landing-ambient landing-ambient-red" aria-hidden="true" />

      <a
        href="#landing-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cloud focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <header className={`landing-header sticky top-0 z-50 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 ${isScrolled ? 'landing-header-scrolled' : ''}`}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 py-1 text-base font-bold tracking-tight text-ink" aria-label="JS2Next home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vermillion text-sm text-white shadow-[0_2px_8px_rgb(var(--color-peloton-red)/.3)]">JS</span>
          <span>JS2Next</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-muted md:flex" aria-label="Landing page navigation">
          <a className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-ink" href="#journey">The journey</a>
          <a className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-ink" href="#loop">How it works</a>
          <a className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-ink" href="#topics">Topics</a>
        </nav>
        <button type="button" onClick={onPrimaryAction} className="btn-secondary px-4 py-2 text-sm">
          {hasPath ? 'Continue learning' : 'Start the path'}
        </button>
      </header>

      <main id="landing-content" className="relative z-10">
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28">
          <div className="landing-enter">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-secondary bg-slate/70 px-3 py-1.5 text-xs font-semibold text-ink-light">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-badge" aria-hidden="true" />
              A connected path for frontend developers
            </p>
            <h1 className="landing-heading max-w-3xl text-5xl font-bold leading-[1.04] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.5rem]">
              From JavaScript to <span className="text-vermillion">Next.js</span>, learn the layer in between.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-light sm:text-xl">
              Build the mental model behind modern frontend work through source-backed lessons, deliberate practice, and review that follows your weak spots.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={onPrimaryAction} className="btn-primary landing-primary inline-flex min-h-12 items-center justify-center gap-2 px-6 text-base shadow-[0_4px_12px_rgb(var(--color-peloton-red)/.28)]">
                {hasPath ? 'Continue learning' : 'Choose your starting point'}
                <LandingArrow />
              </button>
              <a href="#journey" className="inline-flex min-h-12 items-center justify-center px-4 text-sm font-semibold text-ink-light transition-colors hover:text-ink">
                See the journey
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-ink-muted">
              <span>Local-first progress</span>
              <span>Source-backed content</span>
              <span>Practice before review</span>
            </div>
          </div>

          <div className="landing-enter landing-enter-delay hidden sm:block">
            <div className="landing-console rounded-xl border border-slate-secondary bg-code-bg/90 p-3 shadow-[0_8px_12px_rgb(0_0_0/.3)] sm:p-4">
              <div className="flex items-center justify-between border-b border-slate-secondary px-2 pb-3 text-xs text-ink-muted">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-vermillion" />
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <span className="h-2 w-2 rounded-full bg-lime-badge" />
                </div>
                <span className="font-mono">js2next / learning-path</span>
              </div>
              <div className="grid gap-3 pt-3 sm:grid-cols-[1.1fr_.9fr]">
                <div className="rounded-lg border border-slate-secondary bg-midnight/90 p-4">
                  <p className="mb-4 font-mono text-[11px] text-ink-muted">01 / understand the closure</p>
                  <pre className="overflow-x-auto font-mono text-xs leading-7 text-ink-light"><code><span className="text-teal">function</span> makeCounter() {'{'}{`\n`}  <span className="text-vermillion">let</span> count = 0;{`\n\n`}  <span className="text-teal">return</span> () =&gt; ++count;{`\n`}{'}'}</code></pre>
                  <div className="mt-5 border-t border-slate-secondary pt-3 text-xs leading-5 text-ink-muted">Trace the value, explain the closure, then see where React makes this useful.</div>
                </div>
                <div className="flex flex-col justify-between rounded-lg border border-slate-secondary bg-slate/80 p-4">
                  <div>
                    <p className="font-mono text-[11px] text-ink-muted">YOUR PATH</p>
                    <ol className="mt-4 space-y-4 text-sm">
                      <li className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-vermillion text-[10px] font-bold text-white">1</span><span><strong className="font-semibold text-ink">JavaScript</strong><br /><span className="text-xs text-ink-muted">Language foundations</span></span></li>
                      <li className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">2</span><span><strong className="font-semibold text-ink">React</strong><br /><span className="text-xs text-ink-muted">UI mental models</span></span></li>
                      <li className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-badge text-[10px] font-bold text-black">3</span><span><strong className="font-semibold text-ink">Next.js</strong><br /><span className="text-xs text-ink-muted">Production patterns</span></span></li>
                    </ol>
                  </div>
                  <div className="mt-6 rounded-md bg-slate-secondary/70 px-3 py-2 text-xs text-ink-light">Next up: connect the idea to a component.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="journey" data-landing-reveal className="landing-reveal border-t border-slate-secondary/80 bg-midnight/35">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-teal">The journey</p>
              <h2 className="landing-heading mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Each layer makes the next one easier to reason about.</h2>
              <p className="mt-4 text-base leading-7 text-ink-light">Start with the language. Use it to understand React. Then bring that model into Next.js architecture and production decisions.</p>
            </div>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {landingTopics.map((topic, index) => (
                <li key={topic.label} className="landing-panel relative p-5 sm:p-6">
                  <span className="font-mono text-xs text-ink-muted">0{index + 1}</span>
                  <h3 className={`mt-10 text-2xl font-bold tracking-tight ${topic.tone}`}>{topic.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-light">{topic.detail}</p>
                  {index < landingTopics.length - 1 && <span className="landing-journey-arrow hidden md:block" aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="loop" data-landing-reveal className="landing-reveal mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-vermillion">The learning loop</p>
              <h2 className="landing-heading mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Designed for understanding that survives the tutorial.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ink-muted">Your progress stays on your device, so the path stays personal and portable.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-12">
            {landingFeatures.map((feature) => (
              <article key={feature.title} className={`landing-panel ${feature.size} min-h-52 p-5 sm:p-6`}>
                <p className="text-xs font-semibold text-ink-muted">{feature.label}</p>
                <h3 className="mt-8 max-w-xs text-xl font-bold tracking-tight text-ink">{feature.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-ink-light">{feature.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="topics" data-landing-reveal className="landing-reveal border-y border-slate-secondary/80 bg-slate/45">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[.8fr_1.2fr] md:items-center lg:px-8 lg:py-20">
            <div>
              <p className="text-sm font-semibold text-lime-badge">Inside the path</p>
              <h2 className="landing-heading mt-3 text-3xl font-bold tracking-tight text-ink">A curriculum organized around real frontend decisions.</h2>
            </div>
            <ul className="flex flex-wrap gap-3">
              {['Closures and async JavaScript', 'Components and state', 'Effects and custom hooks', 'App Router and layouts', 'TypeScript boundaries', 'Production and deployment'].map((topic) => (
                <li key={topic} className="rounded-full border border-slate-secondary bg-midnight/70 px-4 py-3 text-sm text-ink-light">{topic}</li>
              ))}
            </ul>
          </div>
        </section>

        <section data-landing-reveal className="landing-reveal mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="landing-cta relative overflow-hidden rounded-xl border border-vermillion/35 bg-vermillion/10 px-6 py-10 sm:px-10 sm:py-12">
            <div className="relative z-10 max-w-2xl">
              <h2 className="landing-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Start with the part you want to understand next.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-light">Choose a layer, open the next lesson, and move forward with context.</p>
              <button type="button" onClick={onPrimaryAction} className="btn-primary landing-primary mt-7 inline-flex min-h-12 items-center gap-2 px-6">
                {hasPath ? 'Continue learning' : 'Find my starting point'}
                <LandingArrow />
              </button>
              {!hasPath && <button type="button" onClick={onSkip} className="ml-3 mt-7 inline-flex min-h-12 items-center px-3 text-sm font-semibold text-ink-light hover:text-ink">Browse the full map</button>}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-secondary/80 px-4 py-7 text-center text-xs text-ink-muted sm:px-6 lg:px-8">
        JS2Next · Learn the language, the model, and the architecture.
      </footer>
    </div>
  );
}

function LandingArrow() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
