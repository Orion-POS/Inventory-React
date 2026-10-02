import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';

export interface RouteTab {
  label: string;
  to: string;
}

/**
 * Horizontal tabs where each tab is a route. They are links, not ARIA tabs: the URL changes, so
 * the browser's back button, bookmarks and "open in new tab" all work. Scrolls sideways when the
 * tabs do not fit.
 */
const RouteTabs = ({
  tabs,
  label,
  className
}: {
  tabs: RouteTab[];
  label: string;
  className?: string;
}) => (
  <nav aria-label={label} className={cn('border-b', className)}>
    <ul className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map(tab => (
        <li key={tab.to} className="shrink-0">
          <NavLink
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'relative block rounded-t-md px-4 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                isActive
                  ? 'text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {tab.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default RouteTabs;
