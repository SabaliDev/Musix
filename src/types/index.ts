export interface Song {
  artist: string;
  artistId: number;
  img: string;
  songId: number;
  title: string;
  url: string;
  __v: number;
  _id: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface User {
  username: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserInfo extends Credentials {
  username: string;
  email: string;
  password: string;
}

export interface RootState {
  player: {
    activeSong: Song | null;
    isPlaying: boolean;
  };
}