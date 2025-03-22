import React from 'react';
import Block from './Block';
import { useBlockBlast } from '@/lib/stores/useBlockBlast';

const BlockSelector: React.FC = () => {
  const { availableBlocks, selectedBlockIndex, selectBlock } = useBlockBlast();
  
  return (
    <div className="block-selector">
      <div className="bg-gray-800 p-3 rounded-lg">
        <h3 className="text-white text-center mb-2 font-bold">Available Blocks</h3>
        <div className="flex justify-center gap-4">
          {availableBlocks.map((block, index) => (
            <Block 
              key={block.id}
              block={block}
              selected={index === selectedBlockIndex}
              onClick={() => selectBlock(index)}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400 text-center">
          Press 1, 2, 3 or TAB to switch blocks
        </div>
      </div>
    </div>
  );
};

export default BlockSelector;
