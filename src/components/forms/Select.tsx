// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import React, { ReactNode } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { FormControl, FormItem, FormLabel } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MenuItemsProps {
  label: string;
  value: string | number;
}

interface SelectDropdownProps {
  label?: string;
  menuItems: MenuItemsProps[];
  footer?: ReactNode;
  placeholder?: string;
  onChange: any;
  value: any;
}

const SelectDropdown: React.FC<SelectDropdownProps & ControllerRenderProps> = ({
  label,
  menuItems,
  footer,
  placeholder,
  ...field
}) => {
  return (
    <FormItem>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
        <FormControl>
          <SelectTrigger className=" justify-between min-w-[120px] gap-3 bg-red-300 text-gray-500 flex items-center px-3 rounded-md  h-9 bg-red- border border-input">
            <SelectValue placeholder={placeholder ?? 'Select'} className="text-black" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {menuItems &&
            menuItems?.map((it, idx) => (
              <SelectItem
                // onCl
                className="flex gap-2 justify-between hover:bg-brand-100 cursor-pointer border-y hover:outline-none"
                key={it.value}
                value={it.label.toString()}>
                {it.label}
              </SelectItem>
            ))}
          {footer ? (
            <div className=" px-2 py-3 border-t border-gray-200 text-base">{footer}</div>
          ) : null}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default SelectDropdown;
