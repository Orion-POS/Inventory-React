import { earningsData } from '../../__dummy__/sampleDataTable';
import { BasicTable } from '../../components/table';

const ItemCategory = () => {
  return (
    <div className='w-full bg-ray-300 flex'>
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
    </div>
  );
};

export default ItemCategory;
