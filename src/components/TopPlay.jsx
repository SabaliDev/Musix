import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { useGetTopChartsQuery } from "../redux/services/spotifyCore";

const TopChartCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, delay: i * 0.1 }}
    className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${
      activeSong?.title === song?.title ? "bg-[#4c426e]" : "bg-transparent"
    } py-2 p-4 rounded-lg cursor-pointer mb-2`}
  >
    <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img className="w-20 h-20 rounded-lg" src={song?.img} alt={song?.title} />
      <div className="flex-1 flex flex-col justify-center mx-3">
        <Link to={`/songs/${song.key}`}>
          <p className="text-xl font-bold text-white">{song?.title}</p>
        </Link>
        <Link to={`/artists/${song?.artist}`}>
          <p className="text-base text-gray-300 mt-1">{song?.artist}</p>
        </Link>
      </div>
    </div>
    <PlayPause
      isPlaying={isPlaying}
      activeSong={activeSong}
      song={song}
      handlePause={handlePauseClick}
      handlePlay={handlePlayClick}
    />
  </motion.div>
);

const TopArtists = ({ topPlays }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <div className="relative w-full h-56 overflow-hidden">
      <motion.div
        className="flex"
        animate={{ x: `${-currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {topPlays?.map((artist, index) => (
          <motion.div
            key={artist?.key}
            className="w-full flex-shrink-0 flex justify-center items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to={`/artists/${artist?.artist}`}>
              <img
                src={artist?.img}
                alt={artist?.artist}
                className="rounded-full w-40 h-40 object-cover"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {topPlays?.map((_, index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full bg-white mx-1 cursor-pointer"
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            animate={{
              scale: currentIndex === index ? 1.2 : 1,
              opacity: currentIndex === index ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data } = useGetTopChartsQuery();
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const topPlays = data?.slice(0, 5);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col"
    >
      <motion.div className="w-full flex flex-col">
        <motion.div 
          className="flex flex-row justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-white font-bold text-2xl">Top Charts</h2>
        </motion.div>

        <div className="mt-4 flex flex-col gap-1">
          <AnimatePresence>
            {topPlays?.map((song, i) => (
              <TopChartCard
                key={song.key}
                song={song}
                i={i}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={() => handlePlayClick(song, i)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div 
        className="w-full flex flex-col mt-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div 
          className="flex flex-row justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-white font-bold text-2xl">Top Artists</h2>
        </motion.div>

        <TopArtists topPlays={topPlays} />
      </motion.div>
    </motion.div>
  );
};

export default TopPlay;