import { Button } from '@mui/material';
import { earningsData } from '../../__dummy__/sampleDataTable';
import { BasicTable } from '../../components/table';
import SearchField from '../../components/forms/SearchField';
import SelectDropdown from '../../components/forms/Select';

const ItemCategory = () => {
  return (
    <div className="w-full bg-ray-300 flex flex-col gap-3">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-2">
        <div className="w-100 flex justify-between border">
          <Button size="small" variant="contained">
            Add New Item Category
          </Button>
          <Button size="small">Import / Export Data</Button>
        </div>
        <div className="flex justify-between items-center">
          <SearchField />
          <div>
            <SelectDropdown />
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
