import { useEffect, useRef, useState } from "react";
import Astronaut3D from "../components/Astronaut3D";
import type { Astronaut3DRef } from "../components/Astronaut3D";
import Header from "../components/Header";
import Footer from "../components/Footer";
import gsap from "gsap";

export default function AstronautFullscreen() {
  const [stage, setStage] = useState(0);
  const [tunnelProgress, setTunnelProgress] = useState(0);
  const [showFinalUI, setShowFinalUI] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [footerProgress, setFooterProgress] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const letsLettersRef = useRef<HTMLDivElement>(null);
  const workLettersRef = useRef<HTMLDivElement>(null);
  const togetherLettersRef = useRef<HTMLDivElement>(null);
  const buttonLettersRef = useRef<HTMLButtonElement>(null);
  const astronautRef = useRef<Astronaut3DRef>(null);
  const scrollCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === 1 && textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
  }, [stage]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If footer is fully visible, allow normal scrolling within footer
      if (stage === 3 && showFooter && footerProgress === 1) {
        // Check if user is scrolling up at the top of the footer
        const footerElement = document.querySelector("footer");
        if (footerElement && e.deltaY < 0) {
          const isAtTop = footerElement.scrollTop === 0 || window.scrollY === 0;

          if (isAtTop) {
            // User is at top of footer and scrolling up - slide footer down
            e.preventDefault();
            gsap.to(
              {},
              {
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: function () {
                  setFooterProgress(1 - this.progress());
                },
                onComplete: () => {
                  setShowFooter(false);
                  setFooterProgress(0);
                },
              }
            );
          }
        }
        return; // Allow normal scroll otherwise
      }

      // Prevent default for all other scroll behaviors
      e.preventDefault();

      // SCROLL DOWN
      if (e.deltaY > 0) {
        scrollCountRef.current++;

        if (scrollCountRef.current === 1 && stage === 0) {
          setStage(1);
        } else if (scrollCountRef.current >= 2 && stage === 1) {
          setStage(2);

          if (textRef.current) {
            gsap.to(textRef.current, {
              scale: 3,
              opacity: 0,
              z: 300,
              duration: 2.5,
              ease: "power2.in",
            });
          }

          gsap.to(
            {},
            {
              duration: 10,
              ease: "power1.inOut",
              onUpdate: function () {
                const progress = this.progress();
                setTunnelProgress(progress);

                if (astronautRef.current) {
                  astronautRef.current.animateForward(progress);
                }
              },
              onComplete: () => {
                setStage(3);
                setTunnelProgress(0);
                setShowFinalUI(true);
              },
            }
          );
        } else if (stage === 3 && showFinalUI && !showFooter) {
          setShowFooter(true);

          gsap.to(
            {},
            {
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: function () {
                setFooterProgress(this.progress());
              },
            }
          );
        }
      }
      // SCROLL UP
      else if (e.deltaY < 0) {
        // If footer is animating (not fully visible), reverse the animation
        if (
          stage === 3 &&
          showFooter &&
          footerProgress < 1 &&
          footerProgress > 0
        ) {
          gsap.to(
            {},
            {
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: function () {
                setFooterProgress(1 - this.progress());
              },
              onComplete: () => {
                setShowFooter(false);
                setFooterProgress(0);
              },
            }
          );
          return;
        }

        scrollCountRef.current--;

        if (stage === 3 && scrollCountRef.current <= 1 && !showFooter) {
          scrollCountRef.current = 1;

          if (finalTextRef.current) {
            gsap.to(finalTextRef.current, {
              opacity: 0,
              y: -50,
              duration: 0.6,
              ease: "power2.in",
              onComplete: () => {
                setShowFinalUI(false);
                setStage(2);

                gsap.fromTo(
                  {},
                  { progress: 1 },
                  {
                    progress: 0,
                    duration: 10,
                    ease: "power1.inOut",
                    onUpdate: function () {
                      const reverseProgress = this.targets()[0].progress;
                      setTunnelProgress(reverseProgress);

                      if (astronautRef.current) {
                        astronautRef.current.animateForward(reverseProgress);
                      }
                    },
                    onComplete: () => {
                      setStage(1);
                      setTunnelProgress(0);
                    },
                  }
                );
              },
            });
          }
        } else if (stage === 1 && scrollCountRef.current <= 0) {
          scrollCountRef.current = 0;

          if (textRef.current) {
            gsap.to(textRef.current, {
              opacity: 0,
              y: 100,
              duration: 0.8,
              ease: "power2.in",
              onComplete: () => {
                setStage(0);
              },
            });
          }
        }

        if (scrollCountRef.current < 0) {
          scrollCountRef.current = 0;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [stage, showFooter, showFinalUI, footerProgress]);

  useEffect(() => {
    if (showFinalUI && finalTextRef.current) {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        finalTextRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      const letsLetters = letsLettersRef.current?.querySelectorAll(".letter");
      if (letsLetters) {
        tl.fromTo(
          letsLetters,
          { rotateX: -90, opacity: 0, y: -50 },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          0.3
        );
      }

      const workLetters = workLettersRef.current?.querySelectorAll(".letter");
      if (workLetters) {
        tl.fromTo(
          workLetters,
          { rotateX: -90, opacity: 0, y: -50 },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          0.4
        );
      }

      const togetherLetters =
        togetherLettersRef.current?.querySelectorAll(".letter");
      if (togetherLetters) {
        tl.fromTo(
          togetherLetters,
          { rotateX: -90, opacity: 0, y: -50 },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          0.5
        );
      }

      const buttonLetters =
        buttonLettersRef.current?.querySelectorAll(".letter");
      if (buttonLetters) {
        tl.fromTo(
          buttonLetters,
          { rotateX: -90, opacity: 0, y: -30 },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "back.out(2)",
          },
          0.7
        );
      }
    }
  }, [showFinalUI]);

  useEffect(() => {
    if (!showFinalUI) return;

    const animateRandomLetter = () => {
      const letsLetters = letsLettersRef.current?.querySelectorAll(".letter");
      const workLetters = workLettersRef.current?.querySelectorAll(".letter");
      const togetherLetters =
        togetherLettersRef.current?.querySelectorAll(".letter");
      const buttonLetters =
        buttonLettersRef.current?.querySelectorAll(".letter");

      if (letsLetters && workLetters && togetherLetters && buttonLetters) {
        const allLetters = [
          ...Array.from(letsLetters),
          ...Array.from(workLetters),
          ...Array.from(togetherLetters),
          ...Array.from(buttonLetters),
        ];

        const numLetters = Math.floor(Math.random() * 2) + 1;
        const shuffled = allLetters.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, numLetters);

        selected.forEach((letter) => {
          gsap.fromTo(
            letter,
            { rotateX: -90, y: -20 },
            { rotateX: 0, y: 0, duration: 0.9, ease: "power2.out" }
          );
        });
      }
    };

    const intervalId = setInterval(() => {
      animateRandomLetter();
    }, 3800);

    return () => clearInterval(intervalId);
  }, [showFinalUI]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
    >
      <div className="fixed top-0 left-0 right-0 z-[200]">
        <Header darkMode={stage < 3} />
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <Astronaut3D
          ref={astronautRef}
          stage={stage}
          tunnelProgress={tunnelProgress}
          showStickers={stage === 3}
        />
      </div>

      {stage === 1 && (
        <div
          ref={textRef}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 px-4 sm:px-6 md:px-8"
          style={{ perspective: "1000px" }}
        >
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-white leading-tight tracking-tight">
              STEP INTO A NEW WORLD
              <br />
              AND LET YOUR
              <br />
              IMAGINATION RUN WILD
            </h1>
          </div>
        </div>
      )}

      {showFinalUI && (
        <>
          <div
            ref={finalTextRef}
            className="fixed inset-0 flex flex-col items-center justify-center z-[100] pointer-events-none px-4 sm:px-6 md:px-8"
          >
            <div className="text-center max-w-7xl mx-auto">
              <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/90 mb-3 sm:mb-4 font-normal">
                IS YOUR BIG IDEA READY TO GO WILD?
              </p>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] 2xl:text-[11rem] 3xl:text-[13rem] font-normal text-white leading-[0.85] drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                style={{ perspective: "1000px" }}
              >
                <div ref={letsLettersRef} className="inline-block">
                  {"Let's ".split("").map((char, i) => (
                    <span
                      key={`lets-${i}`}
                      className="letter inline-block"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </div>
                <div ref={workLettersRef} className="inline-block">
                  {"work".split("").map((char, i) => (
                    <span
                      key={`work-${i}`}
                      className="letter inline-block"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
                <br />
                <span className="inline-block relative">
                  <div ref={togetherLettersRef} className="inline-block">
                    {"together!".split("").map((char, i) => (
                      <span
                        key={`together-${i}`}
                        className="letter inline-block"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </span>
              </h1>
            </div>
          </div>

          <div className="fixed bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 flex justify-center z-[100] px-4">
            <button
              ref={buttonLettersRef}
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-black rounded-full text-xs sm:text-sm md:text-base font-medium hover:bg-gray-100 transition-all uppercase tracking-wider shadow-2xl pointer-events-auto"
              style={{ perspective: "1000px" }}
            >
              {"↓ CONTINUE TO SCROLL ↓".split("").map((char, i) => (
                <span
                  key={`button-${i}`}
                  className="letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </button>
          </div>
        </>
      )}

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

      {stage === 0 && (
        <div className="fixed bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 flex justify-center items-center z-10">
          <div className="text-white text-xs sm:text-sm uppercase tracking-widest animate-bounce">
            Scroll to explore
          </div>
        </div>
      )}
    </div>
  );
}
