import { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) {
      // Initialize audio on first click
      audioRef.current = new Audio('/music/background.mp3'); // Add your music file
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}