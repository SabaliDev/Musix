import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  playPause,
  setActiveSong,
  addToQueue,
} from "../redux/features/playerSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "../redux/features/favoriteSlice";
import PlayPause from "./PlayPause";
import { BsThreeDots, BsHeart, BsHeartFill } from "react-icons/bs";
import { AppDispatch } from "../redux/store";
import { Song } from "../types";

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  activeSong: Song | null;
  data: Song[];
  i: number;
}

interface RootState {
  player: {
    activeSong: Song | null;
    isPlaying: boolean;
  };
  favorites: {
    favorites: Song[];
    loading: boolean;
    error: string | null;
  };
  // Add other slices as needed
  auth: any;
  playlists: any;
  listeningRoom: any;
  roomPlayer: any;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying,
  activeSong,
  data,
  i,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const favorites = useSelector(
    (state: RootState) => state.favorites?.favorites ?? []
  );
  const loading = useSelector(
    (state: RootState) => state.favorites?.loading ?? false
  );
  const error = useSelector(
    (state: RootState) => state.favorites?.error ?? null
  );

  const isFavorite = favorites.some((favSong) => favSong._id === song._id);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  const handleAddToQueue = () => {
    dispatch(addToQueue(song));
    setShowOptions(false);
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(song._id)).unwrap();
      } else {
        await dispatch(addToFavorites(song._id)).unwrap();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
    setShowOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer relative">
      {/* Song Image and Play/Pause Button */}
      <div className="relative w-full h-56 group mt-1">
        <img
          alt="song_img"
          src={song.img}
          className="w-full h-full rounded-lg"
        />
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.title === song.title
              ? "flex bg-black bg-opacity-70"
              : "hidden"
          }`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${song?._id}`}>{song.title}</Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={`/artists/${song?.artistId}`}>{song.artist}</Link>
        </p>
      </div>

      {/* Options Menu */}
      <div className="absolute top-0 right-2 mb-2 mr-2 " ref={optionsRef}>
        <BsThreeDots
          onClick={() => setShowOptions(!showOptions)}
          className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors"
          title="Options"
        />
        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1A1A3C] rounded-md shadow-lg z-50">
            <ul className="py-1">
              <li
                onClick={handleAddToQueue}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
              >
                Add to Queue
              </li>
              <li
                onClick={handleToggleFavorite}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white flex items-center"
              >
                {isFavorite ? (
                  <>
                    <BsHeartFill className="mr-2 text-red-500" />
                    Remove from Favorites
                  </>
                ) : (
                  <>
                    <BsHeart className="mr-2" />
                    Add to Favorites
                  </>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default SongCard;
