import { earningsData } from '@/__dummy__/sampleDataTable';
import { InputText } from '@/components/forms';
import SelectDropdown from '@/components/forms/Select';
import Textarea from '@/components/forms/TextArea';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { useModal } from '@/providers/ModalProvider';
import { Checkbox, Search } from '@carbon/icons-react';
import { useState } from 'react';

const ItemLibraries = () => {
  // const [openModal, setOpenModal] = useState(false);
  const { openModal } = useModal();

  const handleOpenModal = () => {
    const handleSubmit = data => {
      console.log(data, '<< DATA SUBMITTED');
    };
    openModal({
      title: 'Add New UoM Category',
      content: onCloseModal => (
        <ModalContentAddUoM onCloseModal={onCloseModal} onSubmit={handleSubmit} />
      ),
      modalOptions: {
        overideFooter: null
      }
    });
  };

  return (
    <div className="w-full bg-ray-300 flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-2">
        <div className="w-100 flex justify-between">
          <Button size={'sm'} onClick={handleOpenModal}>
            Add new item
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
            id: 'num',
            accessorKey: 'num',
            size: 40,
            header: () => <span className=" w-full text-start">No</span>,
            cell: ({ getValue }) => <span className="w-full ">{getValue() as string}</span>
          },
          {
            id: 'itemName',
            accessorKey: 'itemName',
            header: () => <span className=" w-full text-start">Item Name</span>,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'categoryName',
            accessorKey: 'categoryName',
            header: () => <span className=" w-full text-start">Category Name</span>,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'inStock',
            accessorKey: 'inStock',
            size: 100,
            header: () => <span className=" w-full text-start">In Stock</span>,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'UoM',
            accessorKey: 'UoM',
            size: 20,
            header: () => <span className=" w-full text-start">UoM</span>,
            enableSorting: false,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },

          {
            id: 'trackItem',
            header: () => <span className="text-center w-full">Track Items</span>,
            enableSorting: false,
            // size: 40,
            cell: ({ getValue }) => (
              <div className="w-fll flex justify-center gap-2">
                <Checkbox />
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default ItemLibraries;

const ModalContentAddUoM = ({ onCloseModal, onSubmit }) => {
  const [textContent, setContentText] = useState('');

  const handleOnChangeText = e => {
    setContentText(e.target.value);
  };

  return (
    <div className="bg-mary flex flex-col gap-4">
      <InputText
        label="Category name"
        className="w-full"
        value={textContent}
        onChange={handleOnChangeText}
      />
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

      <div className=" self-end mt-5 gap-2 flex">
        <Button type="submit" variant={'outline'} onClick={() => onCloseModal()}>
          Cancel
        </Button>
        <Button type="submit" onClick={() => onSubmit(textContent)}>
          Save changes
        </Button>
      </div>
    </div>
  );
};
