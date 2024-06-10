import { adjustmentData } from '@/__dummy__/sampleAdjustment';
import { InputText } from '@/components/forms';
import { ComboboxForm } from '@/components/forms/ComboBox';
import DatePicker from '@/components/forms/DatePicker';
import InputNumber from '@/components/forms/InputNumber';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { AdjustmentTypes } from '@/types/itemTypes';
import { useModal } from '@/providers/ModalProvider';
import getUniqueOptions from '@/utils/getUniqueOption';
import { Search } from '@carbon/icons-react';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface FilterFormData {
  search?: string;
  filterCategory?: string[];
  filterDate?: Date | null;
}

const Adjustment = () => {
  const { openModal } = useModal();
  const [filteredData, setFilteredData] = useState<AdjustmentTypes[]>(adjustmentData);

  const adjustmentCategory = getUniqueOptions(adjustmentData, 'category');

  const formFilter = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      filterCategory: [],
      filterDate: null
    }
  });

  const handleOpenModal = () => {
    openModal({
      title: 'Add New Adjustment',
      content: onCloseModal => <ModalContentAdjustment onCloseModal={onCloseModal} />,
      modalOptions: {}
    });
  };

  const filterData = (data: FilterFormData) => {
    const search = (data.search ?? '').toLowerCase();
    const filterCategory = data.filterCategory ?? [];

    let result = adjustmentData;

    if (search) {
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search)
      );
    }

    if (filterCategory.length > 0) {
      result = result.filter(item => filterCategory.includes(item.category));
    }

    setFilteredData(result);
  };

  useEffect(() => {
    const subscription = formFilter.watch(data => filterData(data));
    return () => subscription.unsubscribe();
  }, [formFilter]);

  return (
    <div className="w-full bg-ray-300 flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-2">
        <div className="w-100 flex justify-between">
          <Button size={'sm'} onClick={handleOpenModal}>
            Add Stock Adjustment
          </Button>
          <Button size={'sm'} variant={'ghost'}>
            Import / Export Data
          </Button>
        </div>
        <div className="flex justify-between items-center ">
          <Form {...formFilter}>
            <FormField
              name="search"
              control={formFilter.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputText
                      iconEnd={<Search />}
                      placeholder="Search"
                      className=" w-64"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-3 items-center flex-wrap">
              <FormField
                name="filterDate"
                control={formFilter.control}
                render={({}) => <DatePicker />}
              />
              <FormField
                name="filterCategory"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={adjustmentCategory}
                    placeholder="Item Category"
                    variant="inverted"
                    renderAs="check-only"
                    {...field}
                  />
                )}
              />
            </div>
          </Form>
        </div>
      </div>

      {/* END OF TOOLBAR */}
      <div className="w-full overflow-scroll">
        <BasicTable
          data={filteredData}
          tableColumns={[
            {
              id: 'id',
              size: 50,
              accessorKey: 'id',
              header: () => <span className="w-full text-start">No</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'category',
              accessorKey: 'category',
              header: () => <span className="w-full text-start">Item Category</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'name',
              accessorKey: 'name',
              header: () => <span className="w-full text-start">Item Name</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'date',
              accessorKey: 'date',
              header: () => <span className="w-full text-start">Date</span>,
              cell: ({ getValue }) => (
                <span className="w-full text-nowrap">
                  {new Date(getValue() as Date).toLocaleString()}
                </span>
              )
            },
            {
              id: 'in_stock',
              accessorKey: 'in_stock',
              header: () => <span className="w-full text-start">In Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'actual_stock',
              accessorKey: 'actual_stock',
              header: () => <span className="w-full text-start">Actual Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'adjustment_stock',
              accessorKey: 'adjustment_stock',
              header: () => <span className="w-full text-start">Adjustment Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'uom',
              accessorKey: 'uom',
              header: () => <span className="w-full text-start">UoM</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Adjustment;

const ModalContentAdjustment = ({ onCloseModal }: { onCloseModal: () => void }) => {
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
