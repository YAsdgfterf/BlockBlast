import React from 'react';
import { motion } from 'framer-motion';
import { BlockType } from '@/lib/stores/useBlockBlast';

interface BlockProps {
  block: BlockType;
  selected: boolean;
  onClick: () => void;
}

const Block: React.FC<BlockProps> = ({ block, selected, onClick }) => {
  const isUsed = block.used || false;
  
  return (
    <motion.div 
      className={`block-container p-2 rounded-md transition-all ${
        isUsed 
          ? 'bg-gray-900 opacity-40 cursor-not-allowed' 
          : selected 
            ? 'bg-gray-600 ring-2 ring-white cursor-pointer' 
            : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
      }`}
      onClick={isUsed ? undefined : onClick}
      whileHover={isUsed ? {} : { scale: 1.05 }}
      whileTap={isUsed ? {} : { scale: 0.95 }}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-1 p-1">
        {Array.from({ length: block.shape.length }).map((_, rowIndex) => (
          Array.from({ length: block.shape[0].length }).map((_, colIndex) => {
            const isFilled = rowIndex < block.shape.length && 
                           colIndex < block.shape[rowIndex].length && 
                           block.shape[rowIndex][colIndex];
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className="w-6 h-6 rounded"
                style={{ 
                  backgroundColor: isFilled ? block.color : 'transparent',
                  border: isFilled ? 'none' : '1px dashed #555'
                }}
              />
            );
          })
        ))}
      </div>
      
      {isUsed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs">USED</span>
        </div>
      )}
    </motion.div>
  );
};

export default Block;
