import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface IOrderDetailsSliceState {
  orders: TOrder[];
  orderIsLoading: boolean;
  error: string | undefined;
}

const initialState: IOrderDetailsSliceState = {
  orders: [],
  orderIsLoading: false,
  error: undefined
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderDetails/fetchOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  selectors: {
    selectOrdersIsLoading: (state) => state.orderIsLoading,
    selectOrders: (state) => state.orders
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderIsLoading = true;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderIsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderIsLoading = false;
        state.orders = action.payload.orders;
      });
  }
});

export const { selectOrdersIsLoading, selectOrders } =
  orderDetailsSlice.selectors;
export const orderDetailsReducer = orderDetailsSlice.reducer;
