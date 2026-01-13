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
  const [isMobile, setIsMobile] = useState(false);

  const project = id ? projectsData[id] : null;

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // < 1024px is mobile/tablet
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset scroll and state on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    setIsTransitioning(false);
    setShowNext(false);
    setNextProjectProgress(0);
    setMetaOpacity(1);
    setScrollProgress(0);

    if (containerRef.current) {
      containerRef.current.style.opacity = "1";
      containerRef.current.style.transform = "scale(1)";
    }

    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timeout);
  }, [id]);

  // Scroll handler - DESKTOP ONLY
  useEffect(() => {
    if (!project || isMobile) return;

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

      const carouselStartPosition = window.innerWidth * 0.5;
      const carouselMaxScroll =
        totalCarouselWidth + carouselStartPosition - window.innerWidth;

      // Carousel movement
      if (scrolled < carouselMaxScroll) {
        gsap.to(carousel, {
          x: -scrolled,
          ease: "power2.out",
          duration: 0.3,
        });
      } else {
        gsap.to(carousel, {
          x: -carouselMaxScroll,
          ease: "power2.out",
          duration: 0.3,
        });
      }

      // Meta fade
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

      // Next project logic
      if (scrolled >= carouselMaxScroll) {
        if (!showNext) {
          setShowNext(true);
        }

        const progressScrollDistance = window.innerHeight * 4;
        const scrollSinceCarouselEnd = scrolled - carouselMaxScroll;
        const progressValue = Math.min(
          scrollSinceCarouselEnd / progressScrollDistance,
          1
        );

        setNextProjectProgress(progressValue);

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
              navigate(`/projects/${project.nextProject.id}`, {
                replace: true,
              });
              setTimeout(() => window.scrollTo(0, 0), 0);
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
  }, [project, showNext, navigate, isTransitioning, id, isMobile]);

  // Body height - DESKTOP ONLY
  useEffect(() => {
    if (!carouselRef.current || !project || isMobile) return;

    document.body.style.height = "";

    const timeout = setTimeout(() => {
      const gapSize = 96;
      const totalCarouselWidth = project.media.reduce((total, item, index) => {
        const width = item.aspectRatio > 1 ? 1346 : 991;
        return total + width + (index < project.media.length - 1 ? gapSize : 0);
      }, 0);

      const carouselStartPosition = window.innerWidth * 0.5;
      const carouselMaxScroll =
        totalCarouselWidth + carouselStartPosition - window.innerWidth;
      const progressScrollDistance = window.innerHeight * 4;

      document.body.style.height = `${
        carouselMaxScroll + progressScrollDistance + window.innerHeight
      }px`;
    }, 50);

    return () => {
      clearTimeout(timeout);
      document.body.style.height = "";
    };
  }, [project, id, isMobile]);

  // Entrance animation
  useEffect(() => {
    if (!project || !carouselRef.current) return;

    const firstMedia = carouselRef.current.querySelector(".media-item");
    const meta = metaRef.current;

    if (firstMedia && meta) {
      gsap.fromTo(
        firstMedia,
        {
          x: isMobile ? 50 : window.innerWidth * 0.2,
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

      gsap.fromTo(
        meta,
        {
          x: isMobile ? -30 : -100,
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
  }, [project, id, isMobile]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4">
            Project Not Found
          </h1>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-full text-sm sm:text-base"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // MOBILE VERSION - Vertical scroll layout
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="min-h-screen"
        style={{ backgroundColor: project.backgroundColor }}
      >
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header darkMode={project.textColor === "#ffffff"} />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed z-[60] bottom-8 left-8 px-6 py-3 bg-white text-black rounded-full font-medium text-sm tracking-wider hover:bg-opacity-90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
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

        {/* Content */}
        <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 sm:pb-16">
          {/* Project Meta */}
          <div
            ref={metaRef}
            className="mb-8 sm:mb-12"
            style={{ color: project.textColor }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-4 sm:mb-6 leading-tight">
              {project.title}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed opacity-90 mb-6 sm:mb-8">
              {project.description}
            </p>

            <div className="flex flex-col gap-6 sm:gap-8 mb-6 sm:mb-8">
              <a
                href={project.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-4 sm:px-5 py-3 sm:py-4 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full"></span>
                <span className="text-sm sm:text-base font-medium tracking-tighter">
                  LAUNCH PROJECT
                </span>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="sm:w-6 sm:h-6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    d="M9 9h6m0 0v6m0-6-6 6"
                  />
                </svg>
              </a>

              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm uppercase tracking-wide opacity-70">
                  Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((service, index) => (
                    <span
                      key={index}
                      className="text-xs sm:text-sm px-3 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          project.textColor === "#ffffff"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                      }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Media Gallery */}
          <div ref={carouselRef} className="space-y-4 sm:space-y-6">
            {project.media.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  mediaRefs.current[index] = el;
                }}
                className="media-item rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-800 shadow-xl"
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={`${project.title} - ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Next Project CTA */}
          <div
            className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl sm:rounded-3xl"
            style={{
              backgroundColor: project.nextProject.backgroundColor,
              color: project.nextProject.textColor,
            }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-widest opacity-60 mb-3 sm:mb-4">
              NEXT PROJECT
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-6 sm:mb-8 leading-tight whitespace-pre-line">
              {project.nextProject.title}
            </h2>
            <button
              onClick={() => navigate(`/projects/${project.nextProject.id}`)}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: project.nextProject.textColor,
                color: project.nextProject.backgroundColor,
              }}
            >
              VIEW PROJECT
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="sm:w-5 sm:h-5"
              >
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
    );
  }

  // DESKTOP VERSION - Horizontal scroll
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
        className="fixed z-[60] bottom-8 left-8 px-6 py-3 bg-white text-black rounded-full font-medium text-sm tracking-wider hover:bg-opacity-90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
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

      {/* Horizontal Carousel */}
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
              ref={(el) => {
                mediaRefs.current[index] = el;
              }}
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

      {/* Project Meta */}
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

            <div className="relative w-64 h-[3px] rounded-full overflow-hidden">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: project.nextProject.textColor,
                  opacity: 0.2,
                }}
              />
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
                  gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                      window.scrollTo(0, 0);
                      navigate(`/projects/${project.nextProject.id}`, {
                        replace: true,
                      });
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
