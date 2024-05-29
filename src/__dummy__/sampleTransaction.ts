import { TransactionTypes } from '@/types/transactionTypes';

export const TransactionData: TransactionTypes[] = [
  {
    id: 1,
    date: new Date(2022, 2, 30),
    transaction_id: 'T0001',
    type: 'Belanja Bahan',
    supplier: 'Toko Kelontong A',
    total: 10000,
    payment_status: 'Fully Paid'
  },
  {
    id: 2,
    date: new Date(2022, 2, 31),
    transaction_id: 'T0002',
    type: 'Belanja Bahan',
    supplier: 'Toko Kelontong B',
    total: 5000,
    payment_status: 'Partially Paid'
  },
  {
    id: 3,
    date: new Date(2022, 3, 1),
    transaction_id: 'T0003',
    type: 'Belanja Bahan',
    supplier: 'Toko Kelontong C',
    total: 2000,
    payment_status: 'Unpaid'
  },
  {
    id: 4,
    date: new Date(2022, 3, 2),
    transaction_id: 'T0004',
    type: 'Belanja Bahan',
    supplier: 'Toko Kelontong D',
    total: 3000,
    payment_status: 'Unpaid'
  }
];
