import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface StageTabItem<T extends string> {
  readonly id: T;
  readonly label: string;
  readonly description: string;
  readonly disabled?: boolean;
  readonly status?: 'current' | 'done' | 'available' | 'locked';
  readonly lockReason?: string;
}

interface StageTabsProps<T extends string> {
  readonly items: readonly StageTabItem<T>[];
  readonly activeId: T;
  readonly onChange: (id: T) => void;
  readonly ariaLabel: string;
  readonly renderSuffix?: (item: StageTabItem<T>) => ReactNode;
}

export default function StageTabs<T extends string>({ items, activeId, onChange, ariaLabel, renderSuffix }: StageTabsProps<T>) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('vertical');
  const [columnCount, setColumnCount] = useState(1);
  const enabledIndexes = items.flatMap((item, index) => item.disabled || item.status === 'locked' ? [] : [index]);

  useEffect(() => {
    const mediaQueries = [window.matchMedia('(min-width: 1280px)'), window.matchMedia('(min-width: 640px)')];
    const updateLayout = () => {
      const wideColumns = mediaQueries.findIndex((media) => media.matches);
      const nextColumnCount = wideColumns === 0 ? 4 : wideColumns === 1 ? 2 : 1;
      setColumnCount(nextColumnCount);
      setOrientation(nextColumnCount > 2 ? 'horizontal' : 'vertical');
    };
    updateLayout();
    mediaQueries.forEach((media) => media.addEventListener('change', updateLayout));
    return () => mediaQueries.forEach((media) => media.removeEventListener('change', updateLayout));
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const currentEnabledIndex = enabledIndexes.indexOf(index);
    if (currentEnabledIndex < 0) return;
    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';
    const isRight = event.key === 'ArrowRight';
    const isLeft = event.key === 'ArrowLeft';
    const isHome = event.key === 'Home';
    const isEnd = event.key === 'End';
    if (!isDown && !isUp && !isRight && !isLeft && !isHome && !isEnd) return;
    const step = isDown || isUp ? columnCount : 1;
    const direction = isUp || isLeft ? -1 : 1;
    const candidateIndex = isHome ? enabledIndexes[0] : isEnd ? enabledIndexes[enabledIndexes.length - 1] : index + step * direction;
    const candidateEnabledIndex = enabledIndexes.indexOf(candidateIndex);
    const fallbackEnabledIndex = isHome || isEnd
      ? candidateEnabledIndex
      : enabledIndexes.findIndex((enabledIndex) => direction > 0 ? enabledIndex > index : enabledIndex < index);
    const nextEnabledIndex = candidateEnabledIndex >= 0
      ? candidateEnabledIndex
      : fallbackEnabledIndex >= 0
        ? fallbackEnabledIndex
        : direction > 0 ? 0 : enabledIndexes.length - 1;
    event.preventDefault();
    const nextIndex = enabledIndexes[nextEnabledIndex];
    onChange(items[nextIndex].id);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="stage-tabs" role="tablist" aria-label={ariaLabel} aria-orientation={orientation}>
      {items.map((item, index) => {
        const locked = item.disabled || item.status === 'locked';
        const statusLabel = locked ? 'Locked' : activeId === item.id ? 'Current' : item.status === 'done' ? 'Done' : 'Available';
        const lockReasonId = `stage-tab-reason-${item.id}`;
        return (
        <button
          key={item.id}
          id={`stage-tab-${item.id}`}
          type="button"
          role="tab"
          aria-selected={activeId === item.id}
          aria-controls={`stage-panel-${item.id}`}
          aria-describedby={locked ? lockReasonId : undefined}
          tabIndex={activeId === item.id && !locked ? 0 : -1}
          disabled={locked}
          onClick={() => { if (!locked) onChange(item.id); }}
          onKeyDown={(event) => handleKeyDown(event, index)}
          ref={(element) => { buttonRefs.current[index] = element; }}
          className={`stage-tab ${activeId === item.id ? 'stage-tab-active' : ''}`}
        >
          <span className="stage-tab-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="stage-tab-copy">
            <span className="stage-tab-label">{item.label}</span>
            <span className="stage-tab-description">{item.description}</span>
            <span className="stage-tab-status">{statusLabel}</span>
            {locked && <span id={lockReasonId} className="stage-tab-lock-reason">{item.lockReason ?? 'Complete the previous stage first'}</span>}
          </span>
          {renderSuffix?.(item)}
        </button>
        );
      })}
    </div>
  );
}
