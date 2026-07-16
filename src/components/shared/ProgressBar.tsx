interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'teal' | 'vermillion' | 'coral';
}

export default function ProgressBar({ value, max = 100, label, size = 'md', color = 'teal' }: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colors = {
    teal: 'bg-teal',
    vermillion: 'bg-vermillion',
    coral: 'bg-coral',
  };

  return (
    <div className="w-full" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Progress'}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-ink-light">{label}</span>
          <span className="text-sm font-medium text-ink">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-secondary rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-200 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
