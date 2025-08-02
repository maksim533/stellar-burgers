import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface FeedState {
  error: null | string;
  isLoading: boolean;
  orderData: {
    orders: TOrder[];
    total: number | null;
    totalToday: number | null;
  };
}

export const initialStateFeed: FeedState = {
  error: null,
  isLoading: false,
  orderData: {
    orders: [],
    total: null,
    totalToday: null
  }
};

export const feedsApi = createAsyncThunk('feeds/get/all', getFeedsApi);

const feedSlice = createSlice({
  name: 'feeds',
  initialState: initialStateFeed,
  reducers: {},
  selectors: {
    selectedFeed: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(feedsApi.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(feedsApi.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(feedsApi.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.orderData.orders = action.payload.orders;
        state.orderData.total = action.payload.total;
        state.orderData.totalToday = action.payload.totalToday;
      });
  }
});

export const { selectedFeed } = feedSlice.selectors;
export default feedSlice.reducer;
