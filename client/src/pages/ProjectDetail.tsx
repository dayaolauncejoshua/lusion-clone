import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import { projectsData } from "../data/projectsData";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [, setScrollProgress] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [metaOpacity, setMetaOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const nextPreviewRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nextProjectProgress, setNextProjectProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const project = id ? projectsData[id] : null;

  // Add useEffect to reset scroll and state on page load
  useEffect(() => {
    // Immediately reset everything on component mount or ID change
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    setIsTransitioning(false);
    setShowNext(false);
    setNextProjectProgress(0);
    setMetaOpacity(1);
    setScrollProgress(0);

    // Force reset container
    if (containerRef.current) {
      containerRef.current.style.opacity = "1";
      containerRef.current.style.transform = "scale(1)";
    }

    // Small delay to ensure DOM is ready before allowing scroll
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timeout);
  }, [id]);

  // Update the scroll handler useEffect
  useEffect(() => {
    if (!project) return;

    const handleScroll = () => {
      if (!containerRef.current || !carouselRef.current || isTransitioning)
        return;

      const carousel = carouselRef.current;
      const scrolled = window.scrollY;

      // Calculate total carousel width
      const gapSize = 96;
      const totalCarouselWidth = project.media.reduce((total, item, index) => {
        const width = item.aspectRatio > 1 ? 1346 : 991;
        return total + width + (index < project.media.length - 1 ? gapSize : 0);
      }, 0);

      // Calculate when carousel reaches its MAXIMUM width (all assets scrolled through)
      const carouselStartPosition = window.innerWidth * 0.5;
      const carouselMaxScroll =
        totalCarouselWidth + carouselStartPosition - window.innerWidth;

      // STOP carousel movement when it reaches max width
      if (scrolled < carouselMaxScroll) {
        // Normal horizontal scroll
        gsap.to(carousel, {
          x: -scrolled,
          ease: "power2.out",
          duration: 0.3,
        });
      } else {
        // FREEZE carousel at max scroll position
        gsap.to(carousel, {
          x: -carouselMaxScroll,
          ease: "power2.out",
          duration: 0.3,
        });
      }

      // Calculate when first image is fully visible
      const firstImageWidth = 1346;
      const firstImageStartPos = window.innerWidth * 0.5;
      const scrollNeededToShowFull =
        firstImageStartPos - (window.innerWidth - firstImageWidth);

      const fadeStartScroll = scrollNeededToShowFull * 0.5;
      const fadeEndScroll = scrollNeededToShowFull;

      if (scrolled < fadeStartScroll) {
        setMetaOpacity(1);
      } else if (scrolled > fadeEndScroll) {
        setMetaOpacity(0);
      } else {
        const fadeProgress =
          (scrolled - fadeStartScroll) / (fadeEndScroll - fadeStartScroll);
        setMetaOpacity(1 - fadeProgress);
      }

      // Show next project ONLY when carousel reaches max width (end of all assets)
      if (scrolled >= carouselMaxScroll) {
        if (!showNext) {
          setShowNext(true);
        }

        // Progress bar fills based on CONTINUED scrolling after carousel ends
        // Give large scroll distance for progress (4x window height for longer feel)
        const progressScrollDistance = window.innerHeight * 4;
        const scrollSinceCarouselEnd = scrolled - carouselMaxScroll;
        const progressValue = Math.min(
          scrollSinceCarouselEnd / progressScrollDistance,
          1
        );

        setNextProjectProgress(progressValue);

        // Auto-navigate when progress reaches 100%
        if (progressValue >= 0.99 && !isTransitioning) {
          setIsTransitioning(true);

          window.removeEventListener("scroll", handleScroll);

          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;

              navigate(`/projects/${project.nextProject.id}`, {
                replace: true,
              });

              setTimeout(() => {
                window.scrollTo(0, 0);
              }, 0);
            },
          });
        }
      } else {
        if (showNext) {
          setShowNext(false);
        }
        setNextProjectProgress(0);
      }
    };

    const timeout = setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 100);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [project, showNext, navigate, isTransitioning, id]);

  // Update body height - carousel width + progress scroll distance
  // Update body height - carousel max scroll + progress scroll distance
  useEffect(() => {
    if (!carouselRef.current || !project) return;

    document.body.style.height = "";

    const timeout = setTimeout(() => {
      // Calculate total carousel width
      const gapSize = 96;
      const totalCarouselWidth = project.media.reduce((total, item, index) => {
        const width = item.aspectRatio > 1 ? 1346 : 991;
        return total + width + (index < project.media.length - 1 ? gapSize : 0);
      }, 0);

      const carouselStartPosition = window.innerWidth * 0.5;
      const carouselMaxScroll =
        totalCarouselWidth + carouselStartPosition - window.innerWidth;

      // Body height = carousel max scroll + progress scroll distance (4x window height)
      const progressScrollDistance = window.innerHeight * 4;
      document.body.style.height = `${
        carouselMaxScroll + progressScrollDistance + window.innerHeight
      }px`;
    }, 50);

    return () => {
      clearTimeout(timeout);
      document.body.style.height = "";
    };
  }, [project, id]);

  // Entrance animation - morph from clicked card
  useEffect(() => {
    if (!project || !carouselRef.current) return;

    const firstMedia = carouselRef.current.querySelector(".media-item");
    const meta = metaRef.current;

    if (firstMedia && meta) {
      // Reset and animate first media from right (off-screen) to its position
      gsap.fromTo(
        firstMedia,
        {
          x: window.innerWidth * 0.2,
          scale: 0.95,
          opacity: 0,
        },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        }
      );

      // Animate meta info
      gsap.fromTo(
        meta,
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }
  }, [project, id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-3 bg-white text-black rounded-full"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundColor: project.backgroundColor,
        opacity: 1,
        transform: "scale(1)",
      }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header darkMode={project.textColor === "#ffffff"} />
      </div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed z-40 px-8 py-4 bg-white text-black rounded-full font-medium text-sm tracking-wider hover:bg-opacity-90 transition-all flex items-center gap-2"
        style={{ top: "40px", left: "50%", transform: "translateX(-50%)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        BACK
      </button>
      {/* Horizontal Carousel - first image 70% visible from right */}
      <div
        ref={carouselRef}
        className="fixed top-0 flex items-center gap-24"
        style={{
          height: "100vh",
          width: "max-content",
          left: `${window.innerWidth * 0.5}px`,
          paddingRight: "0px",
        }}
      >
        {project.media.map((item, index) => {
          const width = item.aspectRatio > 1 ? 1346 : 991;
          const height = width / item.aspectRatio;

          return (
            <div
              key={index}
              ref={(el) => {mediaRefs.current[index] = el}}
              className="media-item flex-shrink-0 rounded-[2rem] overflow-hidden bg-gray-800 shadow-2xl"
              style={{
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`${project.title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Project Meta - fades out when first image is fully visible */}
      <div
        ref={metaRef}
        className="fixed left-16 top-1/2 -translate-y-1/2 z-30 max-w-xl transition-opacity duration-300"
        style={{
          color: project.textColor,
          opacity: metaOpacity,
          pointerEvents: metaOpacity < 0.5 ? "none" : "auto",
        }}
      >
        <h2 className="text-7xl font-normal mb-8 leading-tight">
          {project.title}
        </h2>

        <div className="flex gap-28">
          {/* Left: Description & Launch Button */}
          <div className="space-y-10">
            <p className="text-md leading-relaxed opacity-90">
              {project.description}
            </p>
            <a
              href={project.launchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-5 px-4 py-4 bg-white text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <span className="w-3 h-3 bg-black rounded-full"></span>
              <span className="text-lg font-medium tracking-tighter">
                LAUNCH PROJECT
              </span>
              <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="M9 9h6m0 0v6m0-6-6 6"
                />
              </svg>
            </a>
          </div>

          {/* Right: Services */}
          <div className="space-y-2">
            <h4 className="text-sm uppercase tracking-wide pb-4">Services</h4>
            {project.services.map((service, index) => (
              <div key={index} className="text-sm">
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Project Preview */}
      <div
        ref={nextPreviewRef}
        className="fixed right-0 top-0 h-full w-[600px] flex items-center justify-center transition-transform duration-700"
        style={{
          transform: showNext ? "translateX(0)" : "translateX(100%)",
          backgroundColor: project.nextProject.backgroundColor,
          color: project.nextProject.textColor,
        }}
      >
        <div className="text-center px-12">
          <h2 className="text-7xl font-normal mb-16 leading-tight whitespace-pre-line">
            {project.nextProject.title}
          </h2>

          <div className="flex flex-col items-center gap-6">
            <span className="text-xs uppercase tracking-widest opacity-60">
              NEXT PROJECT
            </span>

            {/* Progress Bar - Clear LINE indicator */}
            <div className="relative w-64 h-[3px] rounded-full overflow-hidden">
              {/* Background Line - Gray/Dimmed */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: project.nextProject.textColor,
                  opacity: 0.2,
                }}
              />

              {/* Progress Fill Line - Full Color filling from left to right */}
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${nextProjectProgress * 100}%`,
                  backgroundColor: project.nextProject.textColor,
                  opacity: 1,
                  boxShadow:
                    nextProjectProgress > 0.1
                      ? `0 0 12px ${project.nextProject.textColor}`
                      : "none",
                }}
              />
            </div>

            {/* Progress percentage text - larger and more visible */}
            <span
              className="text-lg font-medium tabular-nums tracking-wider"
              style={{ opacity: nextProjectProgress > 0 ? 0.8 : 0.4 }}
            >
              {Math.round(nextProjectProgress * 100)}%
            </span>

            <button
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);

                  // Remove scroll listener
                  window.removeEventListener("scroll", () => {});

                  gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                      window.scrollTo(0, 0);
                      document.body.scrollTop = 0;
                      document.documentElement.scrollTop = 0;

                      navigate(`/projects/${project.nextProject.id}`, {
                        replace: true,
                      });

                      setTimeout(() => {
                        window.scrollTo(0, 0);
                      }, 0);
                    },
                  });
                }
              }}
              className="hover:scale-110 transition-transform mt-4"
              disabled={isTransitioning}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
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
  );
}
