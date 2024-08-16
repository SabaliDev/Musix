import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Searchbar,
  Sidebar,
  MusicPlayer,
  TopPlay,
  PrivateRoute,
  PublicRoute,
} from "./components";
import {
  TopArtists,
  TopCharts,
  Discover,
  Search,
  Register,
  Login,
  QueuePage,
  ListeningRoom,
  FavoritesPage
} from "./pages";

interface RootState {
  listeningRoom: {
    activeRoom: boolean | null;
  };
  player: {
    activeSong: {
      title: string;
    } | null;
  };
}

const App: React.FC = () => {
  const { activeRoom } = useSelector((state: RootState) => state.listeningRoom);
  const { activeSong } = useSelector((state: RootState) => state.player);
  const location = useLocation();

  const isListeningRoom = location.pathname === "/listening";

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route
          path="/*"
          element={
            <div className="relative flex">
              <Sidebar />
              <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286]">
                <Searchbar />
                <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
                  <div className="flex-1 h-fit pb-40">
                    <Routes>
                      <Route path="/" element={<Discover />} />
                      <Route path="/top-artists" element={<TopArtists />} />
                      <Route path="/top-charts" element={<TopCharts />} />
                      <Route path="/favorite" element={<FavoritesPage />} />
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
          }
        >
          <Route index element={<Navigate to="/" replace />} />
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
