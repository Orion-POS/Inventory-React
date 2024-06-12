export interface BaseStockProps {
    id: number;
    category: string;
    name: string;
    uom: string;
    current_stock: number;
  }
  
  export interface WastedStockTypes extends BaseStockProps {
    wasted: number;
    occasion: string;
    date: Date;
  }
  
  export interface UsedStockTypes extends BaseStockProps {
    in_stock: number;
    used_stock: number;
    date: Date;
  }
  
  export interface StockOpnameTypes extends BaseStockProps {
    final_stock: number;
    average_price: number;
    total_amounts: number;
    date: Date;
  }
  
  export interface AdjustmentTypes extends BaseStockProps {
    in_stock: number;
    adjustment_stock: number;
    date: Date;
  }
  