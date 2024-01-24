import { Box, Tab, Tabs, Typography, css } from '@mui/material';
import React, { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ItemMenuProps {
  key: string | number;
  label: string;
  children: React.ReactNode;
}

interface VerticalTabsMenuProps {
  items: ItemMenuProps[];
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className='w-full'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

export const VerticalTabsMenu: React.FC<VerticalTabsMenuProps> = ({ items }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return !items?.length ? null : (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
      css={css`
        .Mui-selected {
          color: #05445F;
          background-color: #A5F9DD;
          border-right: 4px solid #05445F;
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
        value={value}
        onChange={handleChange}
        aria-label="Vertical Tabs Menu"
        sx={{ borderRight: 1, borderColor: 'divider', height: '100%', width: '240px' }}>
        {items.map((it, idx) => (
          <Tab label={it.label} {...a11yProps(idx)} />
        ))}
      </Tabs>
      {items.map((it, idx) => (
        <TabPanel value={value} index={idx} key={idx}>
          {it.children}
        </TabPanel>
      ))}
    </Box>
  );
};
