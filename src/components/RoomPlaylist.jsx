import React from 'react';
import { useSelector } from 'react-redux';

const RoomPlaylist = ({ onSongSelect }) => {
  const { activeRoom } = useSelector((state) => state.listeningRoom);
  const { currentSong, isPlaying } = useSelector((state) => state.listeningRoom);

  if (!activeRoom || !activeRoom.playlist) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Room Playlist</h3>
        <p>No playlist available.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Room Playlist</h3>
      <ul>
        {activeRoom.playlist.map((song, index) => (
          <li
            key={song.id}
            className={`cursor-pointer p-2 hover:bg-gray-700 ${
              currentSong?.id === song.id ? 'bg-gray-700' : ''
            }`}
            onClick={() => onSongSelect(song, index)}
          >
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomPlaylist;