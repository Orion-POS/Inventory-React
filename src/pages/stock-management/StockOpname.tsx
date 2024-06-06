import { stockOpnameData } from '@/__dummy__/sampleStokcOpname';
import { InputText } from '@/components/forms';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import formatPrice from '@/utils/formatPrice';
import { Search, SearchLocate } from '@carbon/icons-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { useForm } from 'react-hook-form';
import { ComboboxForm } from '@/components/forms/ComboBox';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import getUniqueOptions from '@/utils/getUniqueOption';
import { StockOpnameTypes } from '@/types/itemTypes';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Textarea from '@/components/forms/TextArea';
import InputNumber from '@/components/forms/InputNumber';

interface FilterFormData {
  search?: string;
  filterCategory?: string[];
  filterItem?: string[];
  filterMonth?: string;
  filterMore?: any;
}

const StockOpname = () => {
  const { openModal } = useModal();
  const [filteredData, setFilteredData] = useState<StockOpnameTypes[]>(stockOpnameData);

  const stockOpnameCategory = getUniqueOptions(stockOpnameData, 'category');
  const stockOpnameItems = getUniqueOptions(stockOpnameData, 'name');

  const monthList = Array.from({ length: 12 }, (_, index) => ({
    label: dayjs().month(index).format('MMMM'),
    value: (index + 1).toString()
  }));

  const formFilter = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      filterCategory: [],
      filterItem: [],
      filterMonth: '1',
      filterMore: []
    }
  });

  const handleOpenModal = () => {
    openModal({
      title: 'Add New Stock Opname',
      content: onCloseModal => <ModalContentAddStockOpname onCloseModal={onCloseModal} />,
      modalOptions: {}
    });
  };

  const filterData = (data: FilterFormData) => {
    const search = (data.search ?? '').toLowerCase();
    const filterCategory = data.filterCategory ?? [];
    const filterItem = data.filterItem ?? [];

    let result = stockOpnameData;

    if (search) {
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search)
      );
    }

    if (filterCategory.length > 0) {
      result = result.filter(item => filterCategory.includes(item.category));
    }

    if (filterItem.length > 0) {
      result = result.filter(item => filterItem.includes(item.name));
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
            Add Stock Opname
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
            <div className="flex flex-wrap items-center gap-3">
              <FormField
                name="filterMonth"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={monthList}
                    placeholder="Select Month"
                    variant="inverted"
                    renderAs="check-only"
                    {...field}
                  />
                )}
              />
              <FormField
                name="filterCategory"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={stockOpnameCategory}
                    placeholder="Item Category"
                    variant="inverted"
                    renderAs="check-only"
                    {...field}
                  />
                )}
              />
              <FormField
                name="filterItem"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={stockOpnameItems}
                    placeholder="Item Library"
                    variant="inverted"
                    renderAs="check-only"
                    {...field}
                  />
                )}
              />
              <FormField
                name="filterMore"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={[
                      {
                        label: 'A',
                        value: 'a'
                      },
                      {
                        label: 'b',
                        value: 'b'
                      },
                      {
                        label: 's',
                        value: 's'
                      },
                      {
                        label: 'd',
                        value: 'd'
                      }
                    ]}
                    placeholder="More Filters"
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
              id: 'final_stock',
              accessorKey: 'final_stock',
              header: () => <span className="w-full text-start">Final Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'uom',
              accessorKey: 'uom',
              header: () => <span className="w-full text-start">UoM</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'average_price',
              accessorKey: 'average_price',
              header: () => <span className="w-full text-start">Average Price</span>,
              cell: ({ getValue }) => (
                <span className="w-full">{formatPrice(getValue() as number)}</span>
              )
            },
            {
              id: 'total_amounts',
              accessorKey: 'total_amounts',
              header: () => <span className="w-full text-start">Total Amounts</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            }
          ]}
        />
      </div>
    </div>
  );
};

export default StockOpname;

const ModalContentAddStockOpname = ({ onCloseModal }: { onCloseModal: () => void }) => {
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
    defaultValues: {
      itemName: '',
      inStock: 12,
      actualStock: 0,
      difference: 12,
      uom: 'Sack',
      notes: ''
    }
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

  const calculateDifference = (inStock: number, actualStock: number) => {
    return inStock - actualStock;
  };

  useEffect(() => {
    const subscription = form.watch(values => {
      const inStock = values.inStock ?? 0;
      const actualStock = values.actualStock ?? 0;
      const difference = calculateDifference(inStock, actualStock);
      form.setValue('difference', difference);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, form.setValue]);

  return (
    <div className="bg-mary flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <InputText
                  label="Item name"
                  className="w-full"
                  iconEnd={<SearchLocate className="text-gray-400 h-6 w-6 flex-shrink-0" />}
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
                  <InputNumber label="Actual Stock" className="w-full" {...field} />
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
