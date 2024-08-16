import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Room {
  _id: string;
  name: string;
  // Add other room properties as needed
}

interface Song {
  id: string;
  title: string;
  artist: string;
  // Add other song properties as needed
}

interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
}

interface ListeningRoomState {
  activeRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
}

export const fetchRoomDetails = createAsyncThunk<Room, string, { rejectValue: string }>(
  "listeningRoom/fetchDetails",
  async (roomId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Room>(
        `http://localhost:8080/api/listening/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const joinRoom = createAsyncThunk<Room, string, { rejectValue: string }>(
  "listeningRoom/join",
  async (roomId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<Room>(
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
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const createRoom = createAsyncThunk<Room, string, { rejectValue: string }>(
  "listeningRoom/create",
  async (roomName, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<Room>(
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
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const updateRoomPlayback = createAsyncThunk<PlaybackState, { roomId: string; playbackState: PlaybackState }, { rejectValue: string }>(
  'listeningRoom/updatePlayback',
  async ({ roomId, playbackState }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<PlaybackState>(`http://localhost:8080/api/listening/${roomId}/playback`, playbackState, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const leaveRoom = createAsyncThunk<string, string, { rejectValue: string }>(
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
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

const initialState: ListeningRoomState = {
  activeRoom: null,
  isLoading: false,
  error: null,
  currentSong: null,
  isPlaying: false,
  playlist: [],
};

const listeningRoomSlice = createSlice({
  name: "listeningRoom",
  initialState,
  reducers: {
    setRoomActiveSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },
    playPauseRoom: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.playlist = action.payload;
    },
    nextRoomSong: (state) => {
      if (state.currentSong && state.playlist.length > 0) {
        const currentIndex = state.playlist.findIndex(song => song.id === state.currentSong!.id);
        if (currentIndex < state.playlist.length - 1) {
          state.currentSong = state.playlist[currentIndex + 1];
        } else {
          state.currentSong = state.playlist[0]; // Loop back to the first song
        }
      }
    },
    prevRoomSong: (state) => {
      if (state.currentSong && state.playlist.length > 0) {
        const currentIndex = state.playlist.findIndex(song => song.id === state.currentSong!.id);
        if (currentIndex > 0) {
          state.currentSong = state.playlist[currentIndex - 1];
        } else {
          state.currentSong = state.playlist[state.playlist.length - 1]; // Go to the last song
        }
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
        state.error = action.payload ?? 'An error occurred';
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
        state.error = action.payload ?? 'An error occurred';
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
        state.error = action.payload ?? 'An error occurred';
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
        state.error = action.payload ?? 'An error occurred';
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