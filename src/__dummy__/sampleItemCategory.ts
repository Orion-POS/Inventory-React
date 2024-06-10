export interface ItemCategoryEntity {
  id: number | string;
  itemCategoryName: string;
  stocks: number;
  transactionTypeId: string | number;
  transactionTypeName: string;
  assignedItemList?: string[]
}