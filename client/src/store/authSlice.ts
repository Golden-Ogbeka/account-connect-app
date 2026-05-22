import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getToken, removeToken, setToken } from '../auth/storage';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  token: getToken(),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      setToken(action.payload.token);
    },
    logoutSuccess(state) {
      state.token = null;
      state.user = null;
      removeToken();
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
