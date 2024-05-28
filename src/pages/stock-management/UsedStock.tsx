import { usedStocksData } from '@/__dummy__/sampleUsedStock';
import { InputText } from '@/components/forms';
import { ComboboxForm } from '@/components/forms/ComboBox';
import DatePicker from '@/components/forms/DatePicker';
import InputNumber from '@/components/forms/InputNumber';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UsedStockTypes } from '@/models/itemModel';
import { useModal } from '@/providers/ModalProvider';
import getUniqueOptions from '@/utils/getUniqueOption';
import { Search } from '@carbon/icons-react';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

interface FilterFormData {
  search?: string;
  filterCategory?: string[];
  filterDate?: Date | null;
}

const UsedStcok = () => {
  const { openModal } = useModal();
  const [filteredData, setFilteredData] = useState<UsedStockTypes[]>(usedStocksData);

  const usedStocksCategory = getUniqueOptions(usedStocksData, 'category');

  const formFilter = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      filterCategory: [],
      filterDate: null
    }
  });

  const handleOpenModal = () => {
    openModal({
      title: 'Add New Used Stock',
      content: () => <ModalContentAddUsedStock />,
      modalOptions: {
        // overideFooter: 'TEST',
      }
    });
  };

  const filterData = (data: FilterFormData) => {
    const search = (data.search ?? '').toLowerCase();
    const filterCategory = data.filterCategory ?? [];

    let result = usedStocksData;

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
            Add Used Stock
          </Button>
          <Button size={'sm'} variant={'ghost'}>
            Import / Export Data
          </Button>
        </div>
        <div className="flex justify-between items-center flex-wrap">
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
                name="filterCategory"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={usedStocksCategory}
                    placeholder="Item Category"
                    variant="inverted"
                    renderAs="check-only"
                    {...field}
                  />
                )}
              />
              <FormField
                name="filterDate"
                control={formFilter.control}
                render={({}) => <DatePicker />}
              />
            </div>
          </Form>
        </div>
      </div>
      {/* END OF TOOLBAR */}

      {/* TABLE */}
      <div className="w-full overflow-scroll">
        <BasicTable
          data={filteredData}
          tableColumns={[
            {
              id: 'id',
              size: 50,
              accessorKey: 'id',
              header: () => <span className="w-full text-start">ID</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'date',
              accessorKey: 'date',
              header: () => <span className="w-full text-start">Date</span>,
              cell: ({ getValue }) => {
                const date = new Date(getValue() as string); // Assuming date is a string
                return (
                  <span className="w-full text-nowrap">{format(date, 'dd/MM/yyyy HH:mm')}</span>
                );
              }
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
              id: 'in_stock',
              accessorKey: 'in_stock',
              header: () => <span className="w-full text-start">In Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'used_stock',
              accessorKey: 'used_stock',
              header: () => <span className="w-full text-start">Used Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'current_stock',
              accessorKey: 'current_stock',
              header: () => <span className="w-full text-start">Current Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'uom',
              accessorKey: 'uom',
              header: () => <span className="w-full text-start">UoM</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'actions',
              header: () => <span className="text-center w-full">Actions</span>,
              enableSorting: false,
              // size: 40,
              cell: () => (
                <div className="w-fll flex justify-center gap-2">
                  <Button size={'sm'} variant={'ghost'} className="text-gray-500">
                    Edit
                  </Button>
                  <Button size={'sm'} variant="ghost">
                    Assign to Item
                  </Button>
                </div>
              )
            }
          ]}
        />
      </div>
      {/* END OF TABLE */}
    </div>
  );
};

export default UsedStcok;

const ModalContentAddUsedStock = () => {
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
