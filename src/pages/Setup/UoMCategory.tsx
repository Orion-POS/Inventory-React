import { earningsData } from '@/__dummy__/sampleDataTable';
import { InputText } from '@/components/forms';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useModal } from '@/providers/ModalProvider';
import { useFieldArray, useForm } from 'react-hook-form';

const UoMCategory = () => {
  // const [openModal, setOpenModal] = useState(false);
  const { openModal } = useModal();

  const handleSubmit = data => {
    console.log(data, '<< DATA SUBMITTED');
  };
  const handleOpenModal = () => {
    openModal({
      title: 'Add New UoM Category',
      content: onCloseModal => (
        <ModalContentAddUoM onCloseModal={onCloseModal} onSubmit={handleSubmit} />
      )
      // modalOptions: {
      //   overideFooter: 'TEST'
      //   // renderCustomFooter: () => <span>custom</span>
      // }
    });
  };

  return (
    <div className="w-full bg-ray-300 flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-2">
        <div className="w-100 flex justify-between">
          <Button size={'sm'} onClick={handleOpenModal}>
            Add New UoM Category
          </Button>
          <Button size={'sm'} variant={'ghost'}>
            Import / Export Data
          </Button>
        </div>
        <div className="flex justify-between items-center ">
          {/* <InputText iconEnd={<Search />} placeholder="Search" className=" w-64" /> */}
          {/* <div className="flex items-center gap-2">
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
          </div> */}
        </div>
      </div>

      {/* END OF TOOLBAR */}
      <BasicTable
        data={earningsData}
        tableColumns={[
          {
            id: 'num',
            accessorKey: 'num',
            size: 10,
            header: () => <span className=" w-full text-start">No</span>,
            cell: ({ getValue }) => <span className="w-full ">{getValue() as string}</span>
          },
          {
            id: 'uomCategory',
            accessorKey: 'uomCategory',
            header: () => <span className=" w-full text-start">UoM Category</span>,
            size: 60,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'uom',
            accessorKey: 'uom',
            header: () => <span className=" w-full text-start">UoM</span>,
            size: 200,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
          },
          {
            id: 'actions',
            header: () => <span className="text-center w-full">Actions</span>,
            enableSorting: false,
            size: 10,
            cell: ({ getValue }) => (
              <div className="w-fll flex justify-center gap-2">
                <Button size={'sm'} variant={'ghost'} className="text-gray-500">
                  Edit
                </Button>
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default UoMCategory;

const ModalContentAddUoM = ({ onCloseModal, onSubmit }) => {
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
          {fields.map((item, idx) => (
            <div className="flex gap-3">
              <InputText
                label="Unit"
                value={item.unit}
                {...form.register(`properties.${idx}.unit`)}
              />
              <InputText label="Type" {...form.register(`properties.${idx}.type`)} />
              {/* <div>
                <F
              <Input type="number" label="Type" {...form.register(`properties.${idx}.type`)} />
                </div> */}
            </div>
          ))}
        </div>
        {/* <FormField
          control={form.control}
          name="properties"
          render={({ field }) => (
           
          )}
        /> */}
      </Form>
      {/* <InputText
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
      /> */}
      {/* <Textarea label="Description (optional)" /> */}

      {/* <div className=" self-end mt-5 gap-2 flex">
        <Button type="submit" variant={'outline'} onClick={() => onCloseModal()}>
          Cancel
        </Button>
        <Button type="submit" onClick={() => onSubmit(textContent)}>
          Save changes
        </Button>
      </div> */}
    </div>
  );
};
