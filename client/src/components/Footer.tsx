export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative z-50 bg-white">
      {/* Top section - White background */}
      <div className="pl-16 pr-20 pt-32 pb-6 bg-white">
        <div className="max-w-none">
          <div className="grid grid-cols-[320px_320px_600px] gap-24">
            {/* Left - Address - Aligned with LUSION logo */}
            <div className="space-y-0.5">
              <p className="text-[22px] leading-[1.6] text-black font-normal">Suite 2</p>
              <p className="text-[22px] leading-[1.6] text-black font-normal">9 Marsh Street</p>
              <p className="text-[22px] leading-[1.6] text-black font-normal">Bristol, BS1 4AA</p>
              <p className="text-[22px] leading-[1.6] text-black font-normal">United Kingdom</p>
            </div>

            {/* Middle - Social & Contacts */}
            <div className="space-y-16">
              {/* Social Links */}
              <div className="space-y-0.5">
                <a href="#" className="block text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal">
                  Twitter / X
                </a>
                <a href="#" className="block text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal">
                  Instagram
                </a>
                <a href="#" className="block text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal">
                  Linkedin
                </a>
              </div>

              {/* General Enquiries */}
              <div className="space-y-0.5">
                <p className="text-[22px] leading-[1.6] text-black font-normal">General enquiries</p>
                <a href="mailto:hello@lusion.co" className="text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal">
                  hello@lusion.co
                </a>
              </div>

              {/* New Business */}
              <div className="space-y-0.5">
                <p className="text-[22px] leading-[1.6] text-black font-normal">New business</p>
                <a href="mailto:business@lusion.co" className="text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal">
                  business@lusion.co
                </a>
              </div>
            </div>

            {/* Right - Newsletter */}
            <div>
              <h1 className="text-[68px] leading-[1.1] font-normal text-black mb-10">
                Subscribe to<br />our newsletter
              </h1>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-7 py-5 bg-[#e7e7ed] rounded-3xl text-[22px] text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 font-normal"
                />
                <button className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center hover:opacity-60 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom white section - Copyright with scroll button */}
          <div className="mt-24 flex items-center justify-between text-[20px] text-black font-normal">
            <p>©2025 LUSION Creative Studio</p>
            <p>R&D: labs.lusion.co</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 pr-24">
                <p>Built by Lusion with</p>
                <span className="text-red-500">❤️</span>
              </div>
              {/* Scroll to top button - in white section */}
              <button
                onClick={scrollToTop}
                className="w-[70px] h-[70px] bg-black border-[1.5px] border-black rounded-full flex items-center justify-center hover:bg-white hover:border-black transition-all group"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="group-hover:stroke-black stroke-white transition-all">
                  <path d="M12 19V5M12 5L5 12M12 5L19 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - Black background with ABOUT US */}
      <div className="relative bg-black pl-16 pr-20 pt-12 pb-16 min-h-[700px]">
        <div className="max-w-none">
          {/* Keep Scrolling text */}
          <div className="mb-16">
            <p className="text-white text-[20px] uppercase tracking-[0.05em] font-normal leading-[1.0]">
              KEEP SCROLLING<br />TO LEARN MORE
            </p>
          </div>

          {/* About Us and Next Page - Same row */}
          <div className="flex items-center justify-between mb-12">
            {/* About Us heading */}
            <h2 className="text-white text-[75px] font-normal leading-[0.9] tracking-tight">
              ABOUT US
            </h2>

            {/* Next Page link - aligned with ABOUT US */}
            <div className="flex items-center gap-4">
              <span className="text-white text-[20px] uppercase tracking-[0.10em] font-normal">NEXT PAGE</span>
              <div className="w-40 h-[1.5px] bg-[#545454]"></div>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="-ml-1">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Plus icons at bottom - below ABOUT US */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <button 
                key={i} 
                className="text-white text-[40px] font-light hover:opacity-60 transition-opacity w-16 h-16 flex items-center justify-center"
              >
                +
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}