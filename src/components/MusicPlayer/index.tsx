import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

import {
  nextSong,
  prevSong,
  playPause,
} from "../../redux/features/playerSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import Visualizer from "./Visualizer";
import { RootState, AppDispatch } from "../../redux/store"; // Assuming you have these types defined in your store

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface Room {
  id: string;
  name: string;
}

const MusicPlayer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeRoom } = useSelector(
    (state: RootState) => state.listeningRoom as { activeRoom: Room | null }
  );
  const { activeSong, isPlaying, currentSongs } = useSelector(
    (state: RootState) =>
      state.player as unknown as {
        activeSong: Song | null;
        isPlaying: boolean;
        currentSongs: Song[];
      }
  );

  if (activeRoom) return null;

  const [duration, setDuration] = useState<number>(0);
  const [seekTime, setSeekTime] = useState<number>(0);
  const [appTime, setAppTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.3);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);

  const handlePlayPause = () => {
    if (currentSongs.length) dispatch(playPause(!isPlaying));
  };

  const handleNextSong = () => {
    dispatch(nextSong());
  };

  const handlePrevSong = () => {
    dispatch(prevSong());
  };

  return (
    <motion.div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
      <Track
        isPlaying={isPlaying}
        isActive={!!activeSong}
        activeSong={activeSong}
      />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Controls
          isPlaying={isPlaying}
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
          min={0}
          max={duration}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSeekTime(Number(event.target.value))
          }
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

export default MusicPlayer;
