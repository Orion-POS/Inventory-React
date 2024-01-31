import { earningsData } from '@/__dummy__/sampleDataTable';
import { InputText } from '@/components/forms';
import SearchField from '@/components/forms/SearchField';
import SelectDropdown from '@/components/forms/Select';
import Textarea from '@/components/forms/TextArea';
import BasicModal from '@/components/modals/Modal';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
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
        <div className="flex justify-between items-center">
          <SearchField />
          <SelectDropdown
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
          <div></div>
        </div>
      </div>

      {/* <InputText label="Create item category" /> */}

      {/* END OF TOOLBAR */}
      <BasicTable
        data={earningsData}
        tableColumns={[
          {
            id: 'id',
            accessorKey: 'id',
            size: 20,
            header: 'ID',
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'nm',
            accessorKey: 'name',
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'date',
            accessorKey: 'date',
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          }
        ]}
      />
      <BasicModal
        open={openModal}
        disableClickOutside
        title="Create item category"
        onClose={() => setOpenModal(false)}>
        <InputText label="Category name" />
        <InputText label="Category name" />
        <InputText label="Category name" />
        <Textarea label="Description (optional)" />
        <InputText label="Category name" />
      </BasicModal>
    </div>
  );
};

export default ItemCategory;
