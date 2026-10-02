import { OrionLogo } from '@/components/brand/OrionMark';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NAV_SECTIONS, type NavItem, type NavLeaf } from '@/config/navigation';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronRight, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';

const itemBase =
  'relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none';
const itemActive =
  'bg-sidebar-accent text-white before:absolute before:bottom-2.5 before:left-0 before:top-2.5 before:w-[3px] before:rounded-full before:bg-primary';
const iconClass = 'h-5 w-5 shrink-0';

interface NavProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const WithTooltip = ({ label, children }: { label: string; children: React.ReactElement }) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side="right" sideOffset={12}>
      {label}
    </TooltipContent>
  </Tooltip>
);

const LinkItem = ({ item, collapsed, onNavigate }: NavProps & { item: NavItem }) => {
  const { pathname } = useLocation();
  const isActive = Boolean(matchPath({ path: item.to!, end: false }, pathname));

  // The class is computed here rather than with NavLink's className callback: a callback does not
  // survive the tooltip trigger's asChild, which expects a string.
  const link = (
    <NavLink
      to={item.to!}
      onClick={onNavigate}
      className={cn(itemBase, collapsed && 'justify-center px-0', isActive && itemActive)}
    >
      <item.icon className={cn(iconClass, isActive && 'text-primary')} aria-hidden="true" />
      <span className={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
    </NavLink>
  );
  return collapsed ? <WithTooltip label={item.label}>{link}</WithTooltip> : link;
};

const isLeafActive = (leaf: NavLeaf, pathname: string) =>
  Boolean(matchPath({ path: leaf.to, end: false }, pathname));

const GroupItem = ({ item, collapsed, onNavigate }: NavProps & { item: NavItem }) => {
  const children = item.children ?? [];
  const { pathname } = useLocation();
  const active = children.some(leaf => isLeafActive(leaf, pathname));
  const [open, setOpen] = useState(active);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const panelId = useId();

  // Reaching a child by link or by URL opens its group.
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  const icon = <item.icon className={cn(iconClass, active && 'text-primary')} aria-hidden="true" />;

  if (collapsed) {
    return (
      <Popover open={flyoutOpen} onOpenChange={setFlyoutOpen}>
        <WithTooltip label={item.label}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={item.label}
              className={cn(itemBase, 'w-full justify-center px-0', active && itemActive)}
            >
              {icon}
            </button>
          </PopoverTrigger>
        </WithTooltip>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={12}
          className="w-56 border-sidebar-border bg-sidebar p-1.5 text-sidebar-foreground"
        >
          <p className="px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-sidebar-muted">
            {item.label}
          </p>
          <ul>
            {children.map(leaf => (
              <li key={leaf.to}>
                <ChildLink
                  leaf={leaf}
                  onNavigate={() => {
                    setFlyoutOpen(false);
                    onNavigate?.();
                  }}
                />
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(value => !value)}
        className={cn(itemBase, 'w-full')}
      >
        {icon}
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronRight
          className={cn(
            'h-4 w-4 shrink-0 text-sidebar-muted transition-transform duration-200 motion-reduce:transition-none',
            open && 'rotate-90'
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <ul className="ml-[1.4rem] min-h-0 space-y-0.5 overflow-hidden border-l border-sidebar-border pl-3">
          {children.map(leaf => (
            <li key={leaf.to} className="first:mt-1">
              <ChildLink leaf={leaf} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ChildLink = ({ leaf, onNavigate }: { leaf: NavLeaf; onNavigate?: () => void }) => (
  <NavLink
    to={leaf.to}
    onClick={onNavigate}
    className={({ isActive }) =>
      cn(
        'flex h-9 items-center rounded-md px-3 text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none',
        isActive ? 'bg-sidebar-accent font-medium text-white' : 'text-sidebar-muted'
      )
    }
  >
    {leaf.label}
  </NavLink>
);

interface SidebarContentProps extends NavProps {
  onToggleCollapsed?: () => void;
  onClose?: () => void;
}

const headerButton =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-muted outline-none transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none';

const SidebarContent = ({
  collapsed,
  onNavigate,
  onToggleCollapsed,
  onClose
}: SidebarContentProps) => {
  const toggle = onToggleCollapsed ? (
    <button
      type="button"
      onClick={onToggleCollapsed}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className={headerButton}
    >
      {collapsed ? (
        <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
      ) : (
        <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  ) : null;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Top: logo, and the collapse toggle at its right (below the logo on the narrow rail). */}
      <div
        className={cn(
          'flex shrink-0 items-center',
          collapsed ? 'flex-col gap-2 pb-1 pt-4' : 'h-[4.5rem] justify-between pl-5 pr-3'
        )}
      >
        <OrionLogo collapsed={collapsed} />
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Close menu" className={headerButton}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : collapsed && toggle ? (
          <WithTooltip label="Expand sidebar">{toggle}</WithTooltip>
        ) : (
          toggle
        )}
      </div>

      <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.label ?? index} className={index > 0 ? 'mt-5' : undefined}>
            {section.label && !collapsed ? (
              <p className="px-3 pb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-sidebar-muted">
                {section.label}
              </p>
            ) : null}
            {section.label && collapsed ? (
              <div className="mx-auto mb-3 h-px w-6 bg-sidebar-border" aria-hidden="true" />
            ) : null}
            <ul className="space-y-1">
              {section.items.map(item => (
                <li key={item.label}>
                  {item.children ? (
                    <GroupItem item={item} collapsed={collapsed} onNavigate={onNavigate} />
                  ) : (
                    <LinkItem item={item} collapsed={collapsed} onNavigate={onNavigate} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

const Sidebar = ({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileOpenChange
}: SidebarProps) => {
  // A drawer left open while the window grows to desktop width would trap focus behind the rail.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const close = (event: MediaQueryListEvent) => {
      if (event.matches) onMobileOpenChange(false);
    };
    query.addEventListener('change', close);
    return () => query.removeEventListener('change', close);
  }, [onMobileOpenChange]);

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={cn(
          'hidden shrink-0 py-3 pl-3 transition-[width] duration-200 motion-reduce:transition-none md:block',
          collapsed
            ? 'w-[calc(var(--sidebar-w-collapsed)+0.75rem)]'
            : 'w-[calc(var(--sidebar-w)+0.75rem)]'
        )}
      >
        <div className="h-full overflow-hidden rounded-3xl shadow-sidebar">
          <SidebarContent
            collapsed={collapsed}
            onToggleCollapsed={() => onCollapsedChange(!collapsed)}
          />
        </div>
      </aside>

      <DialogPrimitive.Root open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 md:hidden" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-50 w-[min(18rem,85vw)] overflow-hidden rounded-r-3xl shadow-xl outline-none duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left motion-reduce:animate-none md:hidden"
          >
            <DialogPrimitive.Title className="sr-only">Main menu</DialogPrimitive.Title>
            <SidebarContent
              collapsed={false}
              onNavigate={() => onMobileOpenChange(false)}
              onClose={() => onMobileOpenChange(false)}
            />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </TooltipProvider>
  );
};

export default Sidebar;
