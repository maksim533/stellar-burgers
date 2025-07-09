import { getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface orderState {
  error: null | string;
  isLoading: boolean;
  orders: TOrder[];
  order: TOrder | null;
}

const initialState: orderState = {
  error: null,
  isLoading: false,
  orders: [],
  order: null
};

export const getOrders = createAsyncThunk('order/user/all', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'order/number',
  (number: number) => getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    selectOrder: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (status) => {
        status.error = null;
        status.isLoading = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.order = action.payload.orders[0];
      });
  }
});
export const { selectOrder } = orderSlice.selectors;
export default orderSlice.reducer;
