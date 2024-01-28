import { Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom';
import { VerticalTabsMenu } from '../../components/navs';
import ItemCategory from './ItemCategory';
import { useEffect, useState } from 'react';
import { ItemMenuProps } from '../../components/navs/TabsMenu/types';
import { Box, Tab, Tabs, Typography, css } from '@mui/material';
import { TabPanel } from '../../components/navs/TabsMenu';
import { a11yProps } from '../../components/navs/TabsMenu/helpers';

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

  console.log(MENU_ITEMS[activeIdxTabs], activeIdxTabs, '<< CEKPATH');

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
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
        css={css`
          .Mui-selected {
            color: #05445f;
            background-color: #a5f9dd;
            border-right: 4px solid #05445f;
            font-weight: 500;
            border-radius: 8px 0px 0px 8px;
          }
          .MuiTabs-indicator {
            width: 0;
          }
        `}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={activeIdxTabs}
          onChange={(e, val) => handleOnChange(val)}
          aria-label="Vertical Tabs Menu"
          sx={{ borderRight: 1, borderColor: 'divider', height: '100%', width: '240px' }}>
          {MENU_ITEMS.map((it, idx) => (
            <Tab label={it.label} {...a11yProps(idx)} />
          ))}
        </Tabs>
        {activeIdxTabs === undefined ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full">
            <Box sx={{ p: 3 }}>
              <Typography>
                {MENU_ITEMS[activeIdxTabs]?.label}

                <Outlet />
              </Typography>
            </Box>
          </div>
        )}
      </Box>
    </div>
  );
};

export default SetupPage;
