import React from 'react';
import { motion } from 'framer-motion';

interface ActiveSong {
  img?: string;
  title?: string;
  artist?: string;
}

interface TrackProps {
  isPlaying: boolean;
  isActive: boolean;
  activeSong: ActiveSong | null;
}

const Track: React.FC<TrackProps> = ({ isPlaying, isActive, activeSong }) => (
  <motion.div 
    className="flex-1 flex items-center justify-start"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className="hidden sm:block h-16 w-16 mr-4"
      animate={{
        rotate: isPlaying && isActive ? 360 : 0,
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <img src={activeSong?.img ?? ''} alt="cover art" className="rounded-full" />
    </motion.div>
    <motion.div 
      className="w-[50%]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="truncate text-white font-bold text-lg">
        {activeSong?.title ?? 'No active Song'}
      </p>
      <p className="truncate text-gray-300">
        {activeSong?.artist ?? 'No active Song'}
      </p>
    </motion.div>
  </motion.div>
);

export default Track;
