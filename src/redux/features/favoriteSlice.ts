import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/axiosConfig";
import { Song } from "../../types";

// Helper function to handle errors
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || error.message;
  }
  return "An unexpected error occurred";
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("api/favorite");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "favorites/addToFavorites",
  async (songId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.post("api/favorite/add", { songId });
      return songId;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorites/removeFromFavorites",
  async (songId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("api/favorite/remove", { data: { songId } });
      return songId;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

interface FavoritesState {
  favorites: Song[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites.push({ _id: action.payload } as Song);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (song) => song._id !== action.payload
        );
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default favoritesSlice.reducer;
