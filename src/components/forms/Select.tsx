// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MenuItemsProps {
  label: string;
  value: string | number;
}

const SelectDropdown: React.FC = ({ label, menuItems }) => {
  const form = useForm();
  console.log(form.getValues(), '<< CEKFIELS');
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-[180px] justify-between bg-red-300 text-gray-500 flex items-center px-3 rounded-md  h-9 bg-red- border border-input">
                  <SelectValue placeholder="Select" className="text-black" />
                  {/* <ChevronDown /> */}
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white shadow-md text-black w-[180px] pt-3 SelectContent">
                {menuItems &&
                  menuItems?.map((it, idx) => (
                    <SelectItem
                      // onCl
                      className="py-2 px-3 hover:bg-brand-100 cursor-pointer border-y hover:outline-none"
                      key={it.value}
                      value={it.label.toString()}>
                      {it.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </Form>
  );
};

export default SelectDropdown;
