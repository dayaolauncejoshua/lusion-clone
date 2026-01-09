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
  // const navigate = useNavigate();

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
      id: "ddd_2024",
      image:
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "DDD 2024",
    },
    {
      id: "spaace",
      image:
        "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800",
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
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
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
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      tags: "API DESIGN • WEBGL • 3D",
      title: "Worldcoin Globe",
    },
    {
      id: "lusion_labs",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      tags: "WEB • DESIGN • DEVELOPMENT • 3D",
      title: "Lusion Labs",
    },
    {
      id: "my_little_story_book",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
      tags: "CONCEPT • DESIGN • DEVELOPMENT • 3D",
      title: "My Little Storybook",
    },
    {
      id: "soda_experience",
      image:
        "https://images.unsplash.com/photo-1622495805609-f6c49cf4bfbc?w=800",
      tags: "AR • DEVELOPMENT • 3D",
      title: "Soda Experience",
    },
    {
      id: "infinite_passerella",
      image:
        "https://images.unsplash.com/photo-1445510491599-30f90ac4e064?w=800",
      tags: "CONCEPT • DESIGN • DEVELOPMENT • 3D",
      title: "Infinite Passerella",
    },
    {
      id: "the_turn_of_the_screw",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      tags: "DESIGN • DEVELOPMENT • 3D",
      title: "The Turn Of The Screw",
    },
    {
      id: "maxmara_bearings_gifts",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800",
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
        className="relative min-h-screen flex flex-col items-center justify-start px-16 pt-64 pb-20"
      >
        {/* Title Row - 80% title, 20% counter */}
        <div className="w-full flex flex-row items-start justify-between mb-28 mt-16">
          {/* Title takes 80% */}
          <h1
            ref={titleRef}
            className="text-[19rem] font-normal leading-[0.7] tracking-tight text-black m-0 p-0"
            style={{ width: "80%" }}
          >
            PROJECTS
          </h1>

          {/* Counter and arrow take 20% */}
          <div
            ref={counterRef}
            className="flex flex-col items-end justify-between"
            style={{
              width: "20%",
              height: "auto",
              alignSelf: "stretch",
            }}
          >
            <span className="text-[5.5rem] font-normal text-black leading-none m-0 p-0">
              15
            </span>
            <svg
              className="w-20 h-16"
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

        {/* Project Grid */}
        <div
          ref={cardsRef}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20"
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
      {/* Image */}
      <div className="relative overflow-hidden rounded-3xl mb-4 bg-gray-300">
        <img
          src={project.image}
          alt={project.title}
          className="project-image w-full h-auto aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Tags */}
      <p className="text-xs font-normal text-black mb-2 tracking-wide uppercase">
        {project.tags}
      </p>

      {/* Title with Arrow Animation */}
      <div className="relative flex items-center overflow-hidden">
        {/* Arrow that slides in from left */}
        <span
          className={`absolute left-0 text-5xl font-normal text-black transition-all duration-500 ease-out ${
            isHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
          }`}
        >
          →
        </span>

        {/* Title that slides right on hover */}
        <h3
          className={`text-5xl font-normal text-black tracking-tight transition-all duration-500 ease-out ${
            isHovered ? "translate-x-16" : "translate-x-0"
          }`}
        >
          {project.title}
        </h3>
      </div>
    </div>
  );
}
