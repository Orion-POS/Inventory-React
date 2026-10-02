import { InputText } from '@/components/forms';
import InputNumber from '@/components/forms/InputNumber';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdjustmentTypes, BaseStockProps } from '@/types/itemTypes';
import SearchInput from '@/components/forms/SearchInput';
import { baseItem } from '@/__dummy__/sampleBaseItem';
import Textarea from '@/components/forms/TextArea';
import AdjustmentConfirm from '../modal-confirmation/AdjustmentConfirm';

interface AdjustmentContentProps {
  onCloseModal: () => void;
  initialValues?: {
    properties: AdjustmentTypes[];
    notes: string;
  };
}

const AdjustmentContent: React.FC<AdjustmentContentProps> = ({ onCloseModal, initialValues }) => {
  const { openModal } = useModal();

  const formSchema = z.object({
    notes: z.string(),
    properties: z
      .array(
        z
          .object({
            name: z.string(),
            in_stock: z.number(),
            current_stock: z.number(),
            adjustment_stock: z.number().min(1, {
              message: 'Stock Out must be at least 1.'
            }),
            uom: z.string(),
            id: z.number(),
            category: z.string(),
            date: z.date()
          })
          .refine(data => data.adjustment_stock <= data.in_stock, {
            message: 'Used Stock must be greater than or equal to initial Stock',
            path: ['adjustment_stock']
          })
      )
      .refine(
        items => {
          const itemNames = items.map(item => item.name);
          const isUnique = new Set(itemNames).size === itemNames.length;
          if (!isUnique) {
            return false;
          }
          return true;
        },
        {
          message: 'Each item must have a unique name.',
          path: ['properties']
        }
      )
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      notes: '',
      properties: [
        {
          name: '',
          in_stock: 0,
          current_stock: 0,
          adjustment_stock: 0,
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
      content: onCloseModal => <AdjustmentConfirm onCloseModal={onCloseModal} values={values} />,
      modalOptions: {}
    });
  };

  const handleSelectChange = (selectedItem: BaseStockProps, idx?: number) => {
    if (selectedItem) {
      const duplicateIndex = form.getValues().properties.findIndex((item, index) => {
        return index !== idx && item.name === selectedItem.name;
      });

      if (duplicateIndex !== -1) {
        const duplicateRowNumber = duplicateIndex + 1;
        console.error(`Item '${selectedItem.name}' already exists in row ${duplicateRowNumber}.`);
      } else {
        if (idx !== undefined) {
          form.setValue(`properties.${idx}.name`, selectedItem.name);
          form.setValue(`properties.${idx}.id`, selectedItem.id);
          form.setValue(`properties.${idx}.category`, selectedItem.category);
          form.setValue(`properties.${idx}.uom`, selectedItem.uom);
          form.setValue(`properties.${idx}.in_stock`, selectedItem.current_stock);
          form.setValue(`properties.${idx}.current_stock`, selectedItem.current_stock);
        }
      }
    }
  };

  const handleUsedStockChange = (value: number, idx: number) => {
    const inStock = form.getValues(`properties.${idx}.in_stock`);
    const currentStock = inStock - value;
    form.setValue(`properties.${idx}.current_stock`, currentStock);
  };

  const handleRemoveItem = (idx: number) => {
    remove(idx);
  };

  return (
    <div className="bg-mary flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="w-full max-h-[200px] flex flex-col overflow-y-auto px-1 py-2 gap-4">
                {fields.map((item, idx) => (
                  <div className="w-full h-full flex flex-1 gap-4 items-start" key={item.id}>
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
                          label={idx > 0 ? '' : 'Current Stock'}
                          key={item.id}
                          disabled
                          {...field}
                        />
                      )}
                    />
                    <FormField
                      key={item.id}
                      name={`properties.${idx}.adjustment_stock`}
                      control={form.control}
                      render={({ field }) => (
                        <InputNumber
                          containerClassName="basis-[100px] shrink-0 grow-0"
                          label={idx > 0 ? '' : 'Adjustment'}
                          key={item.id}
                          {...field}
                          onChange={e => {
                            field.onChange(e);
                            handleUsedStockChange(e, idx);
                          }}
                          disabled={!form.watch(`properties.${idx}.name`)}
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
                    <div
                      className={`w-full ${
                        idx === 0 && 'pt-6'
                      } flex justify-center basis-[50px] shrink-0 grow-0`}>
                      <div className=" pt-2">
                        <Button
                          className="h-full px-2 m-0"
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={fields.length < 2}>
                          <Trash className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-col items-end">
                <Button
                  className="w-28"
                  variant={'link'}
                  type="button"
                  onClick={() =>
                    append({
                      name: '',
                      in_stock: 0,
                      current_stock: 0,
                      adjustment_stock: 0,
                      uom: '',
                      id: 0,
                      category: '',
                      date: new Date()
                    })
                  }>
                  Add item
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <Textarea label="Notes" subLabel="Optional" className="w-full" {...field} />
              )}
            />
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
