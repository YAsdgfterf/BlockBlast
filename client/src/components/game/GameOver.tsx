import React from 'react';
import { motion } from 'framer-motion';

interface GameOverProps {
  onRestart: () => void;
  finalScore: number;
}

const GameOver: React.FC<GameOverProps> = ({ onRestart, finalScore }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-gray-800 p-8 rounded-lg text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
        
        <div className="mb-6">
          <div className="text-gray-300 mb-1">Final Score</div>
          <div className="text-4xl font-bold text-yellow-400">{finalScore}</div>
        </div>
        
        <button 
          onClick={onRestart}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;
