import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdMusicNote, MdGroup, MdLogin, MdLogout, MdAdd } from "react-icons/md";
import {
  joinRoom,
  createRoom,
  leaveRoom,
  fetchRoomDetails,
  updateRoomPlayback,
  setRoomActiveSong,
  playPauseRoom,
  setPlaylist,
} from "../redux/features/listeningRoomSlice";
import { stopGlobalPlayer } from "../redux/features/playerSlice";
import MusicPlayer from "../components/ListeningRoom/RoomMusicPlayer";

import Chat from "../components/ListeningRoom/ChatRoom";

const ListeningRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [createRoomName, setCreateRoomName] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeRoom, isLoading, error, currentSong, isPlaying, playlist } =
    useSelector((state) => state.listeningRoom);
  const { tracks } = useSelector((state) => state.roomPlayer);

  useEffect(() => {
    const storedRoomId = localStorage.getItem("activeRoomId");
    if (storedRoomId && !activeRoom) {
      dispatch(fetchRoomDetails(storedRoomId));
    }
  }, [dispatch, activeRoom]);

  useEffect(() => {
    if (activeRoom && activeRoom.playlist) {
      dispatch(setPlaylist(activeRoom.playlist));
    }
  }, [activeRoom, dispatch]);

  const handleCreateRoom = () => {
    if (createRoomName.trim()) {
      dispatch(stopGlobalPlayer());
      dispatch(createRoom(createRoomName));
      setCreateRoomName("");
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      dispatch(stopGlobalPlayer());
      dispatch(joinRoom(roomCode));
      setRoomCode("");
    }
  };

  const handleLeaveRoom = () => {
    if (activeRoom) {
      dispatch(leaveRoom(activeRoom._id));
    }
  };

  const handleRoomSongSelect = (song) => {
    if (!activeRoom) return;

    dispatch(setRoomActiveSong(song));
    dispatch(playPauseRoom(true));
    dispatch(
      updateRoomPlayback({
        roomId: activeRoom._id,
        playbackState: { currentSong: song, isPlaying: true, playlist },
      })
    );
  };

  return (
    <div className="flex flex-col p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="font-bold text-3xl mb-8">
        {user ? `${user.username}'s Listening Room` : "Listening Rooms"}
      </h2>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {activeRoom ? (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold flex items-center mb-4">
            <MdMusicNote className="mr-2" />
            Current Room: {activeRoom.name}
          </h3>
          <p className="mb-4">Room ID: {activeRoom._id}</p>
          <p className="mb-4">Participants: {activeRoom.participants.length}</p>
          <button
            onClick={handleLeaveRoom}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center mb-4"
          >
            <MdLogout className="mr-2" /> Leave Room
          </button>
          <div className="flex">
            <div className="w-2/3 pr-4">
              <MusicPlayer />
            </div>
            <div className="w-1/3">
              <Chat />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold flex items-center mb-4">
              <MdAdd className="mr-2" />
              Create a Room
            </h3>
            <input
              type="text"
              placeholder="Enter room name"
              value={createRoomName}
              onChange={(e) => setCreateRoomName(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <button
              onClick={handleCreateRoom}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Create Room
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold flex items-center mb-4">
              <MdLogin className="mr-2" />
              Join a Room
            </h3>
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold flex items-center mb-4">
          <MdGroup className="mr-2" />
          Public Rooms
        </h3>
        <p>No public rooms available at the moment.</p>
      </div>
    </div>
  );
};

export default ListeningRoom;
