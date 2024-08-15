import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPlaylists, createPlaylist } from '../redux/features/playListSlice';

const PlaylistsPage = () => {
  const dispatch = useDispatch();
  const { userPlaylists, isLoading } = useSelector(state => state.playlists);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    dispatch(getUserPlaylists());
  }, [dispatch]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      dispatch(createPlaylist(newPlaylistName));
      setNewPlaylistName('');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Playlists</h2>
      <form onSubmit={handleCreatePlaylist}>
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New Playlist Name"
        />
        <button type="submit">Create Playlist</button>
      </form>
      <ul>
        {userPlaylists.map(playlist => (
          <li key={playlist._id}>
            <h3>{playlist.name}</h3>
            <p>{playlist.songs.length} songs</p>
            {/* You can add more details or a link to a detailed playlist view */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistsPage;