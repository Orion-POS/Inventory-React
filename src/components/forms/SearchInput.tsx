import { BaseStockProps } from '@/types/itemTypes';
import { useState, useEffect } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { SearchLocate } from '@carbon/icons-react';

interface SearchInputProps {
  key?: string;
  containerClassName?: string;
  idx?: number;
  label?: string;
  placeholder?: string;
  data: BaseStockProps[];
  onItemSelect: (item: BaseStockProps, idx?: number) => void;
}

const SearchInput: React.FC<SearchInputProps & InputProps & ControllerRenderProps> = ({
  key,
  containerClassName,
  idx,
  label,
  placeholder,
  data,
  onItemSelect,
  ...field
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<BaseStockProps[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const results = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm, data]);

  const handleSelect = (item: BaseStockProps) => {
    setSearchTerm('');
    onItemSelect(item, idx);
    setFilteredItems([]);
  };

  return (
    <FormItem key={key} className={containerClassName}>
      <FormLabel className="font-medium text-sm">{label}</FormLabel>
      <FormControl>
        <div className="text-sm font- relative flex flex-col gap-2  ">
          <Input
            placeholder={placeholder}
            label={label}
            {...field}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="absolute top-0 right-0 rounded-e-md w-10 text-gray-200 flex focus-visible:text-gray-400 items-center justify-center border-l border-gray-200 h-full">
            <SearchLocate className="text-gray-400 h-6 w-6 flex-shrink-0" />
          </span>
          {filteredItems.length > 0 ? (
            <ul className="absolute z-[99900] w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto">
              {filteredItems.map(item => (
                <li
                  key={item.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelect(item)}>
                  {item.name}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </FormControl>
      <FormMessage className="text-xs" />
    </FormItem>
  );
};

export default SearchInput;
