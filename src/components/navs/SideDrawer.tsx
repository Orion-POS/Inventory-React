import {
  Box,
  ChartMultitype,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CloseOutline,
  DataCenter,
  Gui,
  Menu,
  Receipt,
  Store
} from '@carbon/icons-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideDrawer = () => {
  const [activeMenu, setActiveMenu] = useState(0);
  const [expandDrawer, setExpandDrawer] = useState(true);
  const { pathname } = useLocation();
  const parsedPath = pathname.split('/');

  const menu = [
    {
      label: 'Summary',
      key: 0,
      icon: <ChartMultitype size={20} />,
      children: [],
      url: 'summary'
    },
    {
      label: 'Setup',
      key: 1,
      icon: <Gui size={20} />,
      children: [],
      url: 'setup'
    },
    {
      label: 'Stock Management',
      icon: <Box size={20} />,
      key: 'stock-management',
      children: [
        {
          label: 'Used Stock',
          key: 'used-stock',
          url: '/stock-management/used-stock'
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
      key: 3,
      icon: <Receipt size={20} />,
      children: []
    },
    {
      label: 'Suppliers',
      icon: <Store size={20} />,
      key: 4,
      children: []
    },
    {
      label: 'Assets',
      icon: <DataCenter size={20} />,
      key: 5,
      children: []
    }
  ];

  return (
    <>
      <div
        onClick={() => setExpandDrawer(!expandDrawer)}
        className="md:hidden absolute pr-2 pl-3 text-gray-600 flex items-center justify-center cursor-pointer h-14 ">
        <Menu size={24} />
      </div>
      <div
        className={`md:flex flex-col h-screen md:h-full  md:static absolute  shadow-lg top-0 min-w-f z-50 bg-white ${
          expandDrawer ? 'md:w-64 w-full ' : 'md:w-20 hidden'
        }`}>
        <div className="flex w-full  items-center justify-between pr-2 relative">
          <div className="flex w-full h-14 overflow-clip items-center  px-4 py-3">
            <span className="font-bold text-lg text-brand-500">LOGO</span>
            {expandDrawer ? (
              <>
                <div className="border-solid border-l-4 border w5 h-full mx-2 border-brand-500" />
                <span>Inventory</span>
              </>
            ) : null}
          </div>

          {/* min screen md */}
          <div
            onClick={() => setExpandDrawer(!expandDrawer)}
            className="rounded-md absolute md:-right-3 hidden h-fit py-3 cursor-pointer text-white bg-brand-500 hover:bg-brand-400 md:flex items-center">
            {expandDrawer ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </div>
          {/* smaller screen */}
          <div
            onClick={() => setExpandDrawer(!expandDrawer)}
            className="absolute right-3 top-3 self-end p-1 rounded-full cursor-pointer text-brand-900 bg-brand-100 hover:bg-brand-400 md:hidden items-center">
            <CloseOutline size={20} />
          </div>
        </div>

        <div className="border-solid border-l-2 border w-full h-0 border-brand-400" />

        <ul className="px-3 py-4 flex flex-col hiden md:flex gap-2">
          {menu.map(item =>
            !item.children.length ? (
              <Link
                onClick={() => setActiveMenu(item.key)}
                to={item.url ?? '#'}
                className="no-underline text-black">
                <li
                  className={`px-4 py-3 flex font-medium justify-between items-center rounded-md cursor-pointer hover:bg-brand-400 ${
                    !item.children.length && parsedPath[1] === item.url
                      ? 'bg-brand-500 text-white'
                      : parsedPath[1] === item.url && item.children.length
                      ? ' bg-brand-50'
                      : ''
                  } ${expandDrawer ? '' : 'w-fit'}`}>
                  <div className={`flex gap-2 ${expandDrawer ? 'flex-grow' : 'flex-shrink'}`}>
                    {item.icon ?? null}
                    {expandDrawer ? item.label : null}
                  </div>
                  {item.children.length ? (
                    parsedPath[1] === item.url ? (
                      <ChevronRight size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )
                  ) : null}
                </li>
              </Link>
            ) : (
              <li>
                <AccordionMenu drawerExpanded={expandDrawer} item={item} path={parsedPath} />
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};

const AccordionMenu = ({ item, drawerExpanded, path }) => {
  const [expanded, setExpanded] = useState(path[1] === item.key);
  console.log(path[1] === item.key, drawerExpanded, '<< cekItem');

  return (
    <div className="w-full">
      <div
        className={`px-4 py-3 flex font-medium justify-between items-center rounded-md cursor-pointer hover:bg-brand-400 ${
          expanded ? ' bg-brand-100' : ''
        }`}
        onClick={() => {
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
            <Link
              className={`px-4 flex py-3 hover:bg-brand-400 border-solid border-x-0 border-t-0 border-2 border-brand-100 cursor-pointer rounded-lg ${
                path[2] === child.key ? 'bg-brand-500 text-white' : ''
              }`}
              to={child.url}>
              <span className="font-medium">{child.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SideDrawer;
