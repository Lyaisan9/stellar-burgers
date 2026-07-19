import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface ICurrentOrderSliceState {
  order: TOrder | null;
  orderIsLoading: boolean;
  error: string | undefined;
}

const initialState: ICurrentOrderSliceState = {
  order: null,
  orderIsLoading: false,
  error: undefined
};

export const fetchOrderBurgerApi = createAsyncThunk(
  'currentOrder/fetchOrderBurgerApi',
  async (data: string[]) => orderBurgerApi(data)
);

const currentOrderSlice = createSlice({
  name: 'currentOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderIsLoading = false;
    }
  },
  selectors: {
    selectOrderIsLoading: (state) => state.orderIsLoading,
    selectOrder: (state) => state.order
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrderBurgerApi.pending, (state) => {
        state.orderIsLoading = true;
      })
      .addCase(fetchOrderBurgerApi.rejected, (state, action) => {
        state.orderIsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderBurgerApi.fulfilled, (state, action) => {
        state.orderIsLoading = false;
        state.order = action.payload.order;
      });
  }
});

export const { clearOrder } = currentOrderSlice.actions;
export const { selectOrderIsLoading, selectOrder } =
  currentOrderSlice.selectors;
export const currentOrderReducer = currentOrderSlice.reducer;
