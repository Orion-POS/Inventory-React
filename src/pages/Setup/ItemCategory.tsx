import { earningsData } from '@/__dummy__/sampleDataTable';
import { InputText } from '@/components/forms';
import SelectDropdown from '@/components/forms/Select';
import Textarea from '@/components/forms/TextArea';
import BasicModal from '@/components/modals/Modal';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Search } from '@carbon/icons-react';
import { useState } from 'react';

const ItemCategory = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full bg-ray-300 flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-2">
        <div className="w-100 flex justify-between">
          <Button size={'sm'} onClick={() => setOpenModal(true)}>
            Add New Item Category
          </Button>
          <Button size={'sm'} variant={'ghost'}>
            Import / Export Data
          </Button>
        </div>
        <div className="flex justify-between items-center ">
          <InputText iconEnd={<Search />} placeholder="Search" className=" w-64" />
          <div className="flex items-center gap-2">
            <span className="text-sm">Filter by category:</span>
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
        data={earningsData}
        tableColumns={[
          {
            id: 'id',
            accessorKey: 'id',
            size: 200,
            header: () => <span className=" w-full text-start">Category Name</span>,
            cell: ({ getValue }) => <span className="w-full ">{getValue() as string}</span>
          },
          {
            id: 'name',
            accessorKey: 'name',
            header: () => <span className=" w-full text-start">Item Stocks</span>,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'date',
            accessorKey: 'date',
            enableSorting: false,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'actions',
            header: () => <span className="text-center w-full">Actions</span>,
            enableSorting: false,
            // size: 40,
            cell: ({ getValue }) => (
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

export default ItemCategory;
