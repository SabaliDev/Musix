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
