import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';

const InputText: React.FC<InputProps & { iconEnd?: React.ReactNode; iconStart?: boolean }> = ({
  label,
  iconEnd = null,
  placeholder
}) => {
  const form = useForm();
  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-sm">{label}</FormLabel>
              <FormControl>
                <div className="text-sm font- relative flex flex-col gap-2">
                  <Input className="w-full" placeholder={placeholder} label={label} />
                  {iconEnd ? (
                    <span className="absolute top-0 right-0 rounded-e-md w-10 text-gray-200 flex focus-visible:text-gray-400 items-center justify-center border-l border-gray-200 h-full">
                      {iconEnd}
                    </span>
                  ) : null}
                </div>
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default InputText;
