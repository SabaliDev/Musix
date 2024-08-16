import React from "react";
import { useSelector } from "react-redux";
import { Error, Loader, SongCard } from "../components";
import { useGetTopChartsQuery } from "../redux/services/spotifyCore";
import { Song, User } from "../types";

interface RootState {
  player: {
    activeSong: Song | null;
    isPlaying: boolean;
  };
  auth: {
    user: User | null;
    loading: boolean;
  };
}

const Discover: React.FC = () => {
  const { activeSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );
  const { data, isFetching, error } = useGetTopChartsQuery();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <Loader title="Loading user data..." />;
  if (isFetching) return <Loader title="Loading songs..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">
          {user ? `Welcome, ${user.username}` : "Welcome, Guest"}
        </h2>
      </div>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((song: Song, i: number) => (
          <SongCard
            key={song._id || i} // Use song.id if available, fallback to index
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;
