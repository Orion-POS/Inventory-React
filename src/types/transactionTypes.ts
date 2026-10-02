export interface TransactionTypes {
  id: number;
  date: Date;
  transaction_id: string;
  type: string;
  supplier: string;
  total: number;
  payment_status: string;
}
