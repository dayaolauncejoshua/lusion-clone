import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ReelSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playTextRef = useRef<HTMLDivElement>(null);
  const playLettersRef = useRef<HTMLDivElement>(null);
  const reelLettersRef = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);
  const reelVideoRef = useRef<HTMLVideoElement>(null)

    const [isPlayButtonHovered, setIsPlayButtonHovered] = useState(false)

  // Array of video sources - fun, playful videos with people
  const reelVideos = [
    'https://www.pexels.com/download/video/19836663/', // People celebrating/dancing
    'https://www.pexels.com/download/video/35087112/', // Business people meeting/talking
    'https://www.pexels.com/download/video/35131909/', // Team working together
    'https://www.pexels.com/download/video/3188958/', // People in office/creative space
    'https://www.pexels.com/download/video/10254613/', // Group collaboration/meeting
  ]

   const [currentReelVideoIndex, setCurrentReelVideoIndex] = useState(0)
  const [reelVideoOpacity, setReelVideoOpacity] = useState(1)

  const handleReelVideoEnd = () => {
    // Fade out
    setReelVideoOpacity(0)
    
    // After fade out, change video
    setTimeout(() => {
      setCurrentReelVideoIndex((prevIndex) => (prevIndex + 1) % reelVideos.length)
      // Fade in new video
      setTimeout(() => {
        setReelVideoOpacity(1)
      }, 50)
    }, 500)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 1.5,
          onEnter: () => {
            const blueBox = document.getElementById("morphing-video-box");
            if (blueBox) {
              gsap.set(videoContainerRef.current, {
                opacity: 0,
              });
            }
          },
        },
      });

      // Decorative blue shapes morph in
      tl.from(
        [shape1Ref.current, shape2Ref.current, shape3Ref.current],
        {
          scale: 0,
          opacity: 0,
          rotation: -45,
          stagger: 0.1,
          ease: "elastic.out(1, 0.5)",
        },
        0
      );

      // Video container expands
      tl.fromTo(
        videoContainerRef.current,
        {
          width: "45%",
          height: "450px",
          borderRadius: "2.5rem",
          x: "-80%",
          y: "20%",
          opacity: 0,
        },
        {
          width: "100%",
          height: "100%",
          borderRadius: "2rem",
          x: "0%",
          y: "0%",
          opacity: 1,
          ease: "power3.inOut",
        },
        0.2
      );

      // PLAY REEL text container fades in
      tl.from(
        playTextRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        0.6
      );

      // Initial NBA-style animation for PLAY letters
      const playLetters = playLettersRef.current?.querySelectorAll(".letter");
      if (playLetters) {
        tl.fromTo(
          playLetters,
          {
            rotateX: -90,
            opacity: 0,
            y: -50,
          },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          0.7
        );
      }

      // Initial NBA-style animation for REEL letters
      const reelLetters = reelLettersRef.current?.querySelectorAll(".letter");
      if (reelLetters) {
        tl.fromTo(
          reelLetters,
          {
            rotateX: -90,
            opacity: 0,
            y: -50,
          },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          0.7
        );
      }
    }, sectionRef);

    // Continuous random letter flip animation
    const animateRandomLetter = () => {
      const playLetters = playLettersRef.current?.querySelectorAll(".letter");
      const reelLetters = reelLettersRef.current?.querySelectorAll(".letter");

      if (playLetters && reelLetters) {
        const allLetters = [
          ...Array.from(playLetters),
          ...Array.from(reelLetters),
        ];

        const numLetters = Math.floor(Math.random() * 2) + 1;
        const shuffled = allLetters.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, numLetters);

        selected.forEach((letter) => {
          gsap.fromTo(
            letter,
            {
              rotateX: -90,
              y: -20,
            },
            {
              rotateX: 0,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
            }
          );
        });
      }
    };

    const intervalId = setInterval(() => {
      animateRandomLetter();
    }, 3800);

    return () => {
      ctx.revert();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#f5f5f5] flex justify-center py-20 px-16"
    >
      <style>
        {`
          @keyframes marquee-left {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          @keyframes marquee-right {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }
          
          .marquee-left {
            animation: marquee-left 20s linear infinite;
          }
          
          .marquee-right {
            animation: marquee-right 20s linear infinite;
          }
        `}
      </style>

      {/* Decorative Blue Organic Shapes */}
      <div
        ref={shape1Ref}
        className="absolute top-10 left-20 w-[600px] h-[300px] bg-[#0044ff] opacity-20 rounded-full blur-3xl"
        style={{ transform: "rotate(-25deg)" }}
      />
      <div
        ref={shape2Ref}
        className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#0044ff] opacity-15 rounded-full blur-3xl"
        style={{ transform: "rotate(15deg)" }}
      />
      <div
        ref={shape3Ref}
        className="absolute -bottom-20 left-1/4 w-[800px] h-[400px] bg-[#0044ff] opacity-25"
        style={{
          clipPath: "ellipse(50% 100% at 50% 100%)",
          filter: "blur(60px)",
        }}
      />

      {/* Container wrapper */}
      <div className="relative w-full max-w-[1600px] ">
        {/* Top row - Plus icons (default state) */}
        <div
          className="absolute -top-10 left-0 text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -top-10 left-[25%] text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -top-10 left-[50%] -translate-x-1/2 text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -top-10 right-[25%] text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -top-10 right-0 text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>

        {/* Marquee - Top row (scrolls LEFT) */}
        <div 
          className="absolute -top-10 left-0 right-0 overflow-hidden transition-opacity duration-300 whitespace-nowrap"
          style={{ opacity: isPlayButtonHovered ? 1 : 0 }}
        >
          <div className="marquee-left inline-flex">
            <div className="flex items-center gap-60">
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
            </div>
            {/* Duplicate for seamless loop
            <div className="flex items-center gap-32">
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
            </div> */}
          </div>
        </div>

        {/* Video Container */}
        <div
          ref={videoContainerRef}
          className="relative overflow-hidden shadow-2xl"
          style={{
            width: "100%",
            height: "75vh",
            maxHeight: "800px",
            borderRadius: "2rem",
            background: "linear-gradient(135deg, #5B8DEF 0%, #0F6FFF 100%)",
          }}
        >
          {/* Video */}
           <video
            ref={reelVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ 
              opacity: reelVideoOpacity,
              transition: 'opacity 0.5s ease-in-out'
            }}
            onEnded={handleReelVideoEnd}
            key={currentReelVideoIndex}
          >
            <source
              src={reelVideos[currentReelVideoIndex]}
              type="video/mp4"
            />
          </video>

          {/* Blue overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "rgba(0, 68, 255, 0.3)",
              mixBlendMode: "multiply",
            }}
          />

          {/* PLAY REEL Overlay */}
          <div
            ref={playTextRef}
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ perspective: "1000px" }}
          >
            <div className="flex items-center justify-center gap-12">
              {/* PLAY Text */}
              <h2
                ref={playLettersRef}
                className="text-white text-[10rem] font-bold tracking-[0.02em] leading-none flex"
                style={{
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  P
                </span>
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  L
                </span>
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  A
                </span>
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  Y
                </span>
              </h2>

              {/* Play Button */}
              <button
                className="group w-28 h-28 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-2xl"
                style={{
                  backgroundColor: isPlayButtonHovered ? "#0044ff" : "white",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={() => setIsPlayButtonHovered(true)}
                onMouseLeave={() => setIsPlayButtonHovered(false)}
              >
                <svg
                  className="w-12 h-12 ml-1 transition-colors duration-300"
                  style={{
                    color: isPlayButtonHovered ? "white" : "black",
                  }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              {/* REEL Text */}
              <h2
                ref={reelLettersRef}
                className="text-white text-[10rem] font-bold tracking-[0.02em] leading-none flex"
                style={{
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  R
                </span>
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  E
                </span>
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  E
                </span>
                <span
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  L
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Bottom row - Plus icons (default state) */}
        <div
          className="absolute -bottom-22 left-0 text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -bottom-22 left-[25%] text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -bottom-22 left-[50%] -translate-x-1/2 text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -bottom-22 right-[25%] text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>
        <div
          className="absolute -bottom-22 right-0 text-2xl font-medium text-black transition-opacity duration-300"
          style={{ opacity: isPlayButtonHovered ? 0 : 1 }}
        >
          +
        </div>

        {/* Marquee - Bottom row (scrolls RIGHT) */}
        <div 
          className="absolute -bottom-22 left-0 right-0 overflow-hidden transition-opacity duration-300 whitespace-nowrap"
          style={{ opacity: isPlayButtonHovered ? 1 : 0 }}
        >
          <div className="marquee-right inline-flex">
            <div className="flex items-center gap-60">
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
            </div>
            {/* Duplicate for seamless loop */}
            {/* <div className="flex items-center gap-32">
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
              <span className="flex items-center gap-3 text-xl font-medium text-black">
                <span className="text-2xl">▶▶▶</span>
                <span className="tracking-wider">PLAY REEL</span>
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
