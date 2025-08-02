import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isAuth: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: null | string;
  user: null | TUser;
}

export const initialState: UserState = {
  isAuth: false,
  isLoading: false,
  error: null,
  user: null,
  isAuthChecked: false
};

export const getUser = createAsyncThunk('user/get', getUserApi);

export const loginUser = createAsyncThunk('user/login', (data: TLoginData) =>
  loginUserApi(data)
);

export const registerUser = createAsyncThunk(
  'user/register',
  (data: TRegisterData) => registerUserApi(data)
);

export const forgotPassword = createAsyncThunk(
  'user/forgot/password',
  (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/password/reset',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const updateUser = createAsyncThunk(
  'user/update',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const logoutUser = createAsyncThunk('user/logout', logoutApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    selectedUser: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuth = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
        state.isAuth = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.isAuth = true;
        state.isLoading = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error as string;
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error as string;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuth = false;
        state.isLoading = false;
        state.error = null;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      });
  }
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);
export const { authChecked } = userSlice.actions;
export const { selectedUser } = userSlice.selectors;
export default userSlice.reducer;
