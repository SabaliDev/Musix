import React from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { Song } from "../types";

interface PlayPauseProps {
  isPlaying: boolean;
  activeSong: Song | null;
  song: Song;
  handlePause: () => void;
  handlePlay: () => void;
}

const PlayPause: React.FC<PlayPauseProps> = ({
  isPlaying,
  activeSong,
  song,
  handlePause,
  handlePlay,
}) =>
  isPlaying && activeSong?.songId === song.songId ? (
    <FaPauseCircle size={35} className="text-gray-300" onClick={handlePause} />
  ) : (
    <FaPlayCircle size={35} className="text-gray-300" onClick={handlePlay} />
  );

export default PlayPause;
