import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Error, Loader, SongCard } from "../components";
import { useGetSongsBySearchQuery } from "../redux/services/spotifyCore";
import { Song, RootState } from "../types";

const Search: React.FC = () => {
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const { activeSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );
  const { data, isFetching, error } = useGetSongsBySearchQuery(
    searchTerm ?? ""
  );

  if (isFetching) return <Loader title={`Searching ${searchTerm}...`} />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Showing results for <span className="font-black">{searchTerm}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.length ? (
          data.map((song: Song, i: number) => (
            <SongCard
              key={song.title}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data}
              i={i}
            />
          ))
        ) : (
          <p className="text-white text-2xl">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
