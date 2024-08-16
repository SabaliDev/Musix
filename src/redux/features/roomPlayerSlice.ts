import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BASE_URL } from "../../constants/apiConstants";

interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: number;
  img: string;
  songId: number;
  url: string;
  __v: number;
  _id: string;

}

interface RoomPlayerState {
  isPlaying: boolean;
  currentTime: number;
  currentTrackIndex: number;
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RoomPlayerState = {
  isPlaying: false,
  currentTime: 0,
  currentTrackIndex: 0,
  tracks: [],
  isLoading: false,
  error: null,
};

export const fetchTracks = createAsyncThunk<Track[]>(
  'player/fetchTracks',
  async () => {
    const response = await fetch(`${BASE_URL}api/music/songs`);
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
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
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
    setCurrentTrackIndex: (state, action: PayloadAction<number>) => {
      state.currentTrackIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTracks.fulfilled, (state, action: PayloadAction<Track[]>) => {
        state.isLoading = false;
        state.tracks = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setIsPlaying, setCurrentTime, nextTrack, prevTrack, setCurrentTrackIndex } = roomPlayerSlice.actions;

export default roomPlayerSlice.reducer;