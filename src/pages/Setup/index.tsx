import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ItemMenuProps } from '../../components/navs/TabsMenu/types';
import ItemCategory from './ItemCategory';

const SetupPage = () => {
  const [activeIdxTabs, setActiveIdxTabs] = useState<undefined | number>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const MENU_ITEMS: ItemMenuProps[] = [
    {
      key: 0,
      label: 'Item Category',
      value: 'item-category',
      children: <ItemCategory />
    },
    {
      key: 1,
      label: 'UoM Category',
      value: 'uom-category',
      children: <div>UoM Category</div>
    },
    {
      key: 2,
      label: 'Item Libraries',
      value: 'item-libraries',
      children: <div>Item Libraries</div>
    },
    {
      key: 3,
      label: 'Transaction Type',
      value: 'transaction-type',
      children: <div>Transaction Type</div>
    }
  ];

  const handleOnChange = (indexTabs: number) => {
    navigate(MENU_ITEMS[indexTabs].value);
  };

  useEffect(() => {
    if (pathname) {
    }
    const findInMenuItemsIdx = MENU_ITEMS.findIndex(it => it.value === pathname.split('/')?.[2]);
    setActiveIdxTabs(findInMenuItemsIdx);
  }, [pathname]);

  return (
    <div className=" h-full">
      <div className="flex h-full w-full">
        {/* TABS LIST MENU */}
        <div className="flex flex-col border-r-2 w-1/3 bg-white">
          {MENU_ITEMS.map((it, idx) => (
            <div
              onClick={() => handleOnChange(idx)}
              className={`p-3 my-1 cursor-pointer hover:bg-brand-100 transition-colors ease-in rounded-s-lg ${
                idx === activeIdxTabs
                  ? 'bg-brand-100 font-medium text-brand-900 border-r-4 border-brand-900'
                  : ''
              }`}>
              <span>{it.label}</span>
            </div>
          ))}
        </div>
        <div className="w-full px-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
