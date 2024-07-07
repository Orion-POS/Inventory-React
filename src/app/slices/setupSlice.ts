import { createSlice } from '@reduxjs/toolkit';

// export const fetchSetupData = createAsyncThunk('setup/fetchSetupData', async (payload, thunkAPI) => {
//   try {
//     const resData = await axios
//     return ;
//   } catch (error) {
//     throw new Error(error)
//   }
// });

const initialState = {
  data: null,
  itemLibrary: []
};

export const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    addSetup: (action, payload) => {

    }
  }
  // extraReducers: builder => {
  //   builder.addCase(fetchSetupData.fulfilled, (state, action) => {
  //     state.data = action.payload
  //   });
  //   builder.addCase(fetchSetupData.pending, (state, action) => {
  //     state.data = action.payload
  //   });
  //   builder.addCase(fetchSetupData.rejected, (state, action) => {
  //     state.data = action.payload
  //   });
  // }
});

