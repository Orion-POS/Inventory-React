import { Box, Tab, Tabs, Typography, css } from '@mui/material';
import React, { useState } from 'react';
import { a11yProps } from './helpers';
import { TabPanelProps, VerticalTabsMenuProps } from './types';

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="w-full"
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
