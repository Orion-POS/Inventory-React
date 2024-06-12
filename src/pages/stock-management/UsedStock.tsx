import { InputText } from '@/components/forms';
import { ComboboxForm } from '@/components/forms/ComboBox';
import DatePicker from '@/components/forms/DatePicker';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { UsedStockTypes } from '@/types/itemTypes';
import { useModal } from '@/providers/ModalProvider';
import getUniqueOptions from '@/utils/getUniqueOption';
import { Search } from '@carbon/icons-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsedStock, setUsedStock } from '@/app/services/usedStock';
import UsedStockContent from './modal-content/UsedStockContent';

interface FilterFormData {
  search?: string;
  filterCategory?: string[];
  filterDate?: Date | null;
}

const UsedStcok = () => {
  const { openModal } = useModal();
  const dispatch = useDispatch();
  const usedStocksData = useSelector(selectUsedStock);
  const [filteredData, setFilteredData] = useState<UsedStockTypes[]>(usedStocksData);

  const usedStocksCategory = getUniqueOptions<UsedStockTypes, keyof UsedStockTypes>(
    usedStocksData,
    'category'
  );

  const formFilter = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      filterCategory: [],
      filterDate: null
    }
  });

  useEffect(() => {
    dispatch(setUsedStock(usedStocksData));
  }, [dispatch]);

  const handleOpenModal = () => {
    openModal({
      title: 'Add New Used Stock',
      content: onCloseModal => <UsedStockContent onCloseModal={onCloseModal} />,
      modalOptions: {}
    });
  };

  const filterData = (data: FilterFormData) => {
    const search = (data.search ?? '').toLowerCase();
    const filterCategory = data.filterCategory ?? [];

    let result = usedStocksData;

    if (search) {
      result = result.filter(
        (item: UsedStockTypes) =>
          item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search)
      );
    }

    if (filterCategory.length > 0) {
      result = result.filter((item: UsedStockTypes) => filterCategory.includes(item.category));
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
                const date = new Date(getValue() as string);
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
