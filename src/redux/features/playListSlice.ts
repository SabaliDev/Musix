import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  artist: string;
  artistId: number;
  img: string;
  songId: number;
  title: string;
  url: string;
  __v: number;
  _id: string;
}

interface PlayerState {
  currentSongs: Song[];
  currentIndex: number;
  isActive: boolean;
  isPlaying: boolean;
  activeSong: Song | null;
  genreListId: string;
  queue: Song[];
}

const initialState: PlayerState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: null,
  genreListId: '',
  queue: [],
};

export const stopGlobalPlayer = createAsyncThunk(
  'player/stopGlobalPlayer',
  async (_, { dispatch }) => {
    dispatch(setActiveSong({ song: null, data: [], i: -1 }));
    dispatch(playPause(false));
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action: PayloadAction<{ song: Song | null; data: Song[]; i: number }>) => {
      state.activeSong = action.payload.song;
      state.currentSongs = action.payload.data;
      state.currentIndex = action.payload.i;
      state.isActive = true;
    },
    nextSong: (state) => {
      if (state.queue.length > 0) {
        state.activeSong = state.queue.shift() || null;
      } else if (state.currentIndex < state.currentSongs.length - 1) {
        state.currentIndex += 1;
        state.activeSong = state.currentSongs[state.currentIndex];
      }
      state.isActive = true;
    },
    prevSong: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.activeSong = state.currentSongs[state.currentIndex];
      }
      state.isActive = true;
    },
    playPause: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Song>) => {
      state.queue.push(action.payload);
    },
    reorderQueue: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      const [reorderedItem] = state.queue.splice(oldIndex, 1);
      state.queue.splice(newIndex, 0, reorderedItem);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.queue.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(stopGlobalPlayer.fulfilled, (state) => {
      state.isActive = false;
      state.isPlaying = false;
      state.activeSong = null;
      state.currentIndex = 0;
    });
  },
});

export const {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  addToQueue,
  reorderQueue,
  removeFromQueue,
} = playerSlice.actions;

export default playerSlice.reducer;