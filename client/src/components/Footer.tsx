import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Footer() {
  const [nextPageProgress, setNextPageProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current || isTransitioning) return;

      const footer = footerRef.current;
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if footer is fully visible
      const isFooterFullyVisible =
        footerRect.top <= 0 && footerRect.bottom >= windowHeight;

      if (isFooterFullyVisible) {
        // MUCH LONGER scrollable distance - 8x window height for very long progress
        const scrollableDistance = windowHeight * 12;
        const footerTop = footer.offsetTop;
        const currentScroll = window.scrollY;

        // Start progress from 0 when footer JUST becomes fully visible
        // Calculate the scroll position when footer fills viewport
        const scrollWhenFooterFullyVisible =
          footerTop - windowHeight + footerRect.height;
        const scrolledSinceFullyVisible =
          currentScroll - scrollWhenFooterFullyVisible;

        // Calculate progress (0 to 1) - starts at 0 when footer becomes fully visible
        const progress = Math.min(
          Math.max(scrolledSinceFullyVisible / scrollableDistance, 0),
          1
        );
        setNextPageProgress(progress);

        // Navigate when progress reaches 99%
        if (progress >= 0.99 && !isTransitioning) {
          setIsTransitioning(true);

          // Smooth fade transition
          gsap.to(document.body, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              navigate("/about");
              window.scrollTo(0, 0);
              gsap.to(document.body, {
                opacity: 1,
                duration: 0.5,
              });
            },
          });
        }
      } else {
        setNextPageProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransitioning, navigate]);

  // Add extra scroll height when footer is visible
  useEffect(() => {
    const updateBodyHeight = () => {
      if (!footerRef.current) return;

      const footer = footerRef.current;
      const footerHeight = footer.offsetHeight;
      const footerTop = footer.offsetTop;
      const windowHeight = window.innerHeight;

      // Match the scrollable distance - 8x window height
      const additionalScrollHeight = windowHeight * 14;

      // Calculate when footer becomes fully visible
      const scrollWhenFooterFullyVisible =
        footerTop - windowHeight + footerHeight;

      document.body.style.minHeight = `${
        scrollWhenFooterFullyVisible + additionalScrollHeight
      }px`;
    };

    updateBodyHeight();
    window.addEventListener("resize", updateBodyHeight);

    return () => {
      window.removeEventListener("resize", updateBodyHeight);
      document.body.style.minHeight = "";
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="relative z-50 bg-white">
      {/* Top section - White background */}
      <div className="px-6 sm:px-8 md:px-12 lg:pl-16 lg:pr-20 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-6 bg-white">
        <div className="max-w-none">
          {/* Grid - Stacks on mobile, 2 cols on tablet, 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[320px_320px_600px] gap-12 sm:gap-16 md:gap-20 lg:gap-24">
            {/* Left - Address */}
            <div className="space-y-0.5">
              <p className="text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black font-normal">
                Suite 2
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black font-normal">
                9 Marsh Street
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black font-normal">
                Bristol, BS1 4AA
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black font-normal">
                United Kingdom
              </p>
            </div>

            {/* Middle - Social & Contacts */}
            <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
              {/* Social Links */}
              <div className="space-y-0.5">
                <a
                  href="#"
                  className="block text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal"
                >
                  Twitter / X
                </a>
                <a
                  href="#"
                  className="block text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="block text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal"
                >
                  Linkedin
                </a>
              </div>

              {/* General Enquiries */}
              <div className="space-y-0.5">
                <p className="text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black font-normal">
                  General enquiries
                </p>
                <a
                  href="mailto:hello@lusion.co"
                  className="block text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal break-all"
                >
                  hello@lusion.co
                </a>
              </div>

              {/* New Business */}
              <div className="space-y-0.5">
                <p className="text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black font-normal">
                  New business
                </p>
                <a
                  href="mailto:business@lusion.co"
                  className="block text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] text-black hover:opacity-60 transition-opacity font-normal break-all"
                >
                  business@lusion.co
                </a>
              </div>
            </div>

            {/* Right - Newsletter */}
            <div className="md:col-span-2 lg:col-span-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[68px] leading-[1.1] font-normal text-black mb-6 sm:mb-8 lg:mb-10">
                Subscribe to
                <br />
                our newsletter
              </h1>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-5 sm:px-6 lg:px-7 py-3 sm:py-4 lg:py-5 bg-[#e7e7ed] rounded-2xl sm:rounded-3xl text-base sm:text-lg md:text-xl lg:text-[22px] text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 font-normal"
                />
                <button className="absolute right-3 sm:right-4 lg:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:opacity-60 transition-opacity">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="sm:w-5 sm:h-5"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom white section - Copyright with scroll button */}
          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 text-sm sm:text-base md:text-lg lg:text-[20px] text-black font-normal">
            <p className="order-1">©2025 LUSION Creative Studio</p>
            <p className="order-3 sm:order-2">R&D: labs.lusion.co</p>
            <div className="flex items-center gap-3 sm:gap-4 order-2 sm:order-3">
              <div className="flex items-center gap-1 sm:pr-12 md:pr-16 lg:pr-24">
                <p>Built by Lusion with</p>
                <span className="text-red-500">❤️</span>
              </div>
              {/* Scroll to top button */}
              <button
                onClick={scrollToTop}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[70px] lg:h-[70px] bg-black border-[1.5px] border-black rounded-full flex items-center justify-center hover:bg-white hover:border-black transition-all group flex-shrink-0"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:stroke-black stroke-white transition-all"
                >
                  <path
                    d="M12 19V5M12 5L5 12M12 5L19 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - Black background with ABOUT US */}
      <div className="relative bg-black px-6 sm:px-8 md:px-12 lg:pl-16 lg:pr-20 pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-14 md:pb-16 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
        <div className="max-w-none">
          {/* Keep Scrolling text */}
          <div className="mb-10 sm:mb-12 md:mb-14 lg:mb-16">
            <p className="text-[10px] sm:text-xs md:text-sm lg:text-[20px] uppercase tracking-[0.05em] font-normal leading-[1.4] sm:leading-[1.2] lg:leading-[1.0] text-white">
              KEEP SCROLLING
              <br />
              TO LEARN MORE
            </p>
          </div>

          {/* About Us and Next Page - Stacks on mobile, row on larger screens */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-4 mb-12 sm:mb-16 md:mb-20 lg:mb-12">
            {/* About Us heading */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[75px] xl:text-[85px] font-normal leading-[0.9] tracking-tight text-white">
              ABOUT US
            </h2>

            {/* Next Page link with Progress Bar */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <span className="text-[10px] sm:text-xs md:text-sm lg:text-[20px] uppercase tracking-[0.10em] font-normal text-white whitespace-nowrap">
                NEXT PAGE
              </span>

              {/* Progress Bar Container */}
              <div className="relative w-20 sm:w-24 md:w-32 lg:w-40 h-[2px] lg:h-[2px] overflow-hidden">
                {/* Background line */}
                <div className="absolute inset-0 bg-[#545454]" />

                {/* Progress fill line */}
                <div
                  className="absolute top-0 left-0 h-full bg-white transition-all duration-200 ease-out"
                  style={{
                    width: `${nextPageProgress * 100}%`,
                    boxShadow:
                      nextPageProgress > 0.1
                        ? "0 0 8px rgba(255,255,255,0.6)"
                        : "none",
                  }}
                />
              </div>

              {/* Progress percentage */}
              <span
                className="text-[10px] sm:text-xs lg:text-sm text-white tabular-nums min-w-[2rem] text-right"
                style={{ opacity: nextPageProgress > 0 ? 1 : 0.5 }}
              >
                {Math.round(nextPageProgress * 100)}%
              </span>

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="sm:w-6 sm:h-6 lg:w-[30px] lg:h-[30px] flex-shrink-0"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Plus icons at bottom */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-light hover:opacity-60 transition-opacity w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center text-white mx-auto"
              >
                +
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
