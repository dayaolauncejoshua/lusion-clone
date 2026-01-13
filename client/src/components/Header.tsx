import { useState } from 'react';
import Menu from './Menu';
import { useAudio } from '../contexts/AudioContext';

interface HeaderProps {
  darkMode?: boolean;
}

export default function Header({ darkMode = false }: HeaderProps) {
  const [isTalkHovered, setIsTalkHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isPlaying, toggleAudio } = useAudio();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-8 lg:px-12 xl:px-16 py-3 sm:py-4 md:py-6 lg:py-8 flex items-center justify-between">
        {/* Logo */}
        <div
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium tracking-tight ${
            darkMode ? 'text-white' : 'text-black'
          }`}
        >
          LUSION
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* MUSIC Button - Hidden on mobile, visible from md */}
          <button
            onClick={toggleAudio}
            className={`hidden md:flex relative w-10 h-10 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all duration-300 ${
              darkMode
                ? 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Toggle music"
          >
            {!isPlaying ? (
              <div
                className={`w-4 md:w-5 h-0.5 ${
                  darkMode ? 'bg-white' : 'bg-black'
                }`}
              />
            ) : (
              <div className="flex items-center justify-center gap-0.5 h-4 md:h-5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 rounded-full ${
                      darkMode ? 'bg-white' : 'bg-black'
                    }`}
                    style={{
                      height: '100%',
                      animation: `soundwave 0.6s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </button>

          {/* LET'S TALK Button - Hidden on mobile, visible from md */}
          <button
            className={`hidden md:flex relative px-4 lg:px-6 xl:px-8 py-2.5 lg:py-3 xl:py-3.5 rounded-full text-sm lg:text-base xl:text-xl font-medium overflow-hidden transition-all duration-300 items-center ${
              darkMode
                ? 'bg-white text-black hover:bg-[#0044ff] hover:text-white'
                : 'bg-black text-white hover:bg-[#0044ff]'
            }`}
            onMouseEnter={() => setIsTalkHovered(true)}
            onMouseLeave={() => setIsTalkHovered(false)}
          >
            <span className="relative flex items-center gap-2">
              <span
                className={`absolute left-0 transition-all duration-300 ${
                  isTalkHovered
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-3'
                }`}
              >
                →
              </span>

              <span
                className={`transition-all duration-300 ${
                  isTalkHovered
                    ? 'translate-x-4 lg:translate-x-5'
                    : 'translate-x-0'
                }`}
              >
                LET'S TALK
              </span>

              <span
                className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-black' : 'bg-white'
                } ${
                  isTalkHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
            </span>
          </button>

          {/* MENU Button - Shows 3 vertical dots on mobile, text on desktop */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`relative px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-2.5 lg:py-3 xl:py-3.5 text-xs sm:text-sm lg:text-base xl:text-xl font-medium rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
              darkMode
                ? 'text-white bg-white/10 backdrop-blur-sm hover:bg-white/20'
                : 'text-black bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {/* Show 3 vertical dots on mobile */}
            <span className="md:hidden flex flex-col items-center gap-1">
              <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`} />
              <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`} />
              <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`} />
            </span>

            {/* Show MENU text on desktop */}
            <span className="hidden md:inline whitespace-nowrap">
              {isMenuOpen ? 'CLOSE' : 'MENU'}
            </span>

            {/* Dots on desktop */}
            <span className="hidden md:flex relative items-center justify-center w-3 md:w-4 h-3 md:h-4 group">
              <span className="absolute flex gap-0.5 transition-all duration-300 group-hover:flex-col group-hover:gap-0.5">
                <span
                  className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full transition-all duration-300 ${
                    darkMode ? 'bg-white' : 'bg-black'
                  }`}
                />
                <span
                  className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full transition-all duration-300 ${
                    darkMode ? 'bg-white' : 'bg-black'
                  }`}
                />
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* Menu Dropdown/Full-screen */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Soundwave animation styles */}
      <style>{`
        @keyframes soundwave {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>
    </>
  );
}