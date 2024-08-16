import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setIsPlaying, 
  setCurrentTime, 
  nextTrack, 
  prevTrack, 
  fetchTracks, 
  setCurrentTrackIndex 
} from '../../redux/features/roomPlayerSlice';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../../constants/apiConstants';
import { RootState, AppDispatch } from '../../redux/store'; // Assuming you have these types defined in your store

interface Track {
  title: string;
  artist: string;
  url: string;
}

interface RoomPlayerState {
  isPlaying: boolean;
  currentTime: number;
  tracks: Track[];
  currentTrackIndex: number;
  isLoading: boolean;
  error: string | null;
}

const MusicPlayer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isPlaying, currentTime, tracks, currentTrackIndex, isLoading, error } = useSelector<RootState, RoomPlayerState>(
    (state) => state.roomPlayer
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const socketRef = useRef<Socket | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  const connectSocket = useCallback(() => {
    socketRef.current = io(BASE_URL);
    
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('Connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('Disconnected');
    });

    socketRef.current.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      setConnectionStatus('Connection error');
    });

    socketRef.current.on('stateUpdated', (state: { isPlaying: boolean; currentTime: number; currentTrackIndex: number }) => {
      dispatch(setIsPlaying(state.isPlaying));
      dispatch(setCurrentTime(state.currentTime));
      dispatch(setCurrentTrackIndex(state.currentTrackIndex));
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTracks());
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch, connectSocket]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error: Error) => {
          console.log('Playback prevented:', error);
          dispatch(setIsPlaying(false));
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, dispatch]);

  const handlePlayPause = useCallback(() => {
    const newIsPlaying = !isPlaying;
    dispatch(setIsPlaying(newIsPlaying));
    if (socketRef.current && audioRef.current) {
      socketRef.current.emit('updateState', {
        isPlaying: newIsPlaying,
        currentTime: audioRef.current.currentTime,
        currentTrackIndex
      });
    }
  }, [isPlaying, currentTrackIndex, dispatch]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  }, [dispatch]);

  const handleNext = useCallback(() => {
    dispatch(nextTrack());
    if (socketRef.current) {
      socketRef.current.emit('nextTrack');
    }
  }, [dispatch]);

  const handlePrev = useCallback(() => {
    dispatch(prevTrack());
    if (socketRef.current) {
      socketRef.current.emit('prevTrack');
    }
  }, [dispatch]);

  if (isLoading) return <div className="text-white">Loading tracks...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">{currentTrack?.title || 'No track'}</h2>
        <p className="text-gray-300">{currentTrack?.artist || 'Unknown artist'}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-400">Connection Status: {connectionStatus}</p>
      </div>
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={handlePrev}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Previous
        </button>
        <button 
          onClick={handlePlayPause}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Next
        </button>
      </div>
      <div className="text-gray-300">
        <p>Current Time: {currentTime.toFixed(2)}</p>
        <p>Track: {currentTrackIndex + 1} / {tracks.length}</p>
      </div>
    </div>
  );
};

export default MusicPlayer;