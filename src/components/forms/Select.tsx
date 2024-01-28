import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import React from 'react';

interface MenuItemsProps {
  label: string;
  value: string | number;
}

const SelectDropdown: React.FC<SelectProps & { menuItems?: MenuItemsProps[] }> = ({
  label,
  menuItems
}) => {
  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel >{label ?? 'Select'}</InputLabel>
      <Select
        // labelId="demo-simple-select-label"
        // id="demo-simple-select"
        // value={age}
        label={label ?? 'Select'}
        // onChange={handleChange}
      >
        {menuItems && menuItems?.map((it, idx) => (
          <MenuItem key={idx} value={it.value}>{it.label}</MenuItem>
        ))}
        {/* <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem> */}
      </Select>
    </FormControl>
  );
};

export default SelectDropdown;
