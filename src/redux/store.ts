import { configureStore } from "@reduxjs/toolkit";
import { spotifyCoreApi } from "./services/spotifyCore";

import playerReducer from "./features/playerSlice";
import authReducer from "./features/authSlice";
import playlistReducer from "./features/playListSlice";
import listeningRoomReducer from "./features/listeningRoomSlice";
import roomPlayerReducer from "./features/roomPlayerSlice";

export const store = configureStore({
  reducer: {
    [spotifyCoreApi.reducerPath]: spotifyCoreApi.reducer,
    player: playerReducer,
    roomPlayer: roomPlayerReducer,
    auth: authReducer,
    playlists: playlistReducer,
    listeningRoom: listeningRoomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spotifyCoreApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;