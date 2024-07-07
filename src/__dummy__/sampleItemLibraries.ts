export interface ItemLibrariesEntity {
  id: number | string;
  name: string;
  in_stock: number;
  actual_stock: number;
  item_cat_id: string | null;
  item_cat_name:  string | null;
  uom_id: string | null
  uom: string;
  track_item: boolean;
  desc: string | null;
}