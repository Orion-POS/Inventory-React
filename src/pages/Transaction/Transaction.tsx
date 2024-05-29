import { InputText } from '@/components/forms';
import { ComboboxForm } from '@/components/forms/ComboBox';
import DatePicker from '@/components/forms/DatePicker';
import InputNumber from '@/components/forms/InputNumber';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import getUniqueOptions from '@/utils/getUniqueOption';
import { Search } from '@carbon/icons-react';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { TransactionData } from '@/__dummy__/sampleTransaction';
import { TransactionTypes } from '@/types/transactionTypes';
import formatPrice from '@/utils/formatPrice';

interface FilterFormData {
  search?: string;
  filterType?: string[];
  filterStatus?: string[];
  filterDate?: Date | null;
  filterMore?: any;
}

const Transaction = () => {
  const { openModal } = useModal();
  const [filteredData, setFilteredData] = useState<TransactionTypes[]>(TransactionData);

  const transactionType = getUniqueOptions(TransactionData, 'type');
  const transactionStatus = getUniqueOptions(TransactionData, 'payment_status');

  const formFilter = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      filterType: [],
      filterStatus: [],
      filterDate: null,
      filterMore: null
    }
  });

  const handleOpenModal = () => {
    openModal({
      title: 'Add New Transaction',
      content: () => <ModalContentAddTransaction />,
      modalOptions: {
        // overideFooter: 'TEST',
      }
    });
  };

  const filterData = (data: FilterFormData) => {
    const search = (data.search ?? '').toLowerCase();
    const filterType = data.filterType ?? [];
    const filterStatus = data.filterStatus ?? [];

    let result = TransactionData;

    if (search) {
      result = result.filter(
        item =>
          item.type.toLowerCase().includes(search) || item.supplier.toLowerCase().includes(search)
      );
    }

    if (filterType.length > 0) {
      result = result.filter(item => filterType.includes(item.type));
    }

    if (filterStatus.length > 0) {
      result = result.filter(item => filterStatus.includes(item.payment_status));
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
                name="filterType"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={transactionType}
                    placeholder="Transaction Type"
                    variant="inverted"
                    renderAs="check-only"
                    {...field}
                  />
                )}
              />
              <FormField
                name="filterStatus"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={transactionStatus}
                    placeholder="Transaction Status"
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
              id: 'transaction_id',
              accessorKey: 'transaction_id',
              header: () => <span className="w-full text-start">Transaction ID</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'type',
              accessorKey: 'type',
              header: () => <span className="w-full text-start">Transaction Type</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'supplier',
              accessorKey: 'supplier',
              header: () => <span className="w-full text-start">Supplier</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'total',
              accessorKey: 'total',
              header: () => <span className="w-full text-start">Total Value</span>,
              cell: ({ getValue }) => (
                <span className="w-full">{formatPrice(getValue() as number)}</span>
              )
            },
            {
              id: 'payment_status',
              accessorKey: 'payment_status',
              header: () => <span className="w-full text-start">Payment Status</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Transaction;

const ModalContentAddTransaction = () => {
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
