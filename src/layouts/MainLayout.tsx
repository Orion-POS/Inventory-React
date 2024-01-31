import HeadNav from '@/components/navs/HeadNav';
import SideDrawer from '@/components/navs/SideDrawer';
import { css } from '@emotion/react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="w-full overflo-clip h-full bg-white flex">
      <SideDrawer />
      <div className="flex-grow w-   h-ful gap2  flex flex-col overflow-auto">
        <HeadNav />
        <div className="px-4 flex-grow w-full  py-3 md:py-4 flex  flex-col h-[90vh]  overflow-auto">
          <div
            className="flex flex-col h-full rounded-md px-3 py-3 md:py-4  border-gray-200"
            css={css`
              border: 1px solid gray;
            `}>
            <Suspense fallback={<p>Loading ...</p>}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
