import type { ReactNode } from 'react';

interface SurfaceHeaderProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export default function SurfaceHeader({ eyebrow, title, description, action }: SurfaceHeaderProps) {
  return (
    <header className="surface-header">
      <div>
        {eyebrow && <p className="surface-eyebrow">{eyebrow}</p>}
        <h1 className="surface-title">{title}</h1>
        {description && <p className="surface-description">{description}</p>}
      </div>
      {action}
    </header>
  );
}
