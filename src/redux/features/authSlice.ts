import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {User,Credentials} from "../../types"



interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}



interface UserInfo extends Credentials {
  email: string;

}

interface AuthResponse {
  user: User;
  token: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, Credentials>(
  "/auth/login",
  async (credentials) => {
    const response = await axios.post<AuthResponse>(
      "http://localhost:8080/auth/login",
      credentials
    );
    return response.data;
  }
);

export const registerUser = createAsyncThunk<AuthResponse, UserInfo>(
  "auth/register",
  async (userInfo) => {
    const response = await axios.post<AuthResponse>(
      "http://localhost:8080/auth/register",
      userInfo
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;