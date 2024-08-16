import React, { useRef, useEffect } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  // Add other properties as needed
}

interface PlayerProps {
  activeSong: Song | null;
  isPlaying: boolean;
  volume: number;
  seekTime: number;
  onEnded?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  onLoadedData?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  repeat?: boolean;
}

const Player: React.FC<PlayerProps> = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
}) => {
  const ref = useRef<HTMLAudioElement | null>(null);

  // Play or pause audio based on isPlaying prop
  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying]);

  // Update volume when volume prop changes
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  // Update current time of the audio element when seekTime changes
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  return (
    <audio
      src={activeSong?.url}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;
