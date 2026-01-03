import { useState } from 'react'
import Menu from './Menu'

interface HeaderProps {
  darkMode?: boolean
}

export default function Header({ darkMode = false }: HeaderProps) {
  const [isTalkHovered, setIsTalkHovered] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 flex items-center justify-between">
        <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
          LUSION
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* LET'S TALK Button */}
          <button
            className={`relative px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-full text-xs sm:text-sm md:text-base lg:text-xl font-medium overflow-hidden transition-all duration-300 ${
              darkMode 
                ? 'bg-white text-black hover:bg-[#0044ff] hover:text-white' 
                : 'bg-black text-white hover:bg-[#0044ff]'
            }`}
            onMouseEnter={() => setIsTalkHovered(true)}
            onMouseLeave={() => setIsTalkHovered(false)}
          >
            <span className="relative flex items-center gap-1 sm:gap-2">
              <span
                className={`absolute left-0 transition-all duration-300 ${
                  isTalkHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                →
              </span>
              
              <span
                className={`transition-all duration-300 ${
                  isTalkHovered ? 'translate-x-3 sm:translate-x-4 lg:translate-x-5' : 'translate-x-0'
                }`}
              >
                LET'S TALK
              </span>
              
              <span
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-black' : 'bg-white'
                } ${
                  isTalkHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
            </span>
          </button>

          {/* MENU Button - Now toggles open/close */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`relative px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3.5 text-xs sm:text-sm md:text-base lg:text-xl font-medium rounded-full flex items-center gap-1 sm:gap-2 transition-all duration-300 ${
              darkMode 
                ? 'text-white bg-white/10 backdrop-blur-sm hover:bg-white/20' 
                : 'text-black bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <span>{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
            <span className="flex gap-0.5 sm:gap-1">
              <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`} />
              <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Menu Dropdown */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}