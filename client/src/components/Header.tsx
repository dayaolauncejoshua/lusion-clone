import { useState } from 'react'

export default function Header() {
  const [isTalkHovered, setIsTalkHovered] = useState(false)
  const [isMenuHovered, setIsMenuHovered] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-16 py-8 flex items-center justify-between">
      <div className="text-5xl font-medium tracking-tight text-black">LUSION</div>
      <div className="flex items-center gap-6">
        {/* LET'S TALK Button */}
        <button
          className="relative px-8 py-3.5 bg-black text-white rounded-full text-xl font-medium overflow-hidden transition-all duration-300 hover:bg-[#0044ff]"
          onMouseEnter={() => setIsTalkHovered(true)}
          onMouseLeave={() => setIsTalkHovered(false)}
        >
          <span className="relative flex items-center gap-2">
            {/* Arrow - slides in from left */}
            <span
              className={`absolute left-0 transition-all duration-300 ${
                isTalkHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              →
            </span>
            
            {/* Text - shifts right on hover */}
            <span
              className={`transition-all duration-300 ${
                isTalkHovered ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              LET'S TALK
            </span>
            
            {/* Dot - hides on hover */}
            <span
              className={`w-2 h-2 rounded-full bg-white transition-all duration-300 ${
                isTalkHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}
            />
          </span>
        </button>

        {/* MENU Button */}
        <button
          className="relative px-8 py-3.5 text-xl font-medium text-black bg-gray-200 rounded-full flex items-center gap-2"
          onMouseEnter={() => setIsMenuHovered(true)}
          onMouseLeave={() => setIsMenuHovered(false)}
        >
          <span>MENU</span>
          
          {/* Dots Container */}
          <span className="relative flex items-center justify-center w-4 h-4">
            {/* Horizontal Dots (default state) */}
            <span
              className={`absolute flex gap-1 transition-all duration-300 ${
                isMenuHovered ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
            </span>
            
            {/* Vertical Dots (hover state) */}
            <span
              className={`absolute flex flex-col gap-1 transition-all duration-300 ${
                isMenuHovered ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
            </span>
          </span>
        </button>
      </div>
    </header>
  )
}