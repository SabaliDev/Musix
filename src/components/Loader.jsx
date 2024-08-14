import React from "react";
import { motion } from "framer-motion";

const Loader = ({ title }) => {
  const noteVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: { duration: 0.6, repeat: Infinity, repeatType: "loop" },
    },
  };

  const discVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="relative w-32 h-32">
        {/* Vinyl disc */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute w-full h-full"
          variants={discVariants}
          initial="initial"
          animate="animate"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="#333"
            stroke="#1DB954"
            strokeWidth="5"
          />
          <circle cx="50" cy="50" r="20" fill="#1DB954" />
          <circle cx="50" cy="50" r="5" fill="#333" />
        </motion.svg>

        {/* Musical notes */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute w-full h-full"
          initial="initial"
          animate="animate"
        >
          <motion.path
            d="M30 40 Q 40 20, 50 40 T 70 40"
            stroke="#1DB954"
            strokeWidth="2"
            fill="transparent"
            variants={noteVariants}
          />
          <motion.circle
            cx="30"
            cy="40"
            r="3"
            fill="#1DB954"
            variants={noteVariants}
          />
          <motion.circle
            cx="70"
            cy="40"
            r="3"
            fill="#1DB954"
            variants={noteVariants}
            custom={0.2}
          />
        </motion.svg>
      </div>
      <motion.h1
        className="font-bold text-2xl text-white mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {title || "Loading..."}
      </motion.h1>
    </div>
  );
};

export default Loader;
