import { adjustmentData } from '@/__dummy__/sampleAdjustment';
import { InputText } from '@/components/forms';
import SelectDropdown from '@/components/forms/Select';
import Textarea from '@/components/forms/TextArea';
import BasicModal from '@/components/modals/Modal';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Search } from '@carbon/icons-react';
import { useState } from 'react';

const Adjustment = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="w-full bg-ray-300 flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-2">
        <div className="w-100 flex justify-between">
          <Button size={'sm'} onClick={() => setOpenModal(true)}>
            Add Stock Adjustment
          </Button>
          <Button size={'sm'} variant={'ghost'}>
            Import / Export Data
          </Button>
        </div>
        <div className="flex justify-between items-center ">
          <InputText iconEnd={<Search />} placeholder="Search" className=" w-64" />
          <div className="flex items-center gap-2">
            <SelectDropdown
              placeholder="Select"
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
        data={adjustmentData}
        tableColumns={[
          {
            id: 'id',
            size: 50,
            accessorKey: 'id',
            header: () => <span className="w-full text-start">ID</span>,
            cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
          },
          {
            id: 'category',
            accessorKey: 'category',
            header: () => <span className="w-full text-start">Category Name</span>,
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
            id: 'in_stock',
            accessorKey: 'in_stock',
            header: () => <span className="w-full text-start">In Stock</span>,
            cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
          },
          {
            id: 'actual_stock',
            accessorKey: 'actual_stock',
            header: () => <span className="w-full text-start">Actual Stock</span>,
            cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
          },
          {
            id: 'adjustment_stock',
            accessorKey: 'adjustment_stock',
            header: () => <span className="w-full text-start">Adjustment Stock</span>,
            cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
          },
          {
            id: 'uom',
            accessorKey: 'uom',
            header: () => <span className="w-full text-start">UoM</span>,
            cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
          }
        ]}
      />

      <BasicModal
        open={openModal}
        disableClickOutside
        title="Create item category"
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
        <Textarea label="Description (optional)" />
      </BasicModal>
    </div>
  );
};

export default Adjustment;
