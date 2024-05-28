interface BaseStockProps {
    id: number;
    date: Date;
    category: string;
    name: string;
    uom: string;
  }
  
  export interface WastedStockTypes extends BaseStockProps {
    actual_stock: number;
    wasted: number;
    occasion: string;
  }
  
  export interface UsedStockTypes extends BaseStockProps {
    in_stock: number;
    used_stock: number;
    current_stock: number;
  }
  
  export interface StockOpnameTypes extends BaseStockProps {
    final_stock: number;
    average_price: number;
    total_amounts: number;
  }
  
  export interface AdjustmentTypes extends BaseStockProps {
    in_stock: number;
    actual_stock: number;
    adjustment_stock: number;
  }
  