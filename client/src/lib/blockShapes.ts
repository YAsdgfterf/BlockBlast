import { BlockType } from "./stores/useBlockBlast";

// Define different shapes for blocks
const shapes = [
  // Single block
  [
    [true]
  ],
  
  // 2-block horizontal
  [
    [true, true]
  ],
  
  // 2-block vertical
  [
    [true],
    [true]
  ],
  
  // 3-block horizontal
  [
    [true, true, true]
  ],
  
  // 3-block vertical
  [
    [true],
    [true],
    [true]
  ],
  
  // L shape
  [
    [true, false],
    [true, true]
  ],
  
  // Reverse L shape
  [
    [false, true],
    [true, true]
  ],
  
  // T shape
  [
    [true, true, true],
    [false, true, false]
  ],
  
  // Square shape
  [
    [true, true],
    [true, true]
  ],
  
  // Z shape
  [
    [true, true, false],
    [false, true, true]
  ],
  
  // S shape
  [
    [false, true, true],
    [true, true, false]
  ]
];

// Define colors for blocks
const colors = [
  "#FF5252", // Red
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FFC107", // Yellow
  "#9C27B0", // Purple
  "#FF9800", // Orange
  "#00BCD4", // Cyan
];

// Get a random shape
const getRandomShape = (): boolean[][] => {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex];
};

// Get a random color
const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

// Generate a random block
export const getRandomBlock = (): BlockType => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    shape: getRandomShape(),
    color: getRandomColor()
  };
};

// Generate multiple random blocks
export const getRandomBlocks = (count: number): BlockType[] => {
  return Array(count).fill(null).map(() => getRandomBlock());
};
