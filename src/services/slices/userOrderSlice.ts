import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface IUserOrdersResponse {
  orders: TOrder[];
}

interface IUserOrdersSliceState {
  userOrders: TOrder[];
  userOrdersIsLoading: boolean;
  error: string | undefined;
}

const initialState: IUserOrdersSliceState = {
  userOrders: [],
  userOrdersIsLoading: false,
  error: undefined
};

export const fetchUserOrdersApi = createAsyncThunk<IUserOrdersResponse>(
  'userOrders/fetchUserOrdersApi',
  async () => {
    const orders = await getOrdersApi();
    return { orders };
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    selectUserOrdersIsLoading: (state) => state.userOrdersIsLoading,
    selectUserOrders: (state) => state.userOrders
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserOrdersApi.pending, (state) => {
        state.userOrdersIsLoading = true;
      })
      .addCase(fetchUserOrdersApi.rejected, (state, action) => {
        state.userOrdersIsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserOrdersApi.fulfilled, (state, action) => {
        state.userOrdersIsLoading = false;
        state.userOrders = action.payload.orders;
      });
  }
});

export const { selectUserOrdersIsLoading, selectUserOrders } =
  userOrdersSlice.selectors;
export const userOrdersReducer = userOrdersSlice.reducer;
