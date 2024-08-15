import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  isPlaying: false,
  currentTime: 0,
  currentTrackIndex: 0,
  tracks: [],
  isLoading: false,
  error: null,
};

export const fetchTracks = createAsyncThunk(
  'player/fetchTracks',
  async () => {
    const response = await fetch('http://localhost:8080/api/music/songs');
    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }
    return response.json();
  }
);

const roomPlayerSlice = createSlice({
  name: 'roomPlayer',
  initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    nextTrack: (state) => {
      state.currentTrackIndex = (state.currentTrackIndex + 1) % state.tracks.length;
      state.currentTime = 0;
    },
    prevTrack: (state) => {
      state.currentTrackIndex = (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length;
      state.currentTime = 0;
    },
    setCurrentTrackIndex: (state, action) => {
      state.currentTrackIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setIsPlaying, setCurrentTime, nextTrack, prevTrack, setCurrentTrackIndex } = roomPlayerSlice.actions;

export default roomPlayerSlice.reducer;