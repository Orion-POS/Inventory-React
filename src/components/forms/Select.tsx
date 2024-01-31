// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import React, { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Label } from '../ui/label';
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
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  menuItems,
  footer,
  placeholder,
  ...props
}) => {
  const form = useForm();

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <Label>{label}</Label>
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
        )}
      />
    </Form>
  );
};

export default SelectDropdown;
