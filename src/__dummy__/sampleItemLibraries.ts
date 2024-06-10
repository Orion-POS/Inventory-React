export interface ItemLibrariesEntity {
  id: number | string;
  itemName: string;
  stocks: number;
  itemCatId: string | number;
  itemCatName: string;
  uom: string;
  inStock: number;
  trackItem: boolean;
  desc?: string;
}