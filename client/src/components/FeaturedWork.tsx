import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        ease: "power3.out",
      });

      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          end: "top 35%",
          scrub: 1,
        },
        x: 60,
        opacity: 0,
        ease: "power3.out",
      });

      const cards = cardsRef.current?.querySelectorAll(".project-card");
      if (cards) {
        cards.forEach((card, index) => {
          const xValue = index % 2 === 0 ? -80 : 80;

          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              end: "top 45%",
              scrub: 1,
            },
            x: xValue,
            opacity: 0,
            scale: 0.95,
            ease: "power2.out",
          });

          const cardImage = card.querySelector(".project-image");
          if (cardImage) {
            gsap.from(cardImage, {
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "top 40%",
                scrub: 1,
              },
              scale: 1.15,
              ease: "power2.out",
            });
          }
        });
      }

      gsap.from(buttonRef.current, {
        scrollTrigger: {
          trigger: buttonRef.current,
          start: "top 85%",
          end: "top 65%",
          scrub: 1,
        },
        scale: 0.8,
        opacity: 0,
        ease: "back.out(1.7)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [
    {
      id: "devin_ai",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Devin AI",
    },
    {
      id: "porsche_dream_machine",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      tags: "CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO",
      title: "Porsche: Dream Machine",
    },
    {
      id: "synthetic_human",
      image:
        "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Synthetic Human",
    },
    {
      id: "spatial_fusion",
      image:
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Meta: Spatial Fusion",
    },
    {
      id: "spaace",
      image:
        "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D • WEB3",
      title: "Spaace - NFT Marketplace",
    },
    {
      id: "ddd_2024",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "DDD 2024",
    },
    {
      id: "choo_choo_world",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      tags: "CONCEPT • WEB • GAME DESIGN • 3D",
      title: "Choo Choo World",
    },
    {
      id: "soda_experience",
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800",
      tags: "AR • DEVELOPMENT • 3D",
      title: "Soda Experience",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#f5f5f5] py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-10 lg:px-16"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 lg:gap-0 mb-12 sm:mb-14 md:mb-16 lg:mb-20">
        <h2
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[9rem] font-normal leading-[0.9] text-black tracking-normal max-w-5xl"
        >
          Featured Work
        </h2>

        <p
          ref={descriptionRef}
          className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-black max-w-xs lg:max-w-sm mt-4 lg:mt-8 tracking-wider"
          style={{ lineHeight: "1.7" }}
        >
          A SELECTION OF OUR MOST PASSIONATELY CRAFTED WORKS WITH
          FORWARD-THINKING CLIENTS AND FRIENDS OVER THE YEARS.
        </p>
      </div>

      {/* Project Grid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 mb-12 sm:mb-14 md:mb-16 lg:mb-20"
      >
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card group cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2rem] mb-3 sm:mb-4 bg-gray-200"
              style={{ aspectRatio: "16/10" }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="project-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <p className="text-[10px] sm:text-xs md:text-sm font-medium text-black mb-1 sm:mb-2 tracking-wider">
                {project.tags}
              </p>
              <div className="relative flex items-center overflow-hidden">
                <span className="absolute left-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out flex items-center">
                  →
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-black tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-10 sm:group-hover:translate-x-12 md:group-hover:translate-x-14 lg:group-hover:translate-x-16">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All Projects Button */}
      <div className="flex justify-center">
        <button
          ref={buttonRef}
          onClick={() => navigate('/projects')}
          className="group relative flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-7 lg:px-8 py-3 sm:py-3.5 md:py-4 bg-white text-black rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-[#0044ff] hover:text-white transition-all duration-300 shadow-lg border border-gray-200 overflow-hidden"
        >
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-black rounded-full group-hover:opacity-0 group-hover:scale-0 transition-all duration-300" />

          <span className="group-hover:-translate-x-6 sm:group-hover:-translate-x-7 md:group-hover:-translate-x-8 transition-transform duration-300 tracking-wider">
            SEE ALL PROJECTS
          </span>

          <span className="absolute right-6 sm:right-7 md:right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-xl sm:text-2xl font-bold">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
