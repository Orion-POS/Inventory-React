import { css } from '@emotion/react';
import {
  ColumnDef,
  Row,
  RowData,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo } from 'react';

interface BasicTableProps<T> {
  data: T[];
  tableColumns: ColumnDef<T>[];
}
type TableGroup = 'center' | 'left' | 'right';

const tableCss = {
  table: css({
    width: '100%',
    borderCollapse: 'collapse',
    'th, td': {
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: '#F5FFFE',
      borderTop: '1px solid #d8d8d8',
      borderBottom: '1px solid #d8d8d8',
      padding: '4px 8px'
    },
    td: {
      padding: '4px 8px',
      borderBottom: '1px solid #d8d8d8'
    }
  })
};

function getRowGroup<T extends RowData>(row: Row<T>, tg?: TableGroup) {
  if (tg === 'left') return row.getLeftVisibleCells();
  if (tg === 'right') return row.getRightVisibleCells();
  if (tg === 'center') return row.getCenterVisibleCells();
  return row.getVisibleCells();
}

export function BasicTable<TData>({ data, tableColumns }: BasicTableProps<TData>) {
  const columns = useMemo(() => tableColumns, [tableColumns]);

  const table = useReactTable<any>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <table
      className="bgred-300 w-full"
      css={(theme) => ({
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
          padding: '4px 8px'
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
                  <div> {flexRender(header.column.columnDef.header, header.getContext())}</div>
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
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
