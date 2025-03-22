import React from 'react';
import Block from './Block';
import { useBlockBlast } from '@/lib/stores/useBlockBlast';
import { useDeviceDetection } from '@/hooks/use-is-mobile';

const BlockSelector: React.FC = () => {
  const { isPC, isTouchDevice, deviceType } = useDeviceDetection();
  const { availableBlocks, selectedBlockIndex, selectBlock, usedBlockCount } = useBlockBlast();
  
  const getInstructions = () => {
    if (usedBlockCount === 3) {
      return <span className="text-yellow-400">Place all blocks to get new ones!</span>;
    }
    
    if (isPC) {
      return <span>Use WASD/Arrow keys to move, SPACE to place, 1-2-3 to select blocks</span>;
    } else if (deviceType === 'tablet') {
      return <span>Tap a block to select, then drag and drop to place it</span>;
    } else {
      return <span>Tap a block, then drag and drop to place it</span>;
    }
  };
  
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
          {getInstructions()}
        </div>
      </div>
    </div>
  );
};

export default BlockSelector;
