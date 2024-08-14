import { motion } from 'framer-motion';

const Visualizer = ({ isPlaying }) => {
  const barCount = 20;
  const bars = Array(barCount).fill(0);

  return (
    <div className="flex justify-center items-end h-16 mt-4">
      {bars.map((_, index) => (
        <motion.div
          key={index}
          className="w-1 mx-[1px] bg-white"
          animate={{
            height: isPlaying ? Math.random() * 100 + '%' : '10%',
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;