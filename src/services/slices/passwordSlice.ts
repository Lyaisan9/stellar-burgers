import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi } from '../../utils/burger-api';

interface TPasswordState {
  error: string | undefined;
  isRequesting: boolean;
}

const initialState: TPasswordState = {
  error: undefined,
  isRequesting: false
};

export const fetchForgotPassword = createAsyncThunk(
  'password/forgot',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(data);
      if (!response.success) {
        return rejectWithValue('Произошла ошибка при восстановлении пароля');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Произошла ошибка при восстановлении пароля');
    }
  }
);

export const fetchResetPassword = createAsyncThunk(
  'password/reset',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(data);
      if (!response.success) {
        return rejectWithValue('Произошла ошибка при сбросе пароля');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Произошла ошибка при сбросе пароля');
    }
  }
);

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      state.error = undefined;
    }
  },
  selectors: {
    selectError: (state) => state.error,
    selectIsRequesting: (state) => state.isRequesting
  },
  extraReducers(builder) {
    builder
      .addCase(fetchForgotPassword.pending, (state) => {
        state.isRequesting = true;
        state.error = undefined;
      })
      .addCase(fetchForgotPassword.rejected, (state, action) => {
        state.isRequesting = false;
        state.error =
          (action.payload as string) ||
          'Произошла ошибка при восстановлении пароля';
      })
      .addCase(fetchForgotPassword.fulfilled, (state) => {
        state.isRequesting = false;
        state.error = undefined;
      })
      .addCase(fetchResetPassword.pending, (state) => {
        state.isRequesting = true;
        state.error = undefined;
      })
      .addCase(fetchResetPassword.rejected, (state, action) => {
        state.isRequesting = false;
        state.error =
          (action.payload as string) || 'Произошла ошибка при сбросе пароля';
      })
      .addCase(fetchResetPassword.fulfilled, (state) => {
        state.isRequesting = false;
        state.error = undefined;
      });
  }
});

export const { clearErrorMessage } = passwordSlice.actions;
export const { selectError, selectIsRequesting } = passwordSlice.selectors;
export const passwordReducer = passwordSlice.reducer;
