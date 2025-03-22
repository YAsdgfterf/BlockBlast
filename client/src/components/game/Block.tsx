import React from 'react';
import { motion } from 'framer-motion';
import { BlockType } from '@/lib/stores/useBlockBlast';

interface BlockProps {
  block: BlockType;
  selected: boolean;
  onClick: () => void;
}

const Block: React.FC<BlockProps> = ({ block, selected, onClick }) => {
  const maxSize = 4; // Maximum possible size of a block shape
  
  return (
    <motion.div 
      className={`block-container p-2 rounded-md cursor-pointer transition-all ${
        selected ? 'bg-gray-600 ring-2 ring-white' : 'bg-gray-700 hover:bg-gray-600'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
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
    </motion.div>
  );
};

export default Block;
