import * as React from 'react';

import { cn } from '@/lib/utils';
import { ControllerRenderProps } from 'react-hook-form';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconEnd?: React.ReactNode;
  iconStart?: boolean;
  // useFormProps: UseFormReturn;
}

const Input = React.forwardRef<HTMLInputElement, InputProps & Omit<ControllerRenderProps, 'ref'>>(
  ({ className, type, iconEnd, iconStart, ...props }, ref) => {
    return (
      <div className="text-sm font- relative flex flex-col gap-2  ">
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-brand-400 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {iconEnd ? (
          <span className="absolute top-0 right-0 rounded-e-md w-10 text-gray-200 flex focus-visible:text-gray-400 items-center justify-center border-l border-gray-200 h-full">
            {iconEnd}
          </span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
