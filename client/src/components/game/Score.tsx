import React from 'react';
import { useBlockBlast } from '@/lib/stores/useBlockBlast';
import { motion } from 'framer-motion';

const Score: React.FC = () => {
  const { score } = useBlockBlast();
  
  return (
    <div className="score-display mb-4 text-center">
      <div className="bg-gray-900 rounded-lg p-2 inline-block">
        <div className="text-gray-400 text-sm">Score</div>
        <motion.div 
          key={score}
          initial={{ scale: 1.5, color: '#FFD700' }}
          animate={{ scale: 1, color: '#FFFFFF' }}
          className="text-2xl font-bold"
        >
          {score}
        </motion.div>
      </div>
    </div>
  );
};

export default Score;
