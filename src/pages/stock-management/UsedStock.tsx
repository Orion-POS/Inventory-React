import { usedStocksData } from '@/__dummy__/sampleUsedStock';
import { InputText } from '@/components/forms';
import { ComboboxForm } from '@/components/forms/ComboBox';
import DatePicker from '@/components/forms/DatePicker';
import InputNumber from '@/components/forms/InputNumber';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { UsedStockTypes } from '@/types/itemTypes';
import { useModal } from '@/providers/ModalProvider';
import getUniqueOptions from '@/utils/getUniqueOption';
import { Search, SearchLocate } from '@carbon/icons-react';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { css } from '@emotion/react';

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
      content: onCloseModal => <ModalContentAddUsedStock onCloseModal={onCloseModal} />,
      modalOptions: {}
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
              header: () => <span className="w-full text-start">No</span>,
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

const ModalContentAddUsedStock = ({ onCloseModal }: { onCloseModal: () => void }) => {
  const { openModal } = useModal();
  const formSchema = z.object({
    properties: z
      .array(
        z.object({
          itemName: z.string().min(2, {
            message: 'Item Name must be at least 2 characters.'
          }),
          inStock: z.number().min(0, {
            message: 'In Stock must be at 0.'
          }),
          actualStock: z.number().min(1, {
            message: 'Actual Stock must be at least 1.'
          }),
          stockOut: z.number().min(1, {
            message: 'Stock Out must be at least 1.'
          }),
          unit: z.string().min(2, {
            message: 'Unit must be at least 2 characters.'
          })
        })
      )
      .optional()
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      properties: [
        {
          itemName: '',
          inStock: 1.0,
          actualStock: 1.0,
          stockOut: 1.0,
          unit: ''
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
        <div className="w-full ">
          <div className="w-full flex flex-col gap-4 justify-center items-center">
            <h1
              css={css`
                color: var(--Primary-900, #05445f);
                font-family: Inter;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: 24px; /* 150% */
                text-align: left;
                width: 100%;
              `}>
              Review your list:
            </h1>
            <BasicTable
              data={values.properties ?? []}
              tableColumns={[
                {
                  id: 'itemName',
                  accessorKey: 'itemName',
                  header: () => <span className="w-full text-start">Item Name</span>,
                  cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
                },
                {
                  id: 'inStock',
                  accessorKey: 'inStock',
                  header: () => <span className="w-full text-start">In Stock</span>,
                  cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
                },
                {
                  id: 'actualStock',
                  accessorKey: 'actualStock',
                  header: () => <span className="w-full text-start">Actual Stock</span>,
                  cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
                },
                {
                  id: 'stockOut',
                  accessorKey: 'stockOut',
                  header: () => <span className="w-full text-start">Stock Out</span>,
                  cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
                },
                {
                  id: 'unit',
                  accessorKey: 'unit',
                  header: () => <span className="w-full text-start">Unit</span>,
                  cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
                }
              ]}
            />
            <h1
              css={css`
                color: var(--Primary-900, #05445f);
                font-family: Inter;
                font-size: 20px;
                font-style: normal;
                font-weight: 500;
                line-height: 28px; /* 140% */
              `}>
              Are you sure you want to submit the form?
            </h1>
            <p
              css={css`
                color: var(--Grey-Darker, var(--Colors-base-black, #acacac));
                font-family: Inter;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px; /* 142.857% */
              `}>
              Note: This operation will change the current stock item and you will unable to cancel
              or edit.
            </p>
          </div>
          <div className="mt-4 gap-5 flex justify-end">
            <Button type="button" variant={'outline'} onClick={() => onCloseModal()}>
              No
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log(values);
                onCloseModal();
              }}>
              Yes
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
          <div className="flex flex-col gap-3">
            <div className="w-full max-h-[200px] flex flex-col overflow-y-auto px-1 py-2 gap-4">
              {fields.map((item, idx) => (
                <div className="w-full flex flex-1 gap-4 items-start" key={item.id}>
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.itemName`}
                    control={form.control}
                    render={({ field }) => (
                      <InputText
                        containerClassName="flex-1"
                        label={idx > 0 ? '' : 'Item Name'}
                        key={item.id}
                        iconEnd={<SearchLocate className="text-gray-400 h-6 w-6 flex-shrink-0" />}
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.inStock`}
                    control={form.control}
                    render={({ field }) => (
                      <InputNumber
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'In Stock'}
                        key={item.id}
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.actualStock`}
                    control={form.control}
                    render={({ field }) => (
                      <InputNumber
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'Actual Stock'}
                        key={item.id}
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.stockOut`}
                    control={form.control}
                    render={({ field }) => (
                      <InputNumber
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'Stock Out'}
                        key={item.id}
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    key={item.id}
                    name={`properties.${idx}.unit`}
                    control={form.control}
                    render={({ field }) => (
                      <InputText
                        containerClassName="basis-[100px] shrink-0 grow-0"
                        label={idx > 0 ? '' : 'UoM'}
                        key={item.id}
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
                  itemName: '',
                  inStock: 1.0,
                  actualStock: 1.0,
                  stockOut: 1.0,
                  unit: ''
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
