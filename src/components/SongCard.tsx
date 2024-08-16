import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  playPause,
  setActiveSong,
  addToQueue,
} from "../redux/features/playerSlice";

import PlayPause from "./PlayPause";

import { BsThreeDots } from "react-icons/bs";
import { Song } from "../types";

// Define types

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  activeSong: Song | null;
  data: Song[];
  i: number;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying,
  activeSong,
  data,
  i,
}) => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

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

  // Placeholder for adding to favorites
  const handleAddToFavorites = () => {
    console.log("Add to favorites functionality not implemented yet");
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
          <Link to={`/songs/${song?.songId}`}>{song.title}</Link>
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
                onClick={handleAddToFavorites}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
              >
                Add to Favourites
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
