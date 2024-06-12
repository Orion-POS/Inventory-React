import { InputText } from '@/components/forms';
import InputNumber from '@/components/forms/InputNumber';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseStockProps, UsedStockTypes } from '@/types/itemTypes';
import UsedStockConfirm from '../modal-confirmation/UsedStockConfirm';
import SearchInput from '@/components/forms/SearchInput';
import { baseItem } from '@/__dummy__/sampleBaseItem';

interface UsedStockContentProps {
  onCloseModal: () => void;
  initialValues?: UsedStockTypes[];
}

const UsedStockContent: React.FC<UsedStockContentProps> = ({ onCloseModal, initialValues }) => {
  const { openModal } = useModal();

  const formSchema = z.object({
    properties: z.array(
      z.object({
        name: z.string().min(2, {
          message: 'Item Name must be at least 2 characters.'
        }),
        in_stock: z.number(),
        current_stock: z.number(),
        used_stock: z.number().min(1, {
          message: 'Stock Out must be at least 1.'
        }),
        uom: z.string(),
        id: z.number(),
        category: z.string(),
        date: z.date()
      })
    )
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      properties: initialValues || [
        {
          name: '',
          in_stock: 0,
          current_stock: 0,
          used_stock: 0,
          uom: '',
          id: 0,
          category: '',
          date: new Date()
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
      content: onCloseModal => (
        <UsedStockConfirm onCloseModal={onCloseModal} values={values.properties} />
      ),
      modalOptions: {}
    });
  };

  const handleSelectChange = (selectedItem: BaseStockProps, idx: number) => {
    if (selectedItem) {
      form.setValue(`properties.${idx}.name`, selectedItem.name);
      form.setValue(`properties.${idx}.id`, selectedItem.id);
      form.setValue(`properties.${idx}.category`, selectedItem.category);
      form.setValue(`properties.${idx}.uom`, selectedItem.uom);
      form.setValue(`properties.${idx}.in_stock`, selectedItem.current_stock);
      form.setValue(`properties.${idx}.current_stock`, selectedItem.current_stock);
    }
  };

  const handleUsedStockChange = (value: number, idx: number) => {
    const inStock = form.getValues(`properties.${idx}.in_stock`);
    const currentStock = inStock - value;
    form.setValue(`properties.${idx}.current_stock`, currentStock);
  };

  return (
    <div className="bg-mary flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="w-full max-h-[200px] flex flex-col overflow-y-auto px-1 py-2 gap-4">
              {fields.map((item, idx) => (
                <div className="w-full flex flex-1 gap-4 items-start" key={item.id}>
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.name`}
                    control={form.control}
                    render={({ field }) => (
                      <SearchInput
                        containerClassName="flex-1 shrink-0 basis-[200px]"
                        idx={idx}
                        label={idx > 0 ? '' : 'Item Name'}
                        key={item.id}
                        data={baseItem}
                        onItemSelect={handleSelectChange}
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.in_stock`}
                    control={form.control}
                    render={({ field }) => (
                      <InputNumber
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'In Stock'}
                        key={item.id}
                        disabled
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.current_stock`}
                    control={form.control}
                    render={({ field }) => (
                      <InputNumber
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'Actual Stock'}
                        key={item.id}
                        disabled
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.used_stock`}
                    control={form.control}
                    render={({ field }) => (
                      <InputNumber
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'Stock Out'}
                        key={item.id}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          handleUsedStockChange(e, idx);
                        }}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.uom`}
                    control={form.control}
                    render={({ field }) => (
                      <InputText
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'UoM'}
                        key={item.id}
                        disabled
                        {...field}
                      />
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
              ))}
            </div>
            <Button
              className="w-28"
              variant={'outline'}
              type="button"
              onClick={() =>
                append({
                  name: '',
                  in_stock: 1.0,
                  current_stock: 1.0,
                  used_stock: 1.0,
                  uom: '',
                  id: 0,
                  category: '',
                  date: new Date()
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

export default UsedStockContent;
