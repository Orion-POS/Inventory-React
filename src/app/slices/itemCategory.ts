import { ItemCategoryEntity } from '@/__dummy__/sampleItemCategory';
import { createSlice } from '@reduxjs/toolkit';
import { itemCategoryApi } from '../services/itemCategory';

interface ItemCategoriesState {
  itemCategories: ItemCategoryEntity[];
}

const initialState: ItemCategoriesState = {
  itemCategories: []
};

const itemCategorySlice = createSlice({
  name: 'itemCategories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      itemCategoryApi.endpoints.getItemCategories.matchFulfilled,
      (state, action) => {
        console.log(' Item Categories Fulfilled', action);
        state.itemCategories = action.payload;
      }
    );
  }
});


export default itemCategorySlice;
