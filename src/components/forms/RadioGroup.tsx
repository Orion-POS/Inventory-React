import { ControllerRenderProps } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface CustomRadioGroupProps {
  label?: string;
  field: ControllerRenderProps;
  options: {
    label: string;
    value: string;
  }[];
}

/**
  @tutorial https://ui.shadcn.com/docs/components/radio-group
*/

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ label, field, options }) => {
  return (
    <FormItem className="space-y-3">
      <FormLabel>{label ?? ''}</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="flex flex-col space-y-1">
          {options?.map((option, idx) => (
            <FormItem className="flex items-center space-x-3 space-y-0" key={idx}>
              <FormControl>
                <RadioGroupItem value={option.value} />
              </FormControl>
              <FormLabel className="font-normal">{option.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default CustomRadioGroup;
