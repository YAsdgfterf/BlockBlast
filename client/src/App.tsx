import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import BlockGrid from "./components/game/BlockGrid";
import BlockSelector from "./components/game/BlockSelector";
import GameControls from "./components/game/GameControls";
import Score from "./components/game/Score";
import GameOver from "./components/game/GameOver";
import { useBlockBlast } from "./lib/stores/useBlockBlast";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

function App() {
  const { 
    score, 
    isGameOver,
    resetGame
  } = useBlockBlast();
  
  const [gameStarted, setGameStarted] = useState(false);
  
  // Initialize audio elements
  const {
    setBackgroundMusic,
    setHitSound,
    setSuccessSound,
  } = useAudio();
  
  useEffect(() => {
    // Set up game sounds
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    const hitSfx = new Audio('/sounds/hit.mp3');
    hitSfx.volume = 0.3;
    
    const successSfx = new Audio('/sounds/success.mp3');
    successSfx.volume = 0.6;
    
    setBackgroundMusic(bgMusic);
    setHitSound(hitSfx);
    setSuccessSound(successSfx);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900">
        <div className="max-w-4xl w-full mx-auto p-4 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-8 font-['Press_Start_2P'] tracking-wider">
            BLOCK BLAST
          </h1>

          {!gameStarted ? (
            <div className="flex flex-col items-center bg-gray-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
              <p className="text-white mb-6 text-center max-w-md">
                Place blocks on the 8×8 grid to form complete rows. Complete rows to score points!
                Use arrow keys to select a block and position, then press SPACE to place it.
              </p>
              <button 
                onClick={startGame} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Start Game
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
              <Score />
              
              <div className="flex flex-col items-center">
                <BlockGrid />
                <div className="mt-6">
                  <BlockSelector />
                </div>
              </div>
              
              <GameControls />
              
              {isGameOver && <GameOver onRestart={startGame} finalScore={score} />}
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
