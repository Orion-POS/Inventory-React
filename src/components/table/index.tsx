import { ChevronSort, ChevronSortDown, ChevronSortUp } from '@carbon/icons-react';
import {
  ColumnDef,
  Row,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface BasicTableProps<T> {
  data: T[];
  tableColumns: ColumnDef<T>[];
}
type TableGroup = 'center' | 'left' | 'right';

function getRowGroup<T extends RowData>(row: Row<T>, tg?: TableGroup) {
  if (tg === 'left') return row.getLeftVisibleCells();
  if (tg === 'right') return row.getRightVisibleCells();
  if (tg === 'center') return row.getCenterVisibleCells();
  return row.getVisibleCells();
}

export function BasicTable<TData>({ data, tableColumns }: BasicTableProps<TData>) {
  const columns = useMemo(() => tableColumns, [tableColumns]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<any>({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <table
      className="bgred-300 w-full"
      css={theme => ({
        width: '100%',
        borderCollapse: 'collapse',
        'th, td': {
          borderCollapse: 'collapse'
        },
        th: {
          color: theme.colors.base.black,
          backgroundColor: '#F5FFFE',
          borderTop: '1px solid #d8d8d8',
          borderBottom: '1px solid #d8d8d8',
          padding: '4px 8px',
          zIndex: 10
        },
        td: {
          padding: '4px 8px',
          borderBottom: '1px solid #d8d8d8'
        }
      })}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                className="relative"
                colSpan={header.colSpan}
                key={header.id}
                style={{
                  width: header.getSize()
                }}>
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: `${
                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                      } w-full flex px-2 capitalize items-center justify-between`,
                      onClick: header.column.getToggleSortingHandler()
                    }}>
                    {' '}
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() ? (
                      <div className="h-full bg-primar justify-self-end">
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'asc' ? (
                            <ChevronSortUp />
                          ) : (
                            <ChevronSortDown />
                          )
                        ) : (
                          <ChevronSort />
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr>
            {getRowGroup(row, undefined).map(cell => (
              <td
                key={cell.id}
                style={{
                  width: cell.column.getSize()
                }}>
                <div className="px-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
