import { useEffect, useCallback } from 'react';
import { useBlockBlast } from '../stores/useBlockBlast';

export const useKeyboardControls = () => {
  const { 
    moveHover, 
    selectBlock, 
    placeBlock,
    availableBlocks,
    selectedBlockIndex,
    isGameOver
  } = useBlockBlast();
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isGameOver) return;
    
    switch (event.code) {
      case 'ArrowUp':
        moveHover('up');
        event.preventDefault();
        break;
      case 'ArrowDown':
        moveHover('down');
        event.preventDefault();
        break;
      case 'ArrowLeft':
        moveHover('left');
        event.preventDefault();
        break;
      case 'ArrowRight':
        moveHover('right');
        event.preventDefault();
        break;
      case 'Space':
        placeBlock();
        event.preventDefault();
        break;
      case 'Digit1':
      case 'Numpad1':
        selectBlock(0);
        event.preventDefault();
        break;
      case 'Digit2':
      case 'Numpad2':
        if (availableBlocks.length > 1) {
          selectBlock(1);
          event.preventDefault();
        }
        break;
      case 'Digit3':
      case 'Numpad3':
        if (availableBlocks.length > 2) {
          selectBlock(2);
          event.preventDefault();
        }
        break;
      case 'Tab':
        // Cycle through available blocks
        const nextIndex = (selectedBlockIndex + 1) % availableBlocks.length;
        selectBlock(nextIndex);
        event.preventDefault();
        break;
    }
  }, [
    moveHover, 
    selectBlock, 
    placeBlock, 
    availableBlocks, 
    selectedBlockIndex,
    isGameOver
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
