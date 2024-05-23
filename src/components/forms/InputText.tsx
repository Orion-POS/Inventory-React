import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface InputTextProps {
  iconEnd?: React.ReactNode;
  iconStart?: boolean;
  description?: string;
  key?: string;
}

const InputText: React.FC<InputProps & InputTextProps & ControllerRenderProps> = ({
  label,
  iconEnd = null,
  placeholder,
  description,
  key,
  ...field
}) => {
  return (
    <FormItem key={key}>
      <FormLabel className="font-medium text-sm">{label}</FormLabel>
      <FormControl>
        <div className="text-sm font- relative flex flex-col gap-2  ">
          <Input placeholder={placeholder} label={label} {...field} />
          {iconEnd ? (
            <span className="absolute top-0 right-0 rounded-e-md w-10 text-gray-200 flex focus-visible:text-gray-400 items-center justify-center border-l border-gray-200 h-full">
              {iconEnd}
            </span>
          ) : null}
        </div>
      </FormControl>
      {description ? <FormDescription>{description}</FormDescription> : null}
      <FormMessage />
    </FormItem>
  );
};

export default InputText;
