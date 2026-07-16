import { Level } from '@/types';

export default function MasteryBadge({ level, mastery }: { level: Level; mastery: number }) {
  const colors: Record<Level, string> = {
    beginner: 'bg-teal/10 text-teal border-teal/20',
    intermediate: 'bg-coral/10 text-coral border-coral/20',
    advanced: 'bg-vermillion/10 text-vermillion border-vermillion/20',
    expert: 'bg-lime-badge text-black border-lime-badge',
  };

  const percentage = Math.round(mastery * 100);
  const label = percentage >= 90 ? 'Mastered' : percentage >= 80 ? 'Proficient' : percentage > 0 ? 'Learning' : 'New';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border ${colors[level]}`}
    >
      {label}
      {percentage > 0 && <span className="opacity-70">{percentage}%</span>}
    </span>
  );
}
