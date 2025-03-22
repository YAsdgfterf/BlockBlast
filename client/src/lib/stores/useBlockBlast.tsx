import { create } from "zustand";
import { getRandomBlocks } from "../blockShapes";
import { useAudio } from "./useAudio";

export type BlockType = {
  id: string;
  shape: boolean[][];
  color: string;
  used?: boolean; // Track if block has been used
};

export type CellType = {
  filled: boolean;
  color: string;
};

export type GameState = {
  grid: CellType[][];
  availableBlocks: BlockType[];
  selectedBlockIndex: number;
  hoverPosition: { row: number; col: number } | null;
  canPlace: boolean;
  score: number;
  isGameOver: boolean;
  isDragging: boolean;
  usedBlockCount: number; // Track how many blocks have been used
  
  // Actions
  selectBlock: (index: number) => void;
  setHoverPosition: (position: { row: number; col: number } | null) => void;
  placeBlock: () => void;
  checkAndClearRows: () => void;
  resetGame: () => void;
  moveHover: (direction: 'up' | 'down' | 'left' | 'right') => void;
  setIsDragging: (isDragging: boolean) => void;
  
  // Helper functions
  canBlockBePlaced: (block: BlockType, startRow: number, startCol: number) => boolean;
  checkGameOver: () => void;
};

const GRID_SIZE = 8;

// Initialize an empty grid
const createEmptyGrid = (): CellType[][] => {
  return Array(GRID_SIZE).fill(0).map(() => 
    Array(GRID_SIZE).fill(0).map(() => ({ filled: false, color: '' }))
  );
};

export const useBlockBlast = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  availableBlocks: getRandomBlocks(3).map(block => ({ ...block, used: false })),
  selectedBlockIndex: 0,
  hoverPosition: { row: 0, col: 0 },
  canPlace: false,
  score: 0,
  isGameOver: false,
  isDragging: false,
  usedBlockCount: 0,
  
  selectBlock: (index: number) => {
    const { availableBlocks } = get();
    const unusedBlocks = availableBlocks.filter(block => !block.used);
    
    // Only allow selecting blocks that exist and aren't used
    if (index >= 0 && index < availableBlocks.length && !availableBlocks[index].used) {
      set({ selectedBlockIndex: index });
      
      // Recalculate canPlace with the new selected block
      const { hoverPosition } = get();
      if (hoverPosition) {
        const canPlace = get().canBlockBePlaced(
          availableBlocks[index],
          hoverPosition.row,
          hoverPosition.col
        );
        set({ canPlace });
      }
      
      // Auto-select first unused block if current selection is used
      if (availableBlocks[index].used) {
        const firstUnusedIndex = availableBlocks.findIndex(block => !block.used);
        if (firstUnusedIndex !== -1) {
          set({ selectedBlockIndex: firstUnusedIndex });
        }
      }
    }
  },
  
  setIsDragging: (isDragging: boolean) => {
    set({ isDragging });
  },
  
  setHoverPosition: (position) => {
    if (!position) {
      set({ hoverPosition: null, canPlace: false });
      return;
    }
    
    const { availableBlocks, selectedBlockIndex } = get();
    const selectedBlock = availableBlocks[selectedBlockIndex];
    
    // Skip if the selected block has been used
    if (selectedBlock.used) return;
    
    const canPlace = get().canBlockBePlaced(
      selectedBlock,
      position.row,
      position.col
    );
    
    set({ hoverPosition: position, canPlace });
  },
  
  canBlockBePlaced: (block: BlockType, startRow: number, startCol: number) => {
    const { grid } = get();
    const shape = block.shape;
    
    // Don't place if block has been used
    if (block.used) return false;
    
    // Check if the entire block is within grid bounds and all cells are empty
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const row = startRow + i;
          const col = startCol + j;
          
          // Check if out of bounds or cell already filled
          if (
            row < 0 || row >= GRID_SIZE || 
            col < 0 || col >= GRID_SIZE || 
            grid[row][col].filled
          ) {
            return false;
          }
        }
      }
    }
    
    return true;
  },
  
  placeBlock: () => {
    const { 
      availableBlocks, 
      selectedBlockIndex, 
      hoverPosition, 
      canPlace,
      grid,
      usedBlockCount
    } = get();
    
    // If can't place, return early
    if (!canPlace || !hoverPosition) return;
    
    const selectedBlock = availableBlocks[selectedBlockIndex];
    
    // Skip if the block has been used
    if (selectedBlock.used) return;
    
    const newGrid = [...grid];
    
    // Place the block
    for (let i = 0; i < selectedBlock.shape.length; i++) {
      for (let j = 0; j < selectedBlock.shape[i].length; j++) {
        if (selectedBlock.shape[i][j]) {
          const row = hoverPosition.row + i;
          const col = hoverPosition.col + j;
          
          newGrid[row][col] = { 
            filled: true, 
            color: selectedBlock.color 
          };
        }
      }
    }
    
    // Play sound effect
    useAudio.getState().playHit();
    
    // Update the grid
    set({ grid: newGrid });
    
    // Find next unused block before marking current as used
    let nextUnusedIndex = (selectedBlockIndex + 1) % availableBlocks.length;
    while (availableBlocks[nextUnusedIndex].used && nextUnusedIndex !== selectedBlockIndex) {
      nextUnusedIndex = (nextUnusedIndex + 1) % availableBlocks.length;
    }
    
    // Mark the block as used
    const newBlocks = [...availableBlocks];
    newBlocks[selectedBlockIndex] = { ...newBlocks[selectedBlockIndex], used: true };
    
    // Increment used block count
    const newUsedBlockCount = usedBlockCount + 1;
    
    // If all blocks are used, get new blocks
    let updatedBlocks = newBlocks;
    if (newUsedBlockCount >= 3) {
      updatedBlocks = getRandomBlocks(3).map(block => ({ ...block, used: false }));
      set({ usedBlockCount: 0 });
      nextUnusedIndex = 0;
    } else {
      set({ usedBlockCount: newUsedBlockCount });
    }
    
    set({ 
      availableBlocks: updatedBlocks,
      canPlace: false,  // Reset canPlace until hover is updated
      selectedBlockIndex: nextUnusedIndex,
    });
    
    // Check for completed rows
    get().checkAndClearRows();
    
    // Check for game over
    get().checkGameOver();
  },
  
  checkAndClearRows: () => {
    const { grid } = get();
    const rowsToCheck = new Set<number>();
    const colsToCheck = new Set<number>();
    
    // Gather all rows and columns to check based on filled cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col].filled) {
          rowsToCheck.add(row);
          colsToCheck.add(col);
        }
      }
    }
    
    const completedRows: number[] = [];
    const completedCols: number[] = [];
    
    // Check rows
    rowsToCheck.forEach(row => {
      const isComplete = grid[row].every(cell => cell.filled);
      if (isComplete) completedRows.push(row);
    });
    
    // Check columns
    colsToCheck.forEach(col => {
      const isComplete = grid.every(row => row[col].filled);
      if (isComplete) completedCols.push(col);
    });
    
    // If no completed rows or columns, return early
    if (completedRows.length === 0 && completedCols.length === 0) return;
    
    // Create a new grid to update
    const newGrid = [...grid.map(row => [...row])];
    
    // Clear completed rows
    completedRows.forEach(row => {
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[row][col] = { filled: false, color: '' };
      }
    });
    
    // Clear completed columns
    completedCols.forEach(col => {
      for (let row = 0; row < GRID_SIZE; row++) {
        newGrid[row][col] = { filled: false, color: '' };
      }
    });
    
    // Calculate score: 10 points per cleared cell
    const totalCleared = 
      completedRows.length * GRID_SIZE + 
      completedCols.length * GRID_SIZE - 
      (completedRows.length * completedCols.length); // Avoid double counting
    
    const additionalScore = totalCleared * 10;
    
    // Play success sound if we cleared any rows/columns
    if (totalCleared > 0) {
      useAudio.getState().playSuccess();
    }
    
    // Update state
    set(state => ({ 
      grid: newGrid,
      score: state.score + additionalScore
    }));
  },
  
  checkGameOver: () => {
    const { availableBlocks, grid } = get();
    
    // Check if any block can be placed anywhere on the grid
    const canPlaceAnyBlock = availableBlocks.some(block => {
      // Skip blocks that have been used
      if (block.used) return false;
      
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (get().canBlockBePlaced(block, row, col)) {
            return true;
          }
        }
      }
      return false;
    });
    
    if (!canPlaceAnyBlock) {
      set({ isGameOver: true });
    }
  },
  
  moveHover: (direction) => {
    const { hoverPosition } = get();
    if (!hoverPosition) return;
    
    let { row, col } = hoverPosition;
    
    switch (direction) {
      case 'up':
        row = Math.max(0, row - 1);
        break;
      case 'down':
        row = Math.min(GRID_SIZE - 1, row + 1);
        break;
      case 'left':
        col = Math.max(0, col - 1);
        break;
      case 'right':
        col = Math.min(GRID_SIZE - 1, col + 1);
        break;
    }
    
    get().setHoverPosition({ row, col });
  },
  
  resetGame: () => {
    set({
      grid: createEmptyGrid(),
      availableBlocks: getRandomBlocks(3).map(block => ({ ...block, used: false })),
      selectedBlockIndex: 0,
      hoverPosition: { row: 0, col: 0 },
      canPlace: false,
      score: 0,
      isGameOver: false,
      isDragging: false,
      usedBlockCount: 0
    });
  }
}));
