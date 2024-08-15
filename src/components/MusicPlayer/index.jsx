import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  addToQueue,
} from "../../redux/features/playerSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import Visualizer from "./Visualizer";

const MusicPlayer = () => {
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying, queue } =
    useSelector((state) => state.player);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentSongs.length && !activeSong?.title) {
      dispatch(
        setActiveSong({ song: currentSongs[0], data: currentSongs, i: 0 })
      );
    }
  }, [currentSongs, activeSong, dispatch]);

  const handlePlayPause = () => {
    if (currentSongs.length) dispatch(playPause(!isPlaying));
  };

  const handleNextSong = () => {
    if (!shuffle) {
      dispatch(nextSong());
    } else {
      const randomIndex = Math.floor(Math.random() * currentSongs.length);
      const randomSong = currentSongs[randomIndex];
      dispatch(
        setActiveSong({ song: randomSong, data: currentSongs, i: randomIndex })
      );
    }
  };

  const handlePrevSong = () => {
    if (currentIndex === 0) {
      dispatch(
        setActiveSong({
          song: currentSongs[currentSongs.length - 1],
          data: currentSongs,
          i: currentSongs.length - 1,
        })
      );
    } else if (shuffle) {
      const randomIndex = Math.floor(Math.random() * currentSongs.length);
      const randomSong = currentSongs[randomIndex];
      dispatch(
        setActiveSong({ song: randomSong, data: currentSongs, i: randomIndex })
      );
    } else {
      dispatch(prevSong());
    }
  };

  return (
    <motion.div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
      <Track
        isPlaying={isPlaying}
        isActive={isActive}
        activeSong={activeSong}
      />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Controls
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={currentSongs}
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
          activeSong={activeSong}
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

export default MusicPlayer;
