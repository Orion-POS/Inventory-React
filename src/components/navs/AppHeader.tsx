import useGetCrumbs from '@/hooks/useGetCrumbs';
import { ChevronRight, Menu } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AppHeader = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const crumbs = useGetCrumbs();
  const current = crumbs.at(-1);
  const parents = crumbs.slice(0, -1);

  useEffect(() => {
    document.title = current ? `${current.label} · Orion` : 'Orion Back Office';
  }, [current]);

  return (
    <header className="flex h-[--header-h] shrink-0 items-center gap-2 px-3 md:px-5 md:pt-3">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1.5 text-sm">
          {parents.map(crumb => (
            <li key={crumb.pathname} className="hidden items-center gap-1.5 sm:flex">
              <Link
                to={crumb.pathname}
                className="rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {crumb.label}
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </li>
          ))}
          {current ? (
            <li aria-current="page" className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">{current.label}</h1>
            </li>
          ) : null}
        </ol>
      </nav>
    </header>
  );
};

export default AppHeader;
