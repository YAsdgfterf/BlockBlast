import React from 'react';
import { useBlockBlast } from '@/lib/stores/useBlockBlast';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceDetection } from '@/hooks/use-is-mobile';

const BlockGrid: React.FC = () => {
  const { isPC, isTouchDevice, deviceType } = useDeviceDetection();
  const { 
    grid, 
    hoverPosition, 
    availableBlocks, 
    selectedBlockIndex, 
    canPlace,
    setHoverPosition,
    placeBlock,
    setIsDragging,
    isDragging
  } = useBlockBlast();
  
  const selectedBlock = availableBlocks[selectedBlockIndex];
  
  // Display device type indicator for debugging
  React.useEffect(() => {
    console.log(`Current device: ${deviceType}`);
    console.log(`Touch enabled: ${isTouchDevice}`);
  }, [deviceType, isTouchDevice]);
  
  const handleCellMouseEnter = (row: number, col: number) => {
    if (isPC) {
      // PC users: always update position on hover for the preview
      setHoverPosition({ row, col });
    } else if (isTouchDevice && isDragging) {
      // Touch devices: only update position while dragging
      setHoverPosition({ row, col });
    }
  };
  
  const handleCellMouseDown = (row: number, col: number) => {
    if (isTouchDevice) {
      // Only set dragging state on touch devices
      setHoverPosition({ row, col });
      setIsDragging(true);
    }
  };
  
  const handleCellMouseUp = () => {
    if (isTouchDevice) {
      // Only handle drag-and-drop on touch devices
      if (isDragging && canPlace) {
        placeBlock();
      }
      setIsDragging(false);
    }
  };
  
  const handleCellClick = () => {
    // For PC: just check if we can place, keyboard controls handle the rest
    if (isPC && canPlace) {
      // PC users will use keyboard for placement, so no click-to-place
      // They'll just use SPACE key
    }
  };
  
  const handleMouseLeave = () => {
    // Keep hover position for keyboard controls
  };
  
  // Handle mouse/touch up globally to ensure we capture the event
  React.useEffect(() => {
    if (!isTouchDevice) return; // Only needed for touch devices
    
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleCellMouseUp();
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, canPlace, isTouchDevice]);
  
  // Visualize where the selected block would be placed
  const renderHoverOverlay = (row: number, col: number) => {
    if (!hoverPosition || selectedBlock.used) return null;
    
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
      {/* Optional device type indicator in top-left corner */}
      <div className="absolute top-0 left-0 bg-gray-800 text-white text-xs p-1 rounded">
        {deviceType.toUpperCase()}
      </div>
      
      <div 
        className="grid grid-cols-8 grid-rows-8 gap-1 bg-gray-700 p-2 rounded"
        onMouseLeave={handleMouseLeave}
      >
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-gray-600 rounded cursor-pointer"
              style={{ background: cell.filled ? cell.color : '#333' }}
              onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
              onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
              onClick={handleCellClick}
              onTouchMove={(e) => {
                // Get touch position and convert to grid cell
                if (isTouchDevice && isDragging) {
                  // This is a simplified approach - for a real implementation
                  // you would need to calculate the actual grid cell from touch coordinates
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  const cellData = element && element.getAttribute('data-cell');
                  if (cellData) {
                    const [row, col] = cellData.split('-').map(Number);
                    handleCellMouseEnter(row, col);
                  }
                }
              }}
              data-cell={`${rowIndex}-${colIndex}`}
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
