import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    title: "Strategy",
    letter: "S",
    items: [
      "Experience Strategy",
      "Technology Strategy",
      "Creative Direction",
      "Discovery",
      "Research",
    ],
  },
  {
    title: "Creative",
    letter: "C",
    items: [
      "Art Direction",
      "UX/UI Design",
      "Motion Design",
      "Game Design",
      "Illustration",
    ],
  },
  {
    title: "Tech",
    letter: "T",
    items: [
      "WebGL Development",
      "Web Development",
      "Unity/Unreal",
      "Interactive Installations",
      "VR/AR",
    ],
  },
  {
    title: "Production",
    letter: "P",
    items: [
      "Procedural Modeling",
      "3D Asset Creation",
      "3D Asset Optimization",
      "Animation",
      "3D Pipeline",
    ],
  },
];

// Decorative card back component
function CardBackDesign({ letter }: { letter: string }) {
  return (
    <div className="relative w-full h-full">
      {/* Outer border frame */}
      <div className="absolute inset-4 border-2 border-white/40 rounded-xl" />

      {/* Corner decorations */}
      <svg
        className="absolute top-6 left-6 w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.2" />
      </svg>
      <svg
        className="absolute top-6 right-6 w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.2" />
      </svg>
      <svg
        className="absolute bottom-6 left-6 w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.2" />
      </svg>
      <svg
        className="absolute bottom-6 right-6 w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.2" />
      </svg>

      {/* Center geometric pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none">
          {/* Outer hexagon */}
          <path
            d="M100 20 L160 55 L160 125 L100 160 L40 125 L40 55 Z"
            stroke="white"
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Inner geometric lines */}
          <line
            x1="100"
            y1="20"
            x2="100"
            y2="160"
            stroke="white"
            strokeWidth="1"
            opacity="0.2"
          />
          <line
            x1="40"
            y1="55"
            x2="160"
            y2="125"
            stroke="white"
            strokeWidth="1"
            opacity="0.2"
          />
          <line
            x1="40"
            y1="125"
            x2="160"
            y2="55"
            stroke="white"
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Center circle with letter */}
          <circle cx="100" cy="90" r="45" fill="white" opacity="0.1" />
          <circle
            cx="100"
            cy="90"
            r="35"
            stroke="white"
            strokeWidth="2"
            opacity="0.4"
          />

          {/* Decorative dots */}
          <circle cx="100" cy="30" r="3" fill="white" opacity="0.5" />
          <circle cx="150" cy="65" r="3" fill="white" opacity="0.5" />
          <circle cx="150" cy="115" r="3" fill="white" opacity="0.5" />
          <circle cx="100" cy="150" r="3" fill="white" opacity="0.5" />
          <circle cx="50" cy="115" r="3" fill="white" opacity="0.5" />
          <circle cx="50" cy="65" r="3" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Large center letter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-[140px] text-white opacity-90"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          {letter}
        </div>
      </div>

      {/* Top decorative line pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 flex items-center justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-white/30"
            style={{ height: `${20 + i * 5}px` }}
          />
        ))}
      </div>

      {/* Bottom decorative line pattern */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 flex items-center justify-center gap-1 rotate-180">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-white/30"
            style={{ height: `${20 + i * 5}px` }}
          />
        ))}
      </div>

      {/* Side accent lines */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-32 w-16 flex flex-col items-center justify-center gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-1 bg-white/20"
            style={{ width: `${30 + i * 10}px` }}
          />
        ))}
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-32 w-16 flex flex-col items-center justify-center gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-1 bg-white/20"
            style={{ width: `${30 + i * 10}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CapabilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current;
    const title = titleRef.current;
    if (!section || cards.length === 0) return;

    // Add floating animation to each card
    cards.forEach((card, index) => {
      if (!card) return;

      // Continuous floating animation
      gsap.to(card, {
        y: "+=15",
        duration: 2 + index * 0.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
      });

      // Slight rotation wobble
      gsap.to(card, {
        rotation: "+=2",
        duration: 3 + index * 0.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.3,
      });
    });

    // Pin section and create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "center center",
        end: "+=3000",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Background color transition: black → blue
    tl.to(
      section,
      {
        backgroundColor: "#1a2ffb",
        duration: 0.3,
        ease: "none",
      },
      0
    );

    // Fade out title as cards scatter
    if (title) {
      tl.to(
        title,
        {
          opacity: 0,
          y: -50,
          duration: 0.2,
          ease: "power2.in",
        },
        0.1
      );
    }

    // Stage 1: Scatter cards (0 - 0.4)
    cards.forEach((card, index) => {
      const offsetX = (index - 1.5) * 450; // Increased spacing even more

      tl.to(
        card,
        {
          x: offsetX,
          rotation: 0, // Reset to straight at end
          duration: 0.4,
          ease: "power2.inOut",
        },
        0.1 + index * 0.03
      );
    });

    // Stage 2: Flip cards (0.4 - 1.0)
    cards.forEach((card, index) => {
      tl.to(
        card,
        {
          rotateY: 180,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.5 + index * 0.06
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(cards);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-36 overflow-hidden"
      style={{ backgroundColor: "#000" }}
    >
      {/* Decorative wave at top */}
      <svg
        className="absolute top-0 left-0 w-full h-32 opacity-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 50 Q 360 0, 720 50 T 1440 50 V 0 H 0 Z" fill="#f0f1fa" />
      </svg>

      <div className="max-w-[1920px] mx-auto px-8 sm:px-12 md:px-16 lg:px-20">
        {/* Header */}
        <div ref={titleRef} className="mb-20">
          <h2 className="text-[15vw] sm:text-[12vw] md:text-[10vw] font-light leading-none tracking-tight text-white mb-8">
            AREA OF
            <br />
            EXPERTISE
          </h2>

          <div className="flex items-start justify-between">
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-lg">
              A team of experienced professionals with a wide
              <br />
              range of skills and knowledge
            </p>

            {/* Letter badges */}
            <div className="flex gap-3">
              {["S", "C", "T", "P"].map((letter) => (
                <div
                  key={letter}
                  className="w-12 h-12 border-2 border-white/30 rounded flex items-center justify-center text-white font-bold text-xl"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards container - Closer to camera */}
        <div
          className="relative flex items-center justify-center h-[750px]"
          style={{ perspective: "900px" }} // Reduced perspective = cards appear closer
        >
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              ref={(el) => {cardRefs.current[index] = el}}
              className="absolute w-[400px] h-[560px]" // Increased size
              style={{
                transformStyle: "preserve-3d",
                zIndex: capabilities.length - index, // Stack order
              }}
            >
              {/* Card back (decorative design) */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-white/50 shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  backgroundColor: "#1a2ffb",
                  transform: "rotateY(0deg)",
                }}
              >
                <CardBackDesign letter={capability.letter} />
              </div>

              {/* Card front (white with content) - UNCHANGED */}
              <div
                className="absolute inset-0 bg-white rounded-2xl px-10 py-14 flex flex-col justify-between shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {/* Top header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-light text-black uppercase tracking-wide">
                    {capability.title}
                  </h3>
                  <div
                    className="text-5xl text-black"
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {capability.letter}
                  </div>
                </div>

                {/* Items list */}
                <ul className="space-y-3 flex-1 flex flex-col justify-center">
                  {capability.items.map((item) => (
                    <li
                      key={item}
                      className="text-xl text-black font-thin tracking-normal border-b-4 border-dotted border-gray-300 pb-5"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Bottom header (mirrored) */}
                <div className="flex items-center justify-between">
                  <div
                    className="text-5xl text-black"
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {capability.letter}
                  </div>
                  <h3 className="text-3xl font-light text-black uppercase tracking-wide transform rotate-180">
                    {capability.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
