import { InputText } from '@/components/forms';
import InputNumber from '@/components/forms/InputNumber';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface AdjustmentContentProps {
  onCloseModal: () => void;
  initialValues?: any;
}

const AdjustmentContent: React.FC<AdjustmentContentProps> = ({ onCloseModal, initialValues }) => {
  const { openModal } = useModal();

  const formSchema = z.object({
    itemName: z.string().min(2, {
      message: 'Username must be at least 2 characters.'
    }),
    properties: z
      .array(
        z.object({
          unit: z.string().min(2, {
            message: 'Unit must be at least 2 characters.'
          }),
          type: z.string().min(2, {
            message: 'Type must be at least 2 characters.'
          }),
          ratio: z.number().min(0.01, {
            message: 'Ratio must be at least 0.01.'
          }),
          rounding: z.number().min(0.01, {
            message: 'Rounding must be at least 0.01.'
          }),
          active: z.boolean(),
          default: z.boolean()
        })
      )
      .optional()
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    openModal({
      title: 'Confirmation',
      content: () => (
        <div>
          <p>Are you sure you want to submit the form?</p>
          <div className=" mt-5 gap-2 flex">
            <Button type="button" variant={'outline'} onClick={() => onCloseModal()}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log(values);
                onCloseModal();
              }}>
              Submit
            </Button>
          </div>
        </div>
      ),
      modalOptions: {}
    });
  };

  return (
    <div className="bg-mary flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="itemName"
            render={({ field }) => <InputText label="Item name" className="w-full" {...field} />}
          />
          <div className="flex flex-col gap-3">
            <div className="max-h-[200px] flex flex-col overflow-y-auto px-1 py-2 gap-3">
              {fields.map((item, idx) => (
                <div className="grid grid-cols-5 gap-3 items-start" key={item.id}>
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
                      <InputNumber
                        label={idx > 0 ? '' : 'Rounding'}
                        key={item.id}
                        {...field}
                        className="h-full"
                      />
                    )}
                  />
                  <div className="h-full min-w-[150px] grid grid-cols-3 pt-1 gap-3 items-center">
                    <FormField
                      key={item.id}
                      name={`properties.${idx}.active`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem
                          className={`h-full flex flex-col gap-3 ${
                            idx > 0 ? 'justify-start pt-4' : ''
                          }  items-center min-w-[50px]`}>
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
                        <FormItem
                          className={`h-full flex flex-col gap-3 ${
                            idx > 0 ? 'justify-start pt-4' : ''
                          }  items-center min-w-[50px]`}>
                          {idx > 0 ? null : (
                            <FormLabel className="font-medium text-sm">Default</FormLabel>
                          )}
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className={`h-full flex flex-col gap-3 items-center min-w-[50px]`}>
                      {idx > 0 ? (
                        <Button className="px-2 m-0" type="button" onClick={() => remove(idx)}>
                          <Trash className="w-5 h-5 text-white" />
                        </Button>
                      ) : (
                        <div className="w-5 h-5 m-0 p-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-28"
              variant={'outline'}
              type="button"
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
        </form>
      </Form>
      <div className=" self-end mt-5 gap-2 flex">
        <Button type="button" variant={'outline'} onClick={() => onCloseModal()}>
          Cancel
        </Button>
        <Button
          type="button"
          // disabled={!form.formState.isValid}
          onClick={form.handleSubmit(onSubmit)}>
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default AdjustmentContent;
