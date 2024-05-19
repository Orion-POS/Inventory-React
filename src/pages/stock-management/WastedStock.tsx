import { wastedStockData } from '@/__dummy__/sampleWastedStock';
import { InputText } from '@/components/forms';
import SelectDropdown from '@/components/forms/Select';
import Textarea from '@/components/forms/TextArea';
import BasicModal from '@/components/modals/Modal';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Search } from '@carbon/icons-react';
import { useState } from 'react';

const WastedStock = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="w-full bg-ray-300 flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-2">
        <div className="w-100 flex justify-between">
          <Button size={'sm'} onClick={() => setOpenModal(true)}>
            Add Wasted Stock
          </Button>
          <Button size={'sm'} variant={'ghost'}>
            Import / Export Data
          </Button>
        </div>
        <div className="flex justify-between items-center ">
          <InputText iconEnd={<Search />} placeholder="Search" className=" w-64" />
          <div className="flex items-center gap-3">
            <SelectDropdown
              placeholder="Item Category"
              menuItems={[
                {
                  label: 'Item A',
                  value: 1
                },
                {
                  label: 'Item B',
                  value: 2
                }
              ]}
            />
            <SelectDropdown
              placeholder="Item Library"
              menuItems={[
                {
                  label: 'Item A',
                  value: 1
                },
                {
                  label: 'Item B',
                  value: 2
                }
              ]}
            />
            <SelectDropdown
              placeholder="More Filters"
              menuItems={[
                {
                  label: 'Item A',
                  value: 1
                },
                {
                  label: 'Item B',
                  value: 2
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* END OF TOOLBAR */}
      <BasicTable
        data={wastedStockData}
        tableColumns={[
          {
            id: 'sku',
            size: 50,
            accessorKey: 'sku',
            header: () => <span className="w-full text-start">SKU</span>,
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
            id: 'actual_stock',
            accessorKey: 'actual_stock',
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

      <BasicModal
        open={openModal}
        disableClickOutside
        title="Add Wasted Stock"
        onClose={() => setOpenModal(false)}>
        <InputText label="Category name" className="w-full" />
        <SelectDropdown
          label="Transaction Type"
          menuItems={[
            {
              label: 'Bahan Makanan',
              value: 'bahan makanan'
            },
            {
              label: 'Bahan Minuman',
              value: 'bahan minuman'
            }
          ]}
        />
        <Textarea label="Notes (optional)" placeholder="Input your notes" />
      </BasicModal>
    </div>
  );
};

export default WastedStock;
