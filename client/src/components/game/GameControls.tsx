import React, { useEffect } from 'react';
import useKeyboardControls from '@/lib/hooks/useKeyboardControls';
import { useAudio } from '@/lib/stores/useAudio';

const GameControls: React.FC = () => {
  // Initialize keyboard controls
  useKeyboardControls();
  
  const { isMuted, toggleMute, backgroundMusic } = useAudio();
  
  // Start playing background music when the component mounts
  useEffect(() => {
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(error => {
        console.log("Background music prevented:", error);
      });
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [backgroundMusic, isMuted]);
  
  return (
    <div className="game-controls absolute top-2 right-2">
      <button 
        onClick={toggleMute}
        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        )}
      </button>
      
      <div className="mt-4 p-3 bg-gray-700 rounded text-xs text-gray-300 w-32">
        <div className="mb-2">Controls:</div>
        <div className="flex flex-col space-y-1">
          <div>Arrows: Move</div>
          <div>SPACE: Place</div>
          <div>1,2,3: Select</div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
