import { BasicTable } from '@/components/table';
import { Button } from '@/components/ui/button';
import { css } from '@emotion/react';
import { useModal } from '@/providers/ModalProvider';
import { AdjustmentTypes } from '@/types/itemTypes';
import dayjs from 'dayjs';
import AdjustmentContent from '../modal-content/AdjustmentContent';

interface AdjustmentConfirmProps {
  onCloseModal: () => void;
  values: {
    properties: AdjustmentTypes[];
    notes: string;
  };
}

const AdjustmentConfirm: React.FC<AdjustmentConfirmProps> = ({ onCloseModal, values }) => {
  const { openModal } = useModal();

  const handleCancel = () => {
    onCloseModal();
    openModal({
      title: 'Add New Adjustment',
      subtitle: `${dayjs().format('DD MMM YYYY')}`,
      content: onCloseModal => (
        <AdjustmentContent onCloseModal={onCloseModal} initialValues={values} />
      ),
      modalOptions: {}
    });
  };

  const handleConfirm = () => {
    console.log(values, '<< ');
    onCloseModal();
  };
  return (
    <div className="w-full ">
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <h1
          css={css`
            color: var(--Primary-900, #05445f);
            font-family: Inter;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 24px; /* 150% */
            text-align: left;
            width: 100%;
          `}>
          Review your list:
        </h1>
        <BasicTable
          data={values.properties ?? []}
          tableColumns={[
            {
              id: 'name',
              accessorKey: 'name',
              header: () => <span className="w-full text-start">Item Name</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            },
            {
              id: 'in_stock',
              accessorKey: 'in_stock',
              header: () => <span className="w-full text-start">In Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'current_stock',
              accessorKey: 'current_stock',
              header: () => <span className="w-full text-start">Actual Stock</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'used_stock',
              accessorKey: 'used_stock',
              header: () => <span className="w-full text-start">Stock Out</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as number}</span>
            },
            {
              id: 'uom',
              accessorKey: 'uom',
              header: () => <span className="w-full text-start">Unit</span>,
              cell: ({ getValue }) => <span className="w-full">{getValue() as string}</span>
            }
          ]}
        />
        <h1
          css={css`
            color: var(--Primary-900, #05445f);
            font-family: Inter;
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: 28px; /* 140% */
          `}>
          Are you sure you want to submit the form?
        </h1>
        <p
          css={css`
            color: var(--Grey-Darker, var(--Colors-base-black, #acacac));
            font-family: Inter;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
          `}>
          Note: This operation will change the current stock item and you will unable to cancel or
          edit.
        </p>
      </div>
      <div className="mt-4 gap-5 flex justify-end">
        <Button type="button" variant={'outline'} onClick={handleCancel}>
          No
        </Button>
        <Button type="button" onClick={handleConfirm}>
          Yes
        </Button>
      </div>
    </div>
  );
};

export default AdjustmentConfirm;
