import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Footer from "./Footer";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: "circle" | "cross" | "dot";
  rotation: number;
  settled: boolean;
  settledX?: number;
  settledY?: number;
}

interface CTASectionProps {
  onFooterChange?: (showFooter: boolean) => void;
}

export default function CTASection({ onFooterChange }: CTASectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [footerProgress, setFooterProgress] = useState(0);
  const letsWorkRef = useRef<HTMLDivElement>(null);
  const togetherRef = useRef<HTMLDivElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);
  const leftArrowRef = useRef<SVGSVGElement>(null);
  const rightArrowRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Notify parent when footer state changes
  useEffect(() => {
    if (onFooterChange) {
      onFooterChange(showFooter);
    }
  }, [showFooter, onFooterChange]);

  // Update the wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if CTA section is in viewport and user is scrolled to it
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInViewport = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
        
        // Only handle footer if we're at the CTA section
        if (!isInViewport && !showFooter) {
          return; // Don't handle scroll if not at CTA section
        }
      }

      // If footer is fully visible, allow normal scrolling within footer
      if (showFooter && footerProgress === 1) {
        const footerElement = document.querySelector("footer");
        if (footerElement && e.deltaY < 0) {
          const isAtTop = footerElement.scrollTop === 0 || window.scrollY === 0;

          if (isAtTop) {
            e.preventDefault();
            gsap.to({}, {
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: function () {
                setFooterProgress(1 - this.progress());
              },
              onComplete: () => {
                setShowFooter(false);
                setFooterProgress(0);
              },
            });
          }
        }
        return;
      }

      // Prevent default for footer animation
      if (showFooter && footerProgress < 1 && footerProgress > 0) {
        e.preventDefault();
        return;
      }

      // SCROLL DOWN - Show footer (only if at CTA section)
      if (e.deltaY > 0 && !showFooter) {
        e.preventDefault();
        setShowFooter(true);

        gsap.to({}, {
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function () {
            setFooterProgress(this.progress());
          },
        });
      }
      // SCROLL UP - Hide footer (if animating)
      else if (e.deltaY < 0 && showFooter && footerProgress < 1 && footerProgress > 0) {
        e.preventDefault();
        gsap.to({}, {
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function () {
            setFooterProgress(1 - this.progress());
          },
          onComplete: () => {
            setShowFooter(false);
            setFooterProgress(0);
          },
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [showFooter, footerProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const particleCount = 1500;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * 1500 - 100,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2,
        size: Math.random() * 4 + 3,
        type:
          Math.random() > 0.7
            ? "cross"
            : Math.random() > 0.4
            ? "circle"
            : "dot",
        rotation: Math.random() * Math.PI * 2,
        settled: false,
      });
    }

    particlesRef.current = particles;

    const GRAVITY = 0.15;
    const DAMPING = 0.92;
    const MIN_DISTANCE = 30;
    const MOUSE_FORCE = 500;
    const MOUSE_RADIUS = 280;
    const PILE_HEIGHT = canvas.height * (2 / 3);

    let time = 0;

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.03;

      particles.forEach((particle, i) => {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_RADIUS && distance > 0) {
          const force =
            ((MOUSE_RADIUS - distance) / MOUSE_RADIUS) * MOUSE_FORCE;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.2;
          particle.vy -= Math.sin(angle) * force * 0.2;
        }

        particle.vy += GRAVITY;
        particle.vx *= DAMPING;
        particle.vy *= DAMPING;

        if (particle.y > PILE_HEIGHT) {
          const waveForceX = Math.sin(time + particle.y * 0.01) * 0.5;
          const waveForceY = Math.cos(time * 0.7 + particle.x * 0.01) * 0.3;
          particle.vx += waveForceX;
          particle.vy += waveForceY;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = particle.size + other.size + MIN_DISTANCE;

          if (dist < minDist && dist > 0) {
            const angle = Math.atan2(dy, dx);
            const overlap = minDist - dist;
            const pushForce = overlap * 0.2;
            const moveX = Math.cos(angle) * pushForce;
            const moveY = Math.sin(angle) * pushForce;

            particle.x -= moveX;
            particle.y -= moveY;
            other.x += moveX;
            other.y += moveY;

            particle.vx -= moveX * 0.05;
            particle.vy -= moveY * 0.05;
            other.vx += moveX * 0.05;
            other.vy += moveY * 0.05;
          }
        }

        if (particle.y + particle.size > canvas.height) {
          particle.y = canvas.height - particle.size;
          particle.vy *= -0.1;
          particle.vx *= 0.9;
        }

        if (particle.x - particle.size < 0) {
          particle.x = particle.size;
          particle.vx *= -0.2;
        }
        if (particle.x + particle.size > canvas.width) {
          particle.x = canvas.width - particle.size;
          particle.vx *= -0.2;
        }

        if (particle.type === "cross") {
          particle.rotation += 0.01;
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 2;

        if (particle.type === "circle") {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === "dot") {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          const size = particle.size * 1.8;
          ctx.beginPath();
          ctx.moveTo(-size, 0);
          ctx.lineTo(size, 0);
          ctx.moveTo(0, -size);
          ctx.lineTo(0, size);
          ctx.stroke();
          ctx.restore();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Button content flip animation
  useEffect(() => {
    const animateButtonContent = () => {
      const elements = [
        leftArrowRef.current,
        buttonTextRef.current,
        rightArrowRef.current,
      ].filter(Boolean);

      elements.forEach((element) => {
        const tl = gsap.timeline();

        tl.to(element, {
          rotateX: 90,
          scaleY: 0.8,
          y: -10,
          opacity: 0.3,
          duration: 0.15,
          ease: "power1.in",
        });

        tl.fromTo(
          element,
          {
            rotateX: -90,
            scaleY: 0.8,
            y: 10,
            opacity: 0.3,
          },
          {
            rotateX: 0,
            scaleY: 1,
            y: 0,
            opacity: 1,
            duration: 0.15,
            ease: "power1.out",
          }
        );
      });
    };

    const intervalId = setInterval(() => {
      animateButtonContent();
    }, 4500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Random letter animation
  useEffect(() => {
    const animateRandomLetter = () => {
      const letsWorkLetters = letsWorkRef.current?.querySelectorAll(".letter");
      const togetherLetters = togetherRef.current?.querySelectorAll(".letter");

      if (letsWorkLetters && togetherLetters) {
        const allLetters = [
          ...Array.from(letsWorkLetters),
          ...Array.from(togetherLetters),
        ];

        const numLetters = Math.floor(Math.random() * 3) + 1;
        const shuffled = allLetters.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, numLetters);

        selected.forEach((letter) => {
          const tl = gsap.timeline();

          tl.to(letter, {
            rotateX: 90,
            scaleY: 0.8,
            y: -10,
            opacity: 0.3,
            duration: 0.15,
            ease: "power1.in",
          });

          tl.fromTo(
            letter,
            {
              rotateX: -90,
              scaleY: 0.8,
              y: 10,
              opacity: 0.3,
            },
            {
              rotateX: 0,
              scaleY: 1,
              y: 0,
              opacity: 1,
              duration: 0.15,
              ease: "power1.out",
            }
          );
        });
      }
    };

    const intervalId = setInterval(() => {
      animateRandomLetter();
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <section ref={sectionRef} className="relative min-h-screen bg-[#1a2ffb] overflow-hidden flex flex-col items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        <div
          className="relative z-10 flex flex-col items-center justify-center"
          style={{ width: "1400px", height: "700px" }}
        >
          <div className="absolute top-0 left-0 text-white text-5xl font-thin">
            +
          </div>
          <div className="absolute top-0 right-0 text-white text-5xl font-light">
            +
          </div>
          <div className="absolute bottom-0 left-0 text-white text-5xl font-light">
            +
          </div>
          <div className="absolute bottom-0 right-0 text-white text-5xl font-light">
            +
          </div>

          <div className="absolute top-0 text-white text-md tracking-[0.1em] uppercase font-medium mt-3 justify-center">
            IS YOUR BIG IDEA READY TO GO WILD?
          </div>

          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="px-8">
              <h2
                className="text-[10rem] font-light text-white text-center leading-[1.1] tracking-tight cursor-pointer group"
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
                onMouseEnter={() => setIsTextHovered(true)}
                onMouseLeave={() => setIsTextHovered(false)}
              >
                <div
                  ref={letsWorkRef}
                  className="inline-block relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {"Let's work ".split("").map((char, index) => (
                    <span
                      key={index}
                      className="letter inline-block transition-transform duration-200"
                      style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        transform:
                          hoveredChar === index
                            ? "translateY(-15px)"
                            : "translateY(0)",
                      }}
                      onMouseEnter={() => setHoveredChar(index)}
                      onMouseLeave={() => setHoveredChar(null)}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left transition-transform duration-300"
                    style={{
                      transform: isTextHovered ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </div>
                <br />
                <div
                  ref={togetherRef}
                  className="inline-block relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {"together!".split("").map((char, index) => {
                    const charIndex = index + 12;
                    return (
                      <span
                        key={charIndex}
                        className="letter inline-block transition-transform duration-200"
                        style={{
                          transformStyle: "preserve-3d",
                          backfaceVisibility: "hidden",
                          transform:
                            hoveredChar === charIndex
                              ? "translateY(-15px)"
                              : "translateY(0)",
                        }}
                        onMouseEnter={() => setHoveredChar(charIndex)}
                        onMouseLeave={() => setHoveredChar(null)}
                      >
                        {char}
                      </span>
                    );
                  })}
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left transition-transform duration-300"
                    style={{
                      transform: isTextHovered ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </div>
              </h2>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="absolute bottom-12 z-10 px-10 py-4 bg-white text-black rounded-full font-medium text-xs tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors duration-300 flex items-center gap-4 group"
          style={{ perspective: "2000px" }}
        >
          <svg
            ref={leftArrowRef}
            className="w-3 h-3 group-hover:translate-y-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <span
            ref={buttonTextRef}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              display: "inline-block",
            }}
          >
            CONTINUE TO SCROLL
          </span>
          <svg
            ref={rightArrowRef}
            className="w-3 h-3 group-hover:translate-y-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </section>

      {/* Footer slides up from bottom */}
      {showFooter && (
        <div
          className="fixed inset-0 z-[150]"
          style={{
            transform: `translateY(${100 - footerProgress * 100}%)`,
            transition: footerProgress === 0 ? "none" : undefined,
          }}
        >
          <Footer />
        </div>
      )}
    </>
  );
}