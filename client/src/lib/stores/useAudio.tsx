import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement;
  hitSound: HTMLAudioElement;
  successSound: HTMLAudioElement;
  isMuted: boolean;

  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
}

const loadAudio = (fileName: string, loop: boolean = false): HTMLAudioElement => {
  const audio = new Audio(`/sounds/${fileName}`);
  audio.loop = loop;
  return audio;
};

export const useAudio = create<AudioState>((set, get) => {
  const backgroundMusic = loadAudio("Recording_3_out.m4a", true);
  const hitSound = loadAudio("hit.mp3");
  const successSound = loadAudio("success.mp3");

  return {
    backgroundMusic,
    hitSound,
    successSound,
    isMuted: true, // Start muted by default

    toggleMute: () => {
      const { isMuted, backgroundMusic } = get();
      const newMutedState = !isMuted;
      
      backgroundMusic.muted = newMutedState;
      set({ isMuted: newMutedState });
      console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
    },

    playHit: () => {
      const { hitSound, isMuted } = get();
      if (!isMuted) {
        const soundClone = hitSound.cloneNode() as HTMLAudioElement;
        soundClone.volume = 0.3;
        soundClone.play().catch(error => console.log("Hit sound play prevented:", error));
      } else {
        console.log("Hit sound skipped (muted)");
      }
    },

    playSuccess: () => {
      const { successSound, isMuted } = get();
      if (!isMuted) {
        successSound.currentTime = 0;
        successSound.play().catch(error => console.log("Success sound play prevented:", error));
      } else {
        console.log("Success sound skipped (muted)");
      }
    },
  };
});
