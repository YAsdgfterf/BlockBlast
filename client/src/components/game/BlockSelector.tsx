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
    return null;
  };
  
  return (
    <div className="block-selector w-[250px]">
      <div className="bg-gray-800 p-3 rounded-lg w-[250px]">
        <h3 className="text-white text-center mb-2 font-bold">Available Blocks</h3>
        <div className="flex justify-center gap-4">
          {availableBlocks
            .filter(block => !block.used)
            .map((block, index) => (
              <Block 
                key={block.id}
                block={block}
                selected={availableBlocks.indexOf(block) === selectedBlockIndex}
                onClick={() => selectBlock(availableBlocks.indexOf(block))}
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
