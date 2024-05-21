import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import MultiSelectFormField, { MultiSelectFormFieldProps } from '@/components/ui/multi-select';
import { ControllerRenderProps } from 'react-hook-form';

interface ComboboxFormProps
  extends Omit<MultiSelectFormFieldProps, 'defaultValue' | 'onValueChange' | 'options'> {
  data: MultiSelectFormFieldProps['options'];
  label?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

const ComboboxForm: React.FC<ComboboxFormProps & ControllerRenderProps> = ({
  label,
  data,
  placeholder = 'Select items',
  emptyMessage = 'Item not found',
  searchPlaceholder = 'Search item...',
  ...field
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <MultiSelectFormField
          options={data}
          defaultValue={field.value}
          onValueChange={field.onChange}
          placeholder={placeholder}
          {...field}
        />
      </FormControl>
    </FormItem>
  );
};

export { ComboboxForm };
