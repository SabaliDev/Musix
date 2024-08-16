import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants/apiConstants";

interface Song {
  artist: string;
  artistId: number;
  img: string;
  songId: number;
  title: string;
  url: string;
  __v: number;
  _id: string;
}

export const spotifyCoreApi = createApi({
  reducerPath: "spotifyCoreApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query<Song[], void>({
      query: () => "/api/music/songs",
    }),
    getSongsBySearch: builder.query<Song[], string>({
      query: (searchTerm) => `api/music/search/multi?search_type=SONGS_ARTISTS&query=${searchTerm}`,
    }),
  }),
});

export const { useGetTopChartsQuery, useGetSongsBySearchQuery } = spotifyCoreApi;