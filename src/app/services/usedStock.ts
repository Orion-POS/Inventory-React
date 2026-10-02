import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsedStockTypes } from '@/types/itemTypes';
import { RootState } from '../store';
import { usedStocksData } from '@/__dummy__/sampleUsedStock';

interface UsedStockState {
  data: UsedStockTypes[];
}

const initialState: UsedStockState = {
  data: usedStocksData
};

const usedStockSlice = createSlice({
  name: 'usedStock',
  initialState,
  reducers: {
    setUsedStock(state, action: PayloadAction<UsedStockTypes[]>) {
      state.data = action.payload;
    },
    addUsedStock(state, action: PayloadAction<UsedStockTypes>) {
      state.data.push(action.payload);
    },
    updateUsedStock(state, action: PayloadAction<UsedStockTypes>) {
      const index = state.data.findIndex(stock => stock.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteUsedStock(state, action: PayloadAction<number>) {
      state.data = state.data.filter(stock => stock.id !== action.payload);
    }
  }
});

export const { setUsedStock, addUsedStock, updateUsedStock, deleteUsedStock } = usedStockSlice.actions;
export const selectUsedStock = (state: RootState) => state.usedStock.data;
export default usedStockSlice.reducer;
