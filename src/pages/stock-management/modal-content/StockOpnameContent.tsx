import { InputText } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Textarea from '@/components/forms/TextArea';
import InputNumber from '@/components/forms/InputNumber';
import SearchInput from '@/components/forms/SearchInput';
import { baseItem } from '@/__dummy__/sampleBaseItem';
import { BaseStockProps } from '@/types/itemTypes';

interface StockOpnameContentProps {
  onCloseModal: () => void;
  initialValue?: any;
}

const StockOpnameContent: React.FC<StockOpnameContentProps> = ({ onCloseModal, initialValue }) => {
  const { openModal } = useModal();
  const formSchema = z.object({
    itemName: z.string().min(2, {
      message: 'Username must be at least 2 characters.'
    }),
    inStock: z.number(),
    actualStock: z.number(),
    difference: z.number(),
    uom: z.string(),
    notes: z.string().optional()
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue || {
      itemName: '',
      inStock: 0,
      actualStock: 0,
      difference: 0,
      uom: '',
      notes: ''
    }
  });

  const handleSelectChange = (selectedItem: BaseStockProps) => {
    if (selectedItem) {
      form.setValue('itemName', selectedItem.name);
      form.setValue('inStock', selectedItem.current_stock);
      form.setValue('uom', selectedItem.uom);
    }
  };

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

  const calculateDifference = (inStock: number, actualStock: number) => {
    return inStock - actualStock;
  };

  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'inStock' || name === 'actualStock') {
        const inStock = values.inStock ?? 0;
        const actualStock = values.actualStock ?? 0;
        const difference = calculateDifference(inStock, actualStock);
        form.setValue('difference', difference, { shouldValidate: true, shouldDirty: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="bg-mary flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              name={'itemName'}
              control={form.control}
              render={({ field }) => (
                <SearchInput
                  className="w-full"
                  label="Item name"
                  data={baseItem}
                  onItemSelect={handleSelectChange}
                  {...field}
                />
              )}
            />
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <InputNumber label="In Stock" disabled className="w-full" {...field} />
                )}
              />
              <FormField
                control={form.control}
                name="actualStock"
                render={({ field }) => (
                  <InputNumber
                    label="Actual Stock"
                    className="w-full"
                    {...field}
                    disabled={!form.watch('itemName')}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="difference"
                render={({ field }) => (
                  <InputNumber
                    label="Difference"
                    readOnly
                    className={`w-full ${field.value < 0 ? 'text-red-500' : 'text-green-500'}`}
                    {...field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="uom"
                render={({ field }) => (
                  <InputText disabled label="UoM" className="w-full" {...field} />
                )}
              />
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

export default StockOpnameContent;
