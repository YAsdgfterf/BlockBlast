import { useEffect, useCallback } from 'react';
import { useBlockBlast } from '../stores/useBlockBlast';

export const useKeyboardControls = () => {
  const { 
    moveHover, 
    selectBlock, 
    placeBlock,
    availableBlocks,
    selectedBlockIndex,
    isGameOver,
    canPlace
  } = useBlockBlast();
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isGameOver) return;
    
    switch (event.code) {
      // Arrow keys
      case 'ArrowUp':
      case 'KeyW': // W key
        moveHover('up');
        event.preventDefault();
        break;
      case 'ArrowDown':
      case 'KeyS': // S key
        moveHover('down');
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'KeyA': // A key
        moveHover('left');
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD': // D key
        moveHover('right');
        event.preventDefault();
        break;
      
      // Place block
      case 'Space':
      case 'Enter':
        if (canPlace) {
          placeBlock();
        }
        event.preventDefault();
        break;
      
      // Block selection
      case 'Digit1':
      case 'Numpad1':
        if (!availableBlocks[0].used) {
          selectBlock(0);
          event.preventDefault();
        }
        break;
      case 'Digit2':
      case 'Numpad2':
        if (availableBlocks.length > 1 && !availableBlocks[1].used) {
          selectBlock(1);
          event.preventDefault();
        }
        break;
      case 'Digit3':
      case 'Numpad3':
        if (availableBlocks.length > 2 && !availableBlocks[2].used) {
          selectBlock(2);
          event.preventDefault();
        }
        break;
      case 'Tab':
        // Cycle through available unused blocks
        let nextIndex = (selectedBlockIndex + 1) % availableBlocks.length;
        
        // Keep cycling until we find an unused block or we've checked all blocks
        let count = 0;
        while (availableBlocks[nextIndex].used && count < availableBlocks.length) {
          nextIndex = (nextIndex + 1) % availableBlocks.length;
          count++;
        }
        
        if (!availableBlocks[nextIndex].used) {
          selectBlock(nextIndex);
        }
        event.preventDefault();
        break;
    }
  }, [
    moveHover, 
    selectBlock, 
    placeBlock, 
    availableBlocks, 
    selectedBlockIndex,
    isGameOver,
    canPlace
  ]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return null;
};

export default useKeyboardControls;
