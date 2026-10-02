import { cn } from '@/lib/utils';

/** The Orion logo mark: the three stars of the constellation's belt, with two corner stars. */
export const OrionMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('h-8 w-8 shrink-0', className)}>
    <rect width="32" height="32" rx="9" fill="hsl(var(--primary))" />
    <g fill="hsl(var(--primary-foreground))">
      <circle cx="10.5" cy="19.5" r="2.6" />
      <circle cx="16" cy="16" r="2.6" />
      <circle cx="21.5" cy="12.5" r="2.6" />
      <circle cx="9" cy="8" r="1.4" opacity="0.55" />
      <circle cx="23" cy="24" r="1.4" opacity="0.55" />
    </g>
  </svg>
);

export const OrionLogo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className="flex items-center gap-3 overflow-hidden">
    <OrionMark />
    {collapsed ? null : (
      <div className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-semibold tracking-tight text-white">Orion</span>
        <span className="mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-sidebar-muted">
          Back office
        </span>
      </div>
    )}
  </div>
);
