import React from 'react';
import { motion } from 'framer-motion';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { BsArrowRepeat, BsFillPauseFill, BsFillPlayFill, BsShuffle } from 'react-icons/bs';

const Controls = ({ isPlaying, repeat, setRepeat, shuffle, setShuffle, currentSongs, handlePlayPause, handlePrevSong, handleNextSong }) => (
  <motion.div 
    className="flex items-center justify-around md:w-36 lg:w-52 2xl:w-80"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <BsArrowRepeat size={20} color={repeat ? 'red' : 'white'} onClick={() => setRepeat((prev) => !prev)} className="hidden sm:block cursor-pointer" />
    </motion.div>
    {currentSongs?.length && (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <MdSkipPrevious size={30} color="#FFF" className="cursor-pointer" onClick={handlePrevSong} />
      </motion.div>
    )}
    <motion.div 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.95 }}
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {isPlaying ? (
        <BsFillPauseFill size={45} color="#FFF" onClick={handlePlayPause} className="cursor-pointer" />
      ) : (
        <BsFillPlayFill size={45} color="#FFF" onClick={handlePlayPause} className="cursor-pointer" />
      )}
    </motion.div>
    {currentSongs?.length && (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <MdSkipNext size={30} color="#FFF" className="cursor-pointer" onClick={handleNextSong} />
      </motion.div>
    )}
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <BsShuffle size={20} color={shuffle ? 'red' : 'white'} onClick={() => setShuffle((prev) => !prev)} className="hidden sm:block cursor-pointer" />
    </motion.div>
  </motion.div>
);

export default Controls;