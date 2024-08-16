import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
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
import { AppDispatch, RootState } from "../../redux/store";

// Remove the local interfaces as we're now importing them from the slice

const RoomMusicPlayer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying, playlist, activeRoom } = useSelector<
    RootState,
    any
  >((state) => state.listeningRoom);

  const [duration, setDuration] = useState<number>(0);
  const [seekTime, setSeekTime] = useState<number>(0);
  const [appTime, setAppTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.3);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);

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
      <Track
        isPlaying={isPlaying}
        isActive={!!currentSong}
        activeSong={currentSong}
      />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Controls
          isPlaying={isPlaying}
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
          min={0}
          max={duration}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSeekTime(Number(event.target.value))
          }
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
          onTimeUpdate={(event: React.SyntheticEvent<HTMLAudioElement>) =>
            setAppTime((event.target as HTMLAudioElement).currentTime)
          }
          onLoadedData={(event: React.SyntheticEvent<HTMLAudioElement>) =>
            setDuration((event.target as HTMLAudioElement).duration)
          }
        />
      </div>
      <Visualizer isPlaying={isPlaying} />
      <VolumeBar
        value={volume}
        min={0}
        max={1}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setVolume(Number(event.target.value))
        }
        setVolume={setVolume}
      />
    </motion.div>
  );
};

export default RoomMusicPlayer;
