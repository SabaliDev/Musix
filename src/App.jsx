import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Searchbar,
  Sidebar,
  MusicPlayer,
  TopPlay,
  PrivateRoute,
} from "./components";

import {
  ArtistDetails,
  TopArtists,
  TopCharts,
  Discover,
  Search,
  Register,
  Login,
  QueuePage,
  PlaylistsPage,
  ListeningRoom,
} from "./pages";

const App = () => {
  const { activeRoom } = useSelector((state) => state.listeningRoom);
  const { activeSong } = useSelector((state) => state.player);
  const location = useLocation();

  // Check if the current route is register or login
  const isAuthPage = ["/register", "/login"].includes(location.pathname);

  // Check if the current route is the listening room
  const isListeningRoom = location.pathname === "/listening";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div>
      <PrivateRoute>
        <div className="relative flex">
          <Sidebar />
          <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286]">
            <Searchbar />

            <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
              <div className="flex-1 h-fit pb-40">
                <Routes>
                  <Route path="/" element={<Discover />} />
                  <Route path="/playlist" element={<PlaylistsPage />} />
                  <Route path="/top-artists" element={<TopArtists />} />
                  <Route path="/top-charts" element={<TopCharts />} />
                  <Route path="/artists/:id" element={<ArtistDetails />} />
                  <Route path="/queue" element={<QueuePage />} />
                  <Route path="/listening" element={<ListeningRoom />} />
                  <Route path="/search/:searchTerm" element={<Search />} />
                </Routes>
              </div>
              {!isListeningRoom && (
                <div className="xl:sticky relative top-0 h-fit">
                  <TopPlay />
                </div>
              )}
            </div>
          </div>

          {activeSong?.title && (
            <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10">
              {activeRoom ? <ListeningRoom /> : <MusicPlayer />}
            </div>
          )}
        </div>
      </PrivateRoute>
    </div>
  );
};

export default App;
