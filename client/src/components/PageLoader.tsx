import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface PageLoaderProps {
  onComplete?: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const lContainerRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, [onComplete]);

  // Animate progress bar and handle morphing
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // When progress reaches 95%, morph bar into L shape
    if (
      progress >= 95 &&
      progressContainerRef.current &&
      lContainerRef.current &&
      loadingTextRef.current
    ) {
      // Fade out loading text
      gsap.to(loadingTextRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

      const timeline = gsap.timeline();

      // Step 1: Bar breaks/splits with shake
      timeline.to(progressContainerRef.current, {
        scale: 1.05,
        duration: 0.1,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
      });

      // Step 2: Transform bar into L shape
      timeline.to(
        progressContainerRef.current,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: 'power2.in',
        },
        0.3
      );

      // Step 3: Show L and morph it from bar-like shape
      timeline.fromTo(
        lContainerRef.current,
        {
          display: 'flex',
          opacity: 0,
          scaleX: 3,
          scaleY: 0.3,
          rotation: 90,
        },
        {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        0.5
      );

      // Step 4: Zoom L towards camera
      timeline.to(
        lContainerRef.current,
        {
          scale: 10,
          duration: 1.2,
          ease: 'power2.in',
        },
        1.5
      );

      // Step 5: Fade out everything
      timeline.to(
        loaderRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            if (onComplete) onComplete();
          },
        },
        2.3
      );
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Progress Bar Container - BIGGER HEIGHT, NO BORDER RADIUS */}
      <div
        ref={progressContainerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] h-[20px] sm:h-[24px] md:h-[30px] bg-gray-800"
      >
        <div
          ref={progressBarRef}
          className="h-full bg-white origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* L Shape - Hidden initially, morphs from bar */}
      <div
        ref={lContainerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden"
        style={{ opacity: 0 }}
      >
        <div className="relative w-[120px] h-[180px]">
          {/* Vertical stroke of L */}
          <div className="absolute left-0 top-0 w-[40px] h-full bg-white" />
          {/* Horizontal stroke of L */}
          <div className="absolute left-0 bottom-0 w-full h-[40px] bg-white" />
        </div>
      </div>

      {/* Loading Text with Animated Dots - Bottom Left */}
      <div
        ref={loadingTextRef}
        className="absolute bottom-6 sm:bottom-10 md:bottom-16 lg:bottom-20 left-6 sm:left-10 md:left-16 lg:left-20"
      >
        <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-wider">
          LOADING<span className="inline-block w-12 text-left">{dots}</span>
        </p>
      </div>

      {/* Lusion Branding - Bottom Right */}
      <div className="absolute bottom-6 sm:bottom-10 md:bottom-16 lg:bottom-20 right-6 sm:right-10 md:right-16 lg:right-20 opacity-40">
        <p className="text-white text-xs sm:text-sm md:text-base font-light tracking-widest">
          LUSION
        </p>
      </div>
    </div>
  );
}