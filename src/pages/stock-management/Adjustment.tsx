import { adjustmentData } from '@/__dummy__/sampleAdjustment';
import { InputText } from '@/components/forms';
import { ComboboxForm } from '@/components/forms/ComboBox';
import DatePicker from '@/components/forms/DatePicker';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { AdjustmentTypes } from '@/types/itemTypes';
import { useModal } from '@/providers/ModalProvider';
import getUniqueOptions from '@/utils/getUniqueOption';
import { Search } from '@carbon/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AdjustmentContent from './modal-content/AdjustmentContent';
import dayjs from 'dayjs';

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
      subtitle: `${dayjs().format('DD MMM YYYY')}`,
      content: onCloseModal => <AdjustmentContent onCloseModal={onCloseModal} />,
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
              id: 'date',
              accessorKey: 'date',
              header: () => <span className="w-full text-start">Date</span>,
              cell: ({ getValue }) => (
                <span className="w-full text-nowrap">
                   {dayjs(getValue() as string).format('DD/MM/YYYY HH:mm')}
                </span>
              )
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
              header: () => <span className="w-full text-start">Initial Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'current_stock',
              accessorKey: 'current_stock',
              header: () => <span className="w-full text-start">Current Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'adjustment_stock',
              accessorKey: 'adjustment_stock',
              header: () => <span className="w-full text-start">Total Adjustment</span>,
              cell: ({ getValue }) => {
                const adjustmentStock = getValue() as number;
                const colorClass = adjustmentStock < 0 ? 'text-red-500' : 'text-green-500';
                return <span className={`w-full font-semibold ${colorClass}`}>{adjustmentStock}</span>;
              }
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
