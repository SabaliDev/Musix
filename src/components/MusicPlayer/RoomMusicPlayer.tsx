import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
  setRoomActiveSong,
  nextRoomSong,
  prevRoomSong,
  playPauseRoom,
} from "../../redux/features/listeningRoomSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import Visualizer from "./Visualizer";

const RoomMusicPlayer = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, playlist, activeRoom } = useSelector((state) => state.listeningRoom);
  
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const handlePlayPause = () => {
    if (playlist.length) dispatch(playPauseRoom(!isPlaying));
  };

  const handleNextSong = () => {
    dispatch(nextRoomSong());
  };

  const handlePrevSong = () => {
    dispatch(prevRoomSong());
  };

  if (!activeRoom) return null;

  return (
    <motion.div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
      <Track isPlaying={isPlaying} isActive={!!currentSong} activeSong={currentSong} />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Controls
          isPlaying={isPlaying}
          isActive={!!currentSong}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={playlist}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />
        <Seekbar
          value={appTime}
          min="0"
          max={duration}
          onInput={(event) => setSeekTime(event.target.value)}
          setSeekTime={setSeekTime}
          appTime={appTime}
        />
        <Player
          activeSong={currentSong}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          onEnded={handleNextSong}
          onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
          onLoadedData={(event) => setDuration(event.target.duration)}
        />
      </div>
      <Visualizer isPlaying={isPlaying} />
      <VolumeBar
        value={volume}
        min="0"
        max="1"
        onChange={(event) => setVolume(event.target.value)}
        setVolume={setVolume}
      />
    </motion.div>
  );
};

export default RoomMusicPlayer;