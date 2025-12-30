import { useState } from 'react'

export default function AboutUsButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-8 py-4 rounded-full text-lg font-medium overflow-hidden transition-all duration-300 shadow-lg border ${
        isHovered ? 'bg-[#0044ff] border-[#0044ff]' : 'bg-white border-gray-200'
      }`}
    >
      <div className="relative flex items-center justify-center text-white">
        {/* Dot - fades out when hovered */}
        <span
          className={`absolute left-0 transition-all duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ fontSize: '0.75rem' }}
        >
          •
        </span>

        {/* Text - slides left when hovered */}
        <span
          className={`transition-all duration-300 ease-out ${
            isHovered ? '-translate-x-3' : 'translate-x-0'
          } ${isHovered ? 'text-white' : 'text-black'}`}
        >
          ABOUT US
        </span>

        {/* Arrow - slides in from right when hovered */}
        <span
          className={`absolute right-0 transition-all duration-300 ease-out ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          style={{ fontSize: '1.25rem' }}
        >
          →
        </span>
      </div>
    </button>
  )
}