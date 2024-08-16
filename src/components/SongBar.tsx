import React from "react";
import { Link } from "react-router-dom";

import PlayPause from "./PlayPause";

// Assuming we have a centralized Song type
import { Song } from "../types";

interface SongBarProps {
  song: Song;
  i: number;
  artistId?: string;
  isPlaying: boolean;
  activeSong: Song | null;
  handlePauseClick: () => void;
  handlePlayClick: (song: Song, i: number) => void;
}

const SongBar: React.FC<SongBarProps> = ({
  song,
  i,
  artistId,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => (
  <div
    className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${
      activeSong?.title === song?.title ? "bg-[#4c426e]" : "bg-transparent"
    } py-2 p-4 rounded-lg cursor-pointer mb-2`}
  >
    <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img
        className="w-20 h-20 rounded-lg"
        src={
          artistId
            ? song.img.replace("{w}", "125").replace("{h}", "125")
            : song.img
        }
        alt={song.title}
      />
      <div className="flex-1 flex flex-col justify-center mx-3">
        {!artistId ? (
          <Link to={`/songs/${song._id}`}>
            <p className="text-xl font-bold text-white">{song.title}</p>
          </Link>
        ) : (
          <p className="text-xl font-bold text-white">{song.title}</p>
        )}
        <p className="text-base text-gray-300 mt-1">{song.artist}</p>
      </div>
    </div>
    {!artistId && (
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={() => handlePlayClick(song, i)}
      />
    )}
  </div>
);

export default SongBar;
