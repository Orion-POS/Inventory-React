import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form';

interface SingleCheckboxProps {
  item: {
    id: string;
    label: string;
  };
  field: ControllerRenderProps;
}

const SingleCheckbox: React.FC<SingleCheckboxProps> = ({ item, field }) => {
  return (
    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value?.includes(item.id)}
          onCheckedChange={checked => {
            return checked
              ? field.onChange([...field.value, item.id])
              : field.onChange(field.value?.filter(value => value !== item.id));
          }}
        />
      </FormControl>
      <FormLabel className="font-normal">{item.label}</FormLabel>
    </FormItem>
  );
};

interface CheckboxGroupProps {
  items: Record<string, any>;
  form: UseFormReturn<CheckboxGroupProps['items'], any, undefined>;
  name: string;
  label?: string;
  desc?: string;
}

/**
  @tutorial https://ui.shadcn.com/docs/components/checkbox
*/

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, form, name, desc, label }) => {
  return (
    <FormItem>
      <div className="mb-4">
        {label ? <FormLabel className="text-base">{label}</FormLabel> : null}
        {desc ? <FormDescription>{desc}</FormDescription> : null}
      </div>
      {items.map(it => (
        <FormField
          key={it.id}
          control={form.control}
          name={name}
          render={({ field }) => <SingleCheckbox item={it} field={field} />}
        />
      ))}
    </FormItem>
  );
};

export { CheckboxGroup, SingleCheckbox };
