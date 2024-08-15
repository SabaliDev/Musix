import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  playPause,
  setActiveSong,
  addToQueue,
} from "../redux/features/playerSlice";
import { addSongToPlaylist } from "../redux/features/playListSlice";
import PlayPause from "./PlayPause";

import { BsThreeDots } from "react-icons/bs";

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const { userPlaylists } = useSelector((state) => state.playlists);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

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

  const handleAddToPlaylist = (playlistId) => {
    dispatch(addSongToPlaylist({ playlistId, songId: song._id }));
    setShowPlaylistMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
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
                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
              >
                Add to Playlist
              </li>
            </ul>
          </div>
        )}
        {showPlaylistMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1A1A3C] rounded-md shadow-lg z-50">
            <ul className="py-1 max-h-60 overflow-y-auto">
              {userPlaylists.map((playlist) => (
                <li
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
