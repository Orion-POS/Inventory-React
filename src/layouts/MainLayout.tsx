import {
  Box,
  ChartMultitype,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DataCenter,
  Gui,
  Receipt,
  Store
} from '@carbon/icons-react';
import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="w-screen h-screen bg-gray-300 flex">
      <SideDrawer />
      <div className="flex-1">
        <HeadNav />
        <div className='px-4 py-4'>
          <Suspense fallback={<p>Loading ...</p>}>
            <Outlet />
          </Suspense>

        </div>
      </div>
    </div>
  );
};

const HeadNav = () => {
  return <div className='h-16 flex items-center bg-white pl-6'>Head Nav</div>;
};

const SideDrawer = () => {
  const [activeMenu, setActiveMenu] = useState(1);
  const [expandDrawer, setExpandDrawer] = useState(true);

  const menu = [
    {
      label: 'Summary',
      key: 1,
      icon: <ChartMultitype size={20} />,
      children: []
    },
    {
      label: 'Setup',
      key: 2,
      icon: <Gui size={20} />,
      children: []
    },
    {
      label: 'Stock Management',
      icon: <Box size={20} />,
      key: 3,
      children: [
        {
          label: 'Used Stock',
          key: 'used-stock'
        },

        {
          label: 'Adjustment',
          key: 'adjustment'
        },

        {
          label: 'Stock Opname',

          key: 'stock-opname'
        },
        {
          label: 'Wasted Stock',

          key: 'wasted-stock'
        }
      ]
    },
    {
      label: 'Transaction',
      key: 4,
      icon: <Receipt size={20} />,
      children: []
    },
    {
      label: 'Suppliers',
      icon: <Store size={20} />,
      key: 5,
      children: []
    },
    {
      label: 'Assets',
      icon: <DataCenter size={20} />,
      key: 6,
      children: []
    }
  ];
  return (
    <div className={`flex flex-col top-0 min-w-f z-10 bg-white ${expandDrawer ? 'w-64' : 'w-20'}`}>
      <div className="flex w-full items-center justify-between pr-2 relative">
        <div className="flex w-full h-10 overflow-clip items-center bg-red-50  px-4 py-3">
          <span className="font-bold text-lg text-brand-500">LOGO</span>
          {/* <Divider orientation='vertical' /> */}
          {expandDrawer ? (
            <>
              <div className="border-solid border-l-4 border w5 h-full mx-2 border-brand-500" />
              <span>Inventory</span>
            </>
          ) : null}
        </div>

        <div
          onClick={() => setExpandDrawer(!expandDrawer)}
          className="rounded-md absolute -right-1 h-fit py-3 cursor-pointer text-white bg-brand-500 hover:bg-brand-400 flex items-center">
          {expandDrawer ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      <div className="border-solid border-l-2 border w-full h-0 border-brand-400" />

      <ul className="px-3 py-4 flex flex-col gap-2">
        {menu.map(item =>
          !item.children.length ? (
            <li
              className={`px-4 py-3 flex font-medium justify-between items-center rounded-md cursor-pointer hover:bg-brand-400 ${
                activeMenu === item.key && !item.children.length
                  ? 'bg-brand-500 text-white'
                  : activeMenu === item.key && item.children.length
                  ? ' bg-brand-50'
                  : ''
              } ${expandDrawer ? '' : 'w-fit'}`}
              onClick={() => setActiveMenu(item.key)}>
              <div className={`flex gap-2 ${expandDrawer ? 'flex-grow' : 'flex-shrink'}`}>
                {item.icon ?? null}
                {expandDrawer ? item.label : null}
              </div>
              {item.children.length ? (
                item.key !== activeMenu ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )
              ) : null}
            </li>
          ) : (
            <li>
              <AccordionMenu
                drawerExpanded={expandDrawer}
                item={item}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
              />
            </li>
          )
        )}
      </ul>
    </div>
  );
};

const AccordionMenu = ({ item, activeMenu, setActiveMenu, drawerExpanded }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full">
      <div
        className={`px-4 py-3 flex font-medium justify-between items-center rounded-md cursor-pointer hover:bg-brand-400 ${
          expanded ? ' bg-brand-100' : ''
        }`}
        onClick={() => {
          // setActiveMenu([item.key, item.children[0].key]);
          setExpanded(!expanded);
        }}>
        <div className="flex gap-2 flex-grow">
          {item.icon ?? null}

          {drawerExpanded ? item.label : null}
        </div>
        {drawerExpanded ? (
          <>{!expanded ? <ChevronRight size={20} /> : <ChevronDown size={20} />}</>
        ) : null}
      </div>
      {expanded && drawerExpanded ? (
        <div className="pl-4 pt-2">
          {item.children.map(child => (
            <div
              className={`px-4 py-3 border-solid border-x-0 border-t-0 border-2 border-brand-100 cursor-pointer rounded-lg ${
                activeMenu === child.key ? 'bg-brand-500 text-white' : ''
              }`}
              onClick={() => {
                setActiveMenu(child.key);
              }}>
              <span className="font-medium">{child.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MainLayout;
