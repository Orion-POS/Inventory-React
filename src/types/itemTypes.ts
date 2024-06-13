export interface BaseStockProps {
    id: number; // id of item
    category: string; // category of item
    name: string; // name of item
    uom: string; // unit of measurement
    current_stock: number; // current stock
  }
  
  export interface WastedStockTypes extends BaseStockProps {
    wasted: number; // Quantity of the item that has been wasted
    occasion: string; // Reason or occasion for the wastage
    date: Date; // Date when the wastage occurred
  }
  
  export interface UsedStockTypes extends BaseStockProps {
    in_stock: number; // Initial quantity of the item before it was used (it will be equal to current stock)
    used_stock: number; // Total quantity of the item used
    date: Date; // Date when the item was used
  }
  
  export interface StockOpnameTypes extends BaseStockProps {
    // need to confirm about status and counted stock
    final_stock: number; // final stock after opname
    average_price: number; // average price
    total_amounts: number; // total amounts
    date: Date; // date of opname
  }
  
  export interface AdjustmentTypes extends BaseStockProps {
    in_stock: number; // Initial quantity of the item before adjustment (it will be equal to current stock)
    adjustment_stock: number; // Total quantity of the item adjusted (added or subtracted)
    date: Date; // Date when the adjustment was made
  }
  