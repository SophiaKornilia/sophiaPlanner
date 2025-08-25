import { motion } from "framer-motion";

export const Loader = () => (
  <div className="flex space-x-2 justify-center items-center h-32">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-3 h-3 bg-accent rounded-full"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          delay: i * 0.2,
          duration: 0.6,
          repeat: Infinity,
        }}
      />
    ))}
  </div>
);
