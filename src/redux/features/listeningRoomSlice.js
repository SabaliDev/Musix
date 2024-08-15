import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// New action to fetch room details
export const fetchRoomDetails = createAsyncThunk(
  "listeningRoom/fetchDetails",
  async (roomId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/listening/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const joinRoom = createAsyncThunk(
  "listeningRoom/join",
  async (roomId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/api/listening/join/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("activeRoomId", response.data._id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createRoom = createAsyncThunk(
  "listeningRoom/create",
  async (roomName, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/listening/create",
        {
          name: roomName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("activeRoomId", response.data._id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateRoomPlayback = createAsyncThunk(
    'listeningRoom/updatePlayback',
    async ({ roomId, playbackState }, thunkAPI) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:8080/api/listening/${roomId}/playback`, playbackState, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );

export const leaveRoom = createAsyncThunk(
  "listeningRoom/leave",
  async (roomId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/api/listening/leave/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("activeRoomId");
      return roomId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


const listeningRoomSlice = createSlice({
  name: "listeningRoom",
  initialState: {
    activeRoom: null,
    isLoading: false,
    error: null,
    currentSong: null,
    isPlaying: false,
    playlist: [],
  },
  reducers: {
    setRoomActiveSong: (state, action) => {
      state.currentSong = action.payload;
    },
    playPauseRoom: (state, action) => {
      state.isPlaying = action.payload;
    },
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    nextRoomSong: (state) => {
      const currentIndex = state.playlist.findIndex(song => song.id === state.currentSong.id);
      if (currentIndex < state.playlist.length - 1) {
        state.currentSong = state.playlist[currentIndex + 1];
      } else {
        state.currentSong = state.playlist[0]; // Loop back to the first song
      }
    },
    prevRoomSong: (state) => {
      const currentIndex = state.playlist.findIndex(song => song.id === state.currentSong.id);
      if (currentIndex > 0) {
        state.currentSong = state.playlist[currentIndex - 1];
      } else {
        state.currentSong = state.playlist[state.playlist.length - 1]; // Go to the last song
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRoom = action.payload;
        state.error = null;
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRoom = action.payload;
        state.error = null;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(leaveRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(leaveRoom.fulfilled, (state) => {
        state.isLoading = false;
        state.activeRoom = null;
        state.error = null;
      })
      .addCase(leaveRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoomDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoomDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRoom = action.payload;
        state.error = null;
      })
      .addCase(fetchRoomDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateRoomPlayback.fulfilled, (state, action) => {
        state.currentSong = action.payload.currentSong;
        state.isPlaying = action.payload.isPlaying;
        state.playlist = action.payload.playlist;
      });
  },
});

export const { 
  setRoomActiveSong, 
  playPauseRoom, 
  setPlaylist, 
  nextRoomSong, 
  prevRoomSong 
} = listeningRoomSlice.actions;


export default listeningRoomSlice.reducer;
