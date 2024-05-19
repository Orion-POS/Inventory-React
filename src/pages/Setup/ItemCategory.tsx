import { earningsData } from '@/__dummy__/sampleDataTable';
import SelectDropdown from '@/components/forms/Select';
import BasicModal from '@/components/modals/Modal';
import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ItemCategory = () => {
  const [openModal, setOpenModal] = useState(false);
  const formFilter = useForm({
    defaultValues: {
      search: '',
      filterCategory: []
    }
  });

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
          <Form {...formFilter}>
            <FormField
              name="search"
              control={formFilter.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input iconEnd={<Search />} placeholder="Search" className=" w-64" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="filterCategory"
              control={formFilter.control}
              render={({ field }) => (
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
                    {...field}
                  />
                </div>
              )}
            />
          </Form>
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

      <ModalAddNewItemCategory openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
};

export default ItemCategory;

const ModalAddNewItemCategory = ({ openModal, setOpenModal }) => {
  const form = useForm({
    defaultValues: {
      categoryName: '',
      transactionType: '',
      desc: ''
    }
  });

  const onSubmitNewCategory = data => {
    console.log(data, '<< CEKDATA');
  };
  return (
    <BasicModal
      open={openModal}
      disableClickOutside
      title="Create item category"
      onSubmit={form.handleSubmit(onSubmitNewCategory)}
      onClose={() => setOpenModal(false)}>
      <Form {...form}>
        {/* <form onSubmit={form.handleSubmit(onSubmitNewCategory)}> */}

        {/* 
        <Form formData={[
          {
            fieldname: "username",
            type: "text",
            validations: {},
            label: "",
            width: ""
          },
          [
            {

            },
            {

            }
          ]
        ]} onChange={} />
        
        */}

        {/* 
        <div>
        <InputForm type="text" validations={{}} name="" onChange={} label="" />
        <InputForm type="text" validations={{}} name="" onChange={} label="" />
        </div>
          <InputForm type="text" validations={{}} name="" onChange={} label="" />
          <InputForm type="text" validations={{}} name="" onChange={} label="" />
        
        */}
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input label="Category name" className="w-full" useFormProps={field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transactionType"
          render={({ field }) => (
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
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea label="Description (optional)" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* </form> */}
      </Form>
    </BasicModal>
  );
};
