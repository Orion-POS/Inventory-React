import { wastedStockData } from '@/__dummy__/sampleWastedStock';
import { InputText } from '@/components/forms';
import { ComboboxForm } from '@/components/forms/ComboBox';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { WastedStockTypes } from '@/types/itemTypes';
import { useModal } from '@/providers/ModalProvider';
import getUniqueOptions from '@/utils/getUniqueOption';
import { Search } from '@carbon/icons-react';
import { useEffect, useState } from 'react';
import {  useForm } from 'react-hook-form';
import WastedStockContent from './modal-content/WastedStockContent';

interface FilterFormData {
  search?: string;
  filterCategory?: string[];
  filterItem?: string[];
  filterMore?: any;
}

const WastedStock = () => {
  const { openModal } = useModal();
  const [filteredData, setFilteredData] = useState<WastedStockTypes[]>(wastedStockData);

  const wastedStockCategory = getUniqueOptions(wastedStockData, 'category');
  const wastedStockItems = getUniqueOptions(wastedStockData, 'name');

  const formFilter = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      filterCategory: [],
      filterItem: [],
      filterMore: null
    }
  });

  const handleOpenModal = () => {
    openModal({
      title: 'Add New Wasted Stock',
      content: () => <WastedStockContent />,
      onSubmit: () => {
        console.log('Form submitted!');
      },
      modalOptions: {
        // overideFooter: 'TEST',
      }
    });
  };

  const filterData = (data: FilterFormData) => {
    const search = (data.search ?? '').toLowerCase();
    const filterCategory = data.filterCategory ?? [];
    const filterItem = data.filterItem ?? [];

    let result = wastedStockData;

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
            Add Wasted Stock
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
                name="filterCategory"
                control={formFilter.control}
                render={({ field }) => (
                  <ComboboxForm
                    data={wastedStockCategory}
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
                    data={wastedStockItems}
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
              id: 'current_stock',
              accessorKey: 'current_stock',
              header: () => <span className="w-full text-start">Actual Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'wasted',
              accessorKey: 'wasted',
              header: () => <span className="w-full text-start">wasted</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'uom',
              accessorKey: 'uom',
              header: () => <span className="w-full text-start">UoM</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'occasion',
              accessorKey: 'occasion',
              header: () => <span className="w-full text-start">Occasion</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            }
          ]}
        />
      </div>
    </div>
  );
};

export default WastedStock;

