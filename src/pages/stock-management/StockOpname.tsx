import { stockOpnameData } from '@/__dummy__/sampleStokcOpname';
import { InputText } from '@/components/forms';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import formatPrice from '@/utils/formatPrice';
import { Search } from '@carbon/icons-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { useForm } from 'react-hook-form';
import { ComboboxForm } from '@/components/forms/ComboBox';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import getUniqueOptions from '@/utils/getUniqueOption';
import { StockOpnameTypes } from '@/types/itemTypes';
import StockOpnameContent from './modal-content/StockOpnameContent';
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
      content: onCloseModal => <StockOpnameContent onCloseModal={onCloseModal} />,
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


