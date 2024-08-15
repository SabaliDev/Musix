import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createPlaylist = createAsyncThunk(
  'playlists/create',
  async (name, thunkAPI) => {
    try {
      const response = await axios.post('/api/playlists/create', { name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserPlaylists = createAsyncThunk(
  'playlists/getUserPlaylists',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/playlists/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addSongToPlaylist = createAsyncThunk(
  'playlists/addSong',
  async ({ playlistId, songId }, thunkAPI) => {
    try {
      const response = await axios.post('/api/playlists/add-song', { playlistId, songId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlists',
  initialState: {
    userPlaylists: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.userPlaylists.push(action.payload);
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.userPlaylists = action.payload;
      })
      .addCase(addSongToPlaylist.fulfilled, (state, action) => {
        const index = state.userPlaylists.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.userPlaylists[index] = action.payload;
        }
      });
  },
});

export default playlistSlice.reducer;