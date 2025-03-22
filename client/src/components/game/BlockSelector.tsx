import React from 'react';
import Block from './Block';
import { useBlockBlast } from '@/lib/stores/useBlockBlast';
import { useIsMobile } from '@/hooks/use-is-mobile';

const BlockSelector: React.FC = () => {
  const isMobile = useIsMobile();
  const { availableBlocks, selectedBlockIndex, selectBlock, usedBlockCount } = useBlockBlast();
  
  return (
    <div className="block-selector">
      <div className="bg-gray-800 p-3 rounded-lg">
        <h3 className="text-white text-center mb-2 font-bold">Available Blocks</h3>
        <div className="flex justify-center gap-4">
          {availableBlocks.map((block, index) => (
            <Block 
              key={block.id}
              block={block}
              selected={index === selectedBlockIndex && !block.used}
              onClick={() => selectBlock(index)}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400 text-center">
          {usedBlockCount === 3 ? (
            <span className="text-yellow-400">Place all blocks to get new ones!</span>
          ) : isMobile ? (
            <span>Click on a block to select it, then place on the grid</span>
          ) : (
            <span>Use WASD/Arrow keys to move, SPACE to place, 1-2-3 to select blocks</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockSelector;
