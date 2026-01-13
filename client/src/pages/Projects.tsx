import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectsCTASection from '../components/ProjectsCTASection'

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const [, setShowFooter] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: "devin_ai",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Devin AI",
    },
    {
      id: "porsche_dream_machine",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      tags: "CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO",
      title: "Porsche: Dream Machine",
    },
    {
      id: "synthetic_human",
      image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Synthetic Human",
    },
    {
      id: "ddd_2024",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "DDD 2024",
    },
    {
      id: "spaace",
      image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D • WEB3",
      title: "Spaace - NFT Marketplace",
    },
    {
      id: "choo_choo_world",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      tags: "CONCEPT • WEB • GAME DESIGN • 3D",
      title: "Choo Choo World",
    },
    {
      id: "zero_tech",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Zero Tech",
    },
    {
      id: "spatial_fusion",
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Meta: Spatial Fusion",
    },
    {
      id: "worldcoin",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      tags: "API DESIGN • WEBGL • 3D",
      title: "Worldcoin Globe",
    },
    {
      id: "lusion_labs",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Lusion Labs",
    },
    {
      id: "my_little_story_book",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
      tags: "CONCEPT • DESIGN • DEVELOPMENT • 3D",
      title: "My Little Storybook",
    },
    {
      id: "soda_experience",
      image: "https://images.unsplash.com/photo-1622495805609-f6c49cf4bfbc?w=800",
      tags: "AR • DEVELOPMENT • 3D",
      title: "Soda Experience",
    },
    {
      id: "infinite_passerella",
      image: "https://images.unsplash.com/photo-1445510491599-30f90ac4e064?w=800",
      tags: "CONCEPT • DESIGN • DEVELOPMENT • 3D",
      title: "Infinite Passerella",
    },
    {
      id: "the_turn_of_the_screw",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      tags: "DESIGN • DEVELOPMENT • 3D",
      title: "The Turn Of The Screw",
    },
    {
      id: "maxmara_bearings_gifts",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800",
      tags: "DEVELOPMENT • 3D",
      title: "Max Mara: Bearing Gifts",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
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

      // Counter animation
      gsap.from(counterRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
        x: 60,
        opacity: 0,
        ease: "power3.out",
      });

      // Card animations
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative bg-[#e8e8ed]">
      {/* Header - Light mode (darkMode=false) */}
      <div className="fixed top-0 left-0 right-0 z-[200]">
        <Header darkMode={false} />
      </div>

      {/* Hero Section */}
      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 md:pt-48 lg:pt-64 pb-12 sm:pb-16 md:pb-20"
      >
        {/* Title Row - Stacks on mobile, side-by-side on desktop */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-start justify-between mb-12 sm:mb-16 md:mb-20 lg:mb-28 mt-8 sm:mt-12 md:mt-16 gap-6 md:gap-0">
          {/* Title - Responsive sizes */}
          <h1
            ref={titleRef}
            className="text-[4rem] sm:text-[6rem] md:text-[10rem] lg:text-[15rem] xl:text-[19rem] font-normal leading-[0.7] tracking-tight text-black m-0 p-0 w-full md:w-[80%]"
          >
            PROJECTS
          </h1>

          {/* Counter and arrow - Responsive sizes and positioning */}
          <div
            ref={counterRef}
            className="flex flex-row md:flex-col items-center md:items-end justify-start md:justify-between gap-4 md:gap-0 w-full md:w-[20%] md:self-stretch"
          >
            <span className="text-[3rem] sm:text-[4rem] md:text-[4.5rem] lg:text-[5.5rem] font-normal text-black leading-none m-0 p-0">
              15
            </span>
            <svg
              className="w-12 h-10 sm:w-16 sm:h-14 md:w-20 md:h-16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 38 38"
              fill="none"
            >
              <path
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="m2 2 34 34m0 0V6.046M36 36H6.046"
              />
            </svg>
          </div>
        </div>

        {/* Project Grid - Responsive columns */}
        <div
          ref={cardsRef}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-12 sm:gap-y-16 md:gap-y-20"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <ProjectsCTASection onFooterChange={setShowFooter} />
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: { id: string; image: string; tags: string; title: string };
}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="project-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Image - Responsive border radius */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-3 sm:mb-4 bg-gray-300">
        <img
          src={project.image}
          alt={project.title}
          className="project-image w-full h-auto aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Tags - Responsive font size */}
      <p className="text-[10px] sm:text-xs font-normal text-black mb-1 sm:mb-2 tracking-wide uppercase">
        {project.tags}
      </p>

      {/* Title with Arrow Animation - Responsive sizes */}
      <div className="relative flex items-center overflow-hidden">
        {/* Arrow that slides in from left */}
        <span
          className={`absolute left-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-black transition-all duration-500 ease-out ${
            isHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8 sm:-translate-x-12"
          }`}
        >
          →
        </span>

        {/* Title that slides right on hover */}
        <h3
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-black tracking-tight transition-all duration-500 ease-out ${
            isHovered ? "translate-x-8 sm:translate-x-12 md:translate-x-14 lg:translate-x-16" : "translate-x-0"
          }`}
        >
          {project.title}
        </h3>
      </div>
    </div>
  );
}