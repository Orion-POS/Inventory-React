import PageLoader from '@/components/PageLoader';
import AppHeader from '@/components/navs/AppHeader';
import Sidebar from '@/components/navs/Sidebar';
import useSidebar from '@/hooks/useSidebar';
import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-full bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <Sidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenMenu={() => setMobileOpen(true)} />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-0 flex-1 px-3 pb-3 outline-none md:px-5 md:pb-5"
        >
          <div className="flex h-full flex-col overflow-auto rounded-xl bg-card p-4 shadow-card ring-1 ring-border/70 md:p-6">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
