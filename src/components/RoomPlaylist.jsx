import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, updateRoomPlayback } from '../redux/features/listeningRoomSlice';

const RoomPlaylist = () => {
  const { activeRoom, playlist, currentSong } = useSelector((state) => state.listeningRoom);
  const dispatch = useDispatch();

  const handleSongClick = (song) => {
    if (!activeRoom) return;

    const newPlaybackState = { isPlaying: true, currentSong: song, playlist };
    dispatch(updateRoomPlayback({ roomId: activeRoom._id, playbackState: newPlaybackState }));
  };

  return (
    <div className="flex flex-col w-full p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white text-xl font-bold mb-4">Room Playlist</h3>
      <ul className="overflow-y-auto max-h-60">
        {playlist.map((song) => (
          <li
            key={song.id}
            className={`flex items-center justify-between p-2 cursor-pointer ${
              currentSong?.id === song.id ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            onClick={() => handleSongClick(song)}
          >
            <div className="flex items-center">
              <img src={song.img} alt={song.title} className="w-10 h-10 mr-3 rounded" />
              <div>
                <p className="text-white">{song.title}</p>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
            </div>
            <span className="text-gray-400">{song.duration}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomPlaylist;