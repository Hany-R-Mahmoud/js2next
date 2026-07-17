'use client';

import { useId, useState } from 'react';
import type { LessonProgress } from '@/lib/learning/types';
import type { LessonChunk, LessonDiagram, MiniProject } from '@/types';

interface LessonExtrasProps {
  readonly chunks?: LessonChunk[];
  readonly diagram?: LessonDiagram;
  readonly miniProject?: MiniProject;
  readonly progress?: LessonProgress;
  readonly onProgressChange: (progress: Pick<LessonProgress, 'chunkProgress' | 'miniProjectDraft' | 'miniProjectSubmitted'>) => void;
}

type ChunkResult = { answered: boolean; correct: boolean; answer?: string };

export default function LessonExtras({ chunks, diagram, miniProject, progress, onProgressChange }: LessonExtrasProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => Object.fromEntries(
    Object.entries(progress?.chunkProgress ?? {}).flatMap(([id, entry]) => entry.answer ? [[id, entry.answer]] : [])
  ));
  const [chunkResults, setChunkResults] = useState<Record<string, ChunkResult>>(progress?.chunkProgress ?? {});
  const [draft, setDraft] = useState(progress?.miniProjectDraft ?? '');
  const [projectSaved, setProjectSaved] = useState(progress?.miniProjectSubmitted ?? false);
  const idPrefix = useId().replace(/:/g, '');
  const checkpointHeadingId = `${idPrefix}-checkpoint-heading`;
  const miniProjectHeadingId = `${idPrefix}-mini-project-heading`;
  const diagramTitleId = `${idPrefix}-lesson-diagram-title`;

  if (!chunks?.length && !diagram && !miniProject) return null;

  const checkPrediction = (chunk: LessonChunk) => {
    const answer = selectedAnswers[chunk.id];
    if (!answer) return;
    const result = {
      answered: true,
      correct: answer === chunk.prediction.correctAnswer,
      answer,
    };
    const nextResults = { ...chunkResults, [chunk.id]: result };
    setChunkResults(nextResults);
    onProgressChange({ chunkProgress: nextResults, miniProjectDraft: draft, miniProjectSubmitted: projectSaved });
  };

  const saveProject = () => {
    setProjectSaved(true);
    onProgressChange({ chunkProgress: chunkResults, miniProjectDraft: draft, miniProjectSubmitted: true });
  };

  return (
    <section className="space-y-6" aria-labelledby={`${idPrefix}-lesson-extras-title`}>
      <h2 id={`${idPrefix}-lesson-extras-title`} className="sr-only">Lesson practice extensions</h2>
      {diagram && <LessonDiagramView diagram={diagram} titleId={diagramTitleId} />}

      {chunks && chunks.length > 0 && (
        <section className="space-y-5 border-t border-paper-warm pt-6" aria-labelledby={checkpointHeadingId}>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-teal font-semibold">Retrieval practice</p>
            <h2 id={checkpointHeadingId} className="text-xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              Deep-dive checkpoints
            </h2>
            <p className="text-sm text-ink-light mt-1">Predict first, then compare your reasoning with the model.</p>
          </div>

          {chunks.map((chunk) => {
            const result = chunkResults[chunk.id];
            return (
              <article key={chunk.id} className="space-y-3 border-t border-paper-warm pt-5 first:border-t-0 first:pt-0">
                <h3 className="font-semibold text-ink">{chunk.title}</h3>
                <p className="text-sm text-ink-light whitespace-pre-line">{chunk.concept}</p>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-ink">{chunk.prediction.prompt}</legend>
                  {chunk.prediction.options.map((option) => (
                    <label key={option} className={`high-contrast-option ${selectedAnswers[chunk.id] === option ? 'high-contrast-option-selected' : ''} flex gap-3 items-start rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                      selectedAnswers[chunk.id] === option ? 'border-teal bg-teal/10' : 'border-paper-warm bg-slate hover:border-teal/50'
                    }`}>
                      <input
                        type="radio"
                        name={`${idPrefix}-${chunk.id}`}
                        value={option}
                        checked={selectedAnswers[chunk.id] === option}
                        onChange={() => setSelectedAnswers((previous) => ({ ...previous, [chunk.id]: option }))}
                        className="mt-0.5 accent-teal"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
                <button type="button" className="btn-secondary text-sm" onClick={() => checkPrediction(chunk)} disabled={!selectedAnswers[chunk.id]}>
                  Check prediction
                </button>
                {result?.answered && (
                  <div role="status" className={`rounded-lg p-3 text-sm ${result.correct ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'}`}>
                    {result.correct ? chunk.prediction.feedbackCorrect : chunk.prediction.feedbackWrong}
                  </div>
                )}
                <p className="text-sm text-ink-light border-l-2 border-teal/40 pl-3">{chunk.synthesis}</p>
              </article>
            );
          })}
        </section>
      )}

      {miniProject && (
        <section className="space-y-4 border-t border-paper-warm pt-6" aria-labelledby={miniProjectHeadingId}>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-vermillion font-semibold">Applied practice</p>
            <h2 id={miniProjectHeadingId} className="text-xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              {miniProject.title}
            </h2>
            <p className="text-sm text-ink-light mt-1">{miniProject.scenario}</p>
          </div>
          <ul className="list-disc list-inside text-sm text-ink-light space-y-1">
            {miniProject.acceptance.map((criterion) => <li key={criterion}>{criterion}</li>)}
          </ul>
          {miniProject.rubric && miniProject.rubric.length > 0 && (
            <div className="high-contrast-surface rounded-lg border border-paper-warm bg-paper-dark/40 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-ink">Review rubric</h3>
              <ul className="space-y-2 text-sm text-ink-light">
                {miniProject.rubric.map((item) => (
                  <li key={item.dimension}><span className="font-medium text-ink">{item.dimension}:</span> {item.evidence}</li>
                ))}
              </ul>
            </div>
          )}
          <label htmlFor={`${idPrefix}-mini-project-draft`} className="text-sm font-medium text-ink">Your implementation notes</label>
          <textarea
            id={`${idPrefix}-mini-project-draft`}
            value={draft}
            onChange={(event) => { setDraft(event.target.value); setProjectSaved(false); }}
            onBlur={() => onProgressChange({ chunkProgress: chunkResults, miniProjectDraft: draft, miniProjectSubmitted: projectSaved })}
            placeholder="Describe the boundary, state, and tests you would build…"
            className="w-full min-h-28 p-3 rounded-[10px] border border-paper-warm bg-slate text-ink text-sm resize-y focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <div className="flex items-center gap-3">
            <button type="button" className="btn-primary text-sm" onClick={saveProject} disabled={!draft.trim()}>Save practice notes</button>
            {projectSaved && <span role="status" className="text-sm text-teal">Saved to your lesson progress.</span>}
          </div>
        </section>
      )}
    </section>
  );
}

function LessonDiagramView({ diagram, titleId }: { readonly diagram: LessonDiagram; readonly titleId: string }) {
  const nodeById = new Map(diagram.nodes.map((node) => [node.id, node]));
  return (
    <figure className="card p-6" aria-labelledby={titleId}>
      <figcaption id={titleId} className="text-lg font-semibold text-ink mb-4">{diagram.title}</figcaption>
      <div className="space-y-3" role="list" aria-label={`${diagram.kind} learning model`}>
        {diagram.nodes.map((node, index) => (
          <div key={node.id}>
            <div role="listitem" className="high-contrast-surface rounded-lg border border-teal/30 bg-teal/5 p-3">
              <p className="font-medium text-ink">{node.label}</p>
              {node.role && <p className="text-xs text-ink-muted mt-1">{node.role}</p>}
            </div>
            {index < diagram.nodes.length - 1 && <p className="text-center text-sm text-teal py-1" aria-hidden="true">↓</p>}
          </div>
        ))}
      </div>
      {diagram.edges.length > 0 && (
        <ul className="mt-4 border-t border-paper-warm pt-3 space-y-1 text-xs text-ink-muted">
          {diagram.edges.map((edge) => (
            <li key={`${edge.from}-${edge.to}`}>
              {nodeById.get(edge.from)?.label} → {nodeById.get(edge.to)?.label}{edge.label ? `: ${edge.label}` : ''}
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
