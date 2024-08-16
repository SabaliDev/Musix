import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchFavorites } from "../redux/features/favoriteSlice";
import SongCard from "../components/SongCard";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { RootState } from "../redux/store";
import { useAppDispatch } from "../hooks";

const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { favorites, loading, error } = useSelector(
    (state: RootState) => state.favorites
  );
  const { activeSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) return <Loader title="Loading your favorites..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">
          Your Favorites
        </h2>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {favorites.length > 0 ? (
          favorites.map((song, i) => (
            <SongCard
              key={song._id}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={favorites}
              i={i}
            />
          ))
        ) : (
          <h2 className="font-bold text-2xl text-white text-center my-8">
            No favorite songs yet. Start adding some!
          </h2>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
