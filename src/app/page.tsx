'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLearnerStore } from '@/stores/learner';
import { toLearnerProfile } from '@/lib/learning/migration';
import { Level } from '@/types';
import { determineDiagnosticLevel } from '@/lib/diagnostic';
import ProgressBar from '@/components/shared/ProgressBar';

const diagnosticQuestions = [
  {
    id: 'd1',
    question: 'How comfortable are you with JavaScript closures?',
    options: [
      { label: 'I am not sure what a closure is', level: 'beginner' as Level },
      { label: 'I can explain what a closure is but sometimes get confused', level: 'beginner' as Level },
      { label: 'I understand closures and can identify them in React code', level: 'intermediate' as Level },
      { label: 'I can explain closures and fix stale closure bugs confidently', level: 'advanced' as Level },
    ],
  },
  {
    id: 'd2',
    question: 'What is the main outcome you want from this path?',
    options: [
      { label: 'Learn React fundamentals end to end', goal: 'Learn React fundamentals end to end' },
      { label: 'Master Next.js App Router and RSC', goal: 'Master Next.js App Router and RSC' },
      { label: 'Build production-grade React and Next.js apps', goal: 'Build production-grade React and Next.js apps' },
      { label: 'Stay current with modern React patterns', goal: 'Stay current with modern React patterns' },
    ],
  },
  {
    id: 'd3',
    question: 'How much time can you give learning each day?',
    options: [
      { label: '10 minutes — keep it focused', optionsKey: 'paceMode', value: 'standard' },
      { label: '20 minutes — steady progress', optionsKey: 'paceMode', value: 'standard' },
      { label: '30 minutes — go deeper', optionsKey: 'paceMode', value: 'deep-dive' },
      { label: '45+ minutes — move quickly', optionsKey: 'paceMode', value: 'accelerated' },
    ],
  },
  {
    id: 'd4',
    question: 'What should we emphasize first?',
    options: [
      { label: 'React fundamentals', optionsKey: 'focusArea', value: 'react-fundamentals' },
      { label: 'State and data', optionsKey: 'focusArea', value: 'state-and-data' },
      { label: 'Next.js App Router', optionsKey: 'focusArea', value: 'nextjs-app-router' },
      { label: 'Production readiness', optionsKey: 'focusArea', value: 'production' },
    ],
  },
];

export default function HomePage() {
  const router = useRouter();
  const { canonicalProfile, setProfile, completeDiagnostic, addDiagnosticAnswer } = useLearnerStore();
  const profile = toLearnerProfile(canonicalProfile);
  const [step, setStep] = useState<'welcome' | 'diagnostics' | 'name' | 'done'>(
    profile.diagnosticComplete ? 'done' : 'welcome'
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [levelScores, setLevelScores] = useState<Record<Level, number>>({ beginner: 0, intermediate: 0, advanced: 0, expert: 0 });
  const [name, setName] = useState(profile.name || '');
  const [answeredOptions, setAnsweredOptions] = useState<Readonly<Record<string, string>>>({});

  const currentQ = diagnosticQuestions[questionIndex];

  const handleDiagnosticAnswer = (option: typeof currentQ.options[number]) => {
    addDiagnosticAnswer(currentQ.id, option.label, 0.8);

    const previousLabel = answeredOptions[currentQ.id];
    const previousOption = currentQ.options.find((candidate) => candidate.label === previousLabel);
    const nextScores = { ...levelScores };
    if (previousOption && 'level' in previousOption && previousOption.level) {
      nextScores[previousOption.level] = Math.max(0, nextScores[previousOption.level] - 1);
    }
    if ('level' in option && option.level) {
      nextScores[option.level as Level] += 1;
      setLevelScores(nextScores);
    }
    if ('optionsKey' in option && option.optionsKey && 'value' in option) {
      setProfile({ [option.optionsKey]: option.value } as Partial<typeof profile>);
    }
    if ('goal' in option && option.goal) {
      const diagnosticGoals = diagnosticQuestions[1].options.flatMap((candidate) => 'goal' in candidate && candidate.goal ? [candidate.goal] : []);
      setProfile({ goals: [...profile.goals.filter((goal) => !diagnosticGoals.includes(goal)), option.goal] });
    }

    setAnsweredOptions((current) => ({ ...current, [currentQ.id]: option.label }));

    if (questionIndex < diagnosticQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const determinedLevel = determineDiagnosticLevel(nextScores);
      setProfile({ level: determinedLevel });
      setStep('name');
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ name: name || 'Developer' });
    completeDiagnostic();
    setStep('done');
  };

  const handleSkipDiagnostic = () => {
    setStep('name');
  };

  const handleStartLearning = () => {
    // Give a default name and level if skipped
    if (!profile.diagnosticComplete) {
      setProfile({ name: name || 'Developer', level: 'beginner' });
      completeDiagnostic();
    }
    router.push('/home');
  };

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

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-4 py-12 lg:py-20">
        {step === 'welcome' && (
          <div className="text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              Learn React & Next.js
            </h1>
            <p className="text-xl text-ink-light max-w-lg mx-auto">
              Master modern frontend development through interactive lessons, Socratic guidance, and progressively difficult challenges.
            </p>
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto text-sm text-ink-light sm:grid-cols-3 sm:max-w-2xl">
              <p className="border-t border-paper-warm pt-3 sm:border-t-0 sm:border-l sm:pl-4">Durable understanding, not passive clicking</p>
              <p className="border-t border-paper-warm pt-3 sm:border-t-0 sm:border-l sm:pl-4">Adaptive lessons that respond to your level</p>
              <p className="border-t border-paper-warm pt-3 sm:border-t-0 sm:border-l sm:pl-4">10 challenge levels from trace to design</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => setStep('diagnostics')} className="btn-primary w-full max-w-md text-lg">
                Start Diagnostic →
              </button>
              <br />
              <button onClick={handleSkipDiagnostic} className="text-sm text-ink-muted hover:text-teal underline">
                Skip to name entry
              </button>
            </div>
          </div>
        )}

        {step === 'diagnostics' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <ProgressBar value={questionIndex + 1} max={diagnosticQuestions.length} size="sm" label="Diagnostic progress" />
              <p className="text-sm text-ink-muted mt-2">Question {questionIndex + 1} of {diagnosticQuestions.length}</p>
            </div>

            <h2 className="text-2xl font-bold text-ink text-center" style={{ fontFamily: 'var(--font-display)' }}>
              {currentQ.question}
            </h2>

            <div className="space-y-3 max-w-md mx-auto">
              {currentQ.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleDiagnosticAnswer(option)}
                  aria-pressed={answeredOptions[currentQ.id] === option.label}
                  className="w-full text-left min-h-11 p-4 rounded-[10px] border border-paper-warm bg-slate
                             hover:border-teal hover:bg-teal/5 transition-colors aria-pressed:border-teal aria-pressed:bg-teal/10
                             focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <span className="text-ink">{option.label}</span>
                </button>
              ))}
            </div>
            {questionIndex > 0 && <button type="button" onClick={() => setQuestionIndex((current) => current - 1)} className="mx-auto block text-sm text-ink-muted underline hover:text-teal">Back to previous question</button>}
          </div>
        )}

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
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
