export interface ItemCategoryEntity {
  id: number | string;
  name: string;
  total_item: number;
  transaction_type_id: string | number;
  assigned_item_list?: string[]
}