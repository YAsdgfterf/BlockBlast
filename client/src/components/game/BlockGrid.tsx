import React from 'react';
import { useBlockBlast } from '@/lib/stores/useBlockBlast';
import { motion, AnimatePresence } from 'framer-motion';

const BlockGrid: React.FC = () => {
  const { 
    grid, 
    hoverPosition, 
    availableBlocks, 
    selectedBlockIndex, 
    canPlace,
    setHoverPosition
  } = useBlockBlast();
  
  const selectedBlock = availableBlocks[selectedBlockIndex];
  
  const handleCellMouseEnter = (row: number, col: number) => {
    setHoverPosition({ row, col });
  };
  
  const handleCellMouseLeave = () => {
    // We keep the hover position when mouse leaves
    // so keyboard controls can still work from last position
  };
  
  // Visualize where the selected block would be placed
  const renderHoverOverlay = (row: number, col: number) => {
    if (!hoverPosition) return null;
    
    // Check if this cell would be affected by the currently hovered block
    const rowOffset = row - hoverPosition.row;
    const colOffset = col - hoverPosition.col;
    
    // Only render overlay if this cell is within the bounds of the shape
    if (
      rowOffset >= 0 && 
      rowOffset < selectedBlock.shape.length && 
      colOffset >= 0 && 
      colOffset < selectedBlock.shape[0].length &&
      selectedBlock.shape[rowOffset][colOffset]
    ) {
      return (
        <div 
          className={`absolute inset-0 z-10 opacity-60 border-2 ${
            canPlace ? 'bg-green-400 border-green-600' : 'bg-red-400 border-red-600'
          }`}
        ></div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="grid-container">
      <div className="grid grid-cols-8 grid-rows-8 gap-1 bg-gray-700 p-2 rounded">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-gray-600 rounded"
              style={{ background: cell.filled ? cell.color : '#333' }}
              onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
              onMouseLeave={handleCellMouseLeave}
            >
              {hoverPosition && renderHoverOverlay(rowIndex, colIndex)}
              
              <AnimatePresence>
                {cell.filled && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-full h-full rounded"
                    style={{ backgroundColor: cell.color }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default BlockGrid;
