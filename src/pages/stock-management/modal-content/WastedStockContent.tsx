import { InputText } from '@/components/forms';
import InputNumber from '@/components/forms/InputNumber';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

const WastedStockContent = () => {
  const form = useForm({
    defaultValues: {
      itemName: '',
      properties: [
        {
          unit: '',
          type: '',
          ratio: 1.0,
          rounding: 0.01,
          active: true,
          default: true
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'properties'
  });

  return (
    <div className="bg-mary flex flex-col gap-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => <InputText label="Item name" className="w-full" {...field} />}
        />
        <div className="flex flex-col gap-3">
          {/**
           * USING NESTED FORM.
           * @tutorial https://github.com/shadcn-ui/ui/discussions/2807
           *
           */}
          <div className="max-h-[200px] flex flex-col overflow-y-auto px-1">
            {fields.map((item, idx) => (
              <div className="flex gap-3" key={idx}>
                {/* <div className="w-full"> */}
                <FormField
                  key={item.id}
                  name={`properties.${idx}.unit`}
                  control={form.control}
                  render={({ field }) => (
                    <InputText
                      className="w-full"
                      label={idx > 0 ? '' : 'Unit'}
                      key={item.id}
                      {...field}
                    />
                  )}
                />
                {/* </div> */}
                <FormField
                  key={item.id}
                  name={`properties.${idx}.type`}
                  control={form.control}
                  render={({ field }) => (
                    <InputText label={idx > 0 ? '' : 'Type'} key={item.id} {...field} />
                  )}
                />
                <FormField
                  key={item.id}
                  name={`properties.${idx}.ratio`}
                  control={form.control}
                  render={({ field }) => (
                    <InputNumber label={idx > 0 ? '' : 'Ratio'} key={item.id} {...field} />
                  )}
                />
                <FormField
                  key={item.id}
                  name={`properties.${idx}.rounding`}
                  control={form.control}
                  render={({ field }) => (
                    <InputNumber label={idx > 0 ? '' : 'Rounding'} key={item.id} {...field} />
                  )}
                />
                <FormField
                  key={item.id}
                  name={`properties.${idx}.active`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-center">
                      {idx > 0 ? null : (
                        <FormLabel className="font-medium text-sm">Active</FormLabel>
                      )}
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  key={item.id}
                  name={`properties.${idx}.default`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-center">
                      {idx > 0 ? null : (
                        <FormLabel className="font-medium text-sm">Default</FormLabel>
                      )}
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {idx > 0 ? (
                  <Button className="w-5 h-5" onClick={() => remove(idx)}>
                    <Trash className="w-5 h-5" />
                  </Button>
                ) : (
                  <div className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>

          <Button
            className="w-28"
            variant={'outline'}
            onClick={() =>
              append({
                unit: '',
                active: false,
                default: false,
                ratio: 1.0,
                rounding: 0.01,
                type: ''
              })
            }>
            + Add UoM
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WastedStockContent;
