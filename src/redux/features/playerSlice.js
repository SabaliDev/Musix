import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: '',
  queue: [], // New field for the queue
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      state.activeSong = action.payload.song;
      state.currentSongs = action.payload.data;
      state.currentIndex = action.payload.i;
      state.isActive = true;
    },
    nextSong: (state) => {
      if (state.queue.length > 0) {
        state.activeSong = state.queue.shift();
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
    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    reorderQueue: (state, action) => {
      const { oldIndex, newIndex } = action.payload;
      const [reorderedItem] = state.queue.splice(oldIndex, 1);
      state.queue.splice(newIndex, 0, reorderedItem);
    },
    removeFromQueue: (state, action) => {
      state.queue.splice(action.payload, 1);
    },
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