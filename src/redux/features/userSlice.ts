import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  // Add other user properties as needed
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export const getAllUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'user/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<User[]>('/api/users/all');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'An error occurred';
      });
  },
});

export default userSlice.reducer;