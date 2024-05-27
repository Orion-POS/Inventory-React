import { stockOpnameData } from '@/__dummy__/sampleStokcOpname';
import { InputText } from '@/components/forms';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import formatPrice from '@/utils/formatPrice';
import { Search } from '@carbon/icons-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { useFieldArray, useForm } from 'react-hook-form';
import InputNumber from '@/components/forms/InputNumber';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash } from 'lucide-react';
import { ComboboxForm } from '@/components/forms/ComboBox';
import dayjs from 'dayjs';

const StockOpname = () => {
  const { openModal } = useModal();

  const monthList = Array.from({ length: 12 }, (_, index) => ({
    label: dayjs().month(index).format('MMMM'),
    value: index + 1
  }));

  const formFilter = useForm({
    defaultValues: {
      search: '',
      filterCategory: []
    }
  });

  const handleSubmit = (data: any) => {
    console.log(data, '<< DATA SUBMITTED');
  };

  const handleOpenModal = () => {
    openModal({
      title: 'Add New UoM Category',
      content: () => <ModalContentAddUoM onSubmit={handleSubmit} />,
      modalOptions: {
        // overideFooter: 'TEST',
      }
    });
  };
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
            <FormField
              name="filterCategory"
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
          </Form>
        </div>
      </div>

      {/* END OF TOOLBAR */}
      <div className="w-full overflow-scroll">
        <BasicTable
          data={stockOpnameData}
          tableColumns={[
            {
              id: 'id',
              size: 50,
              accessorKey: 'id',
              header: () => <span className="w-full text-start">ID</span>,
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

const ModalContentAddUoM = ({ onSubmit }) => {
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
