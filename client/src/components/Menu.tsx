import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen && shouldRender) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    } else if (!isOpen && shouldRender) {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setShouldRender(false);
        },
      });
    }
  }, [isOpen, shouldRender]);

  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent("showFooter"));
    onClose();
  };

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (path === "/contact") {
      e.preventDefault();
      handleContactClick();
    } else {
      onClose();
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const letters = e.currentTarget.querySelectorAll(".letter");

    gsap.fromTo(
      letters,
      {
        rotateX: -90,
        y: -20,
        opacity: 0,
      },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.5)",
      }
    );
  };

  if (!shouldRender) return null;

  const menuItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT US", path: "/about" },
    { label: "PROJECTS", path: "/projects" },
    { label: "CONTACT", path: "/contact" },
  ];

  return (
    <>
      {/* Full-screen menu on mobile, dropdown on desktop */}
      <div
        ref={menuRef}
        className="fixed inset-0 md:inset-auto md:top-16 lg:top-20 xl:top-24 md:right-4 lg:right-8 xl:right-12 2xl:right-16 md:w-[320px] lg:w-[380px] z-[100] bg-[#0044ff] md:bg-transparent md:space-y-4 overflow-y-auto md:overflow-visible"
        style={{ opacity: 0 }}
      >
        {/* Mobile Full-Screen Layout */}
        <div className="md:hidden h-full flex flex-col p-6 pt-20">
          {/* Close button - top right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="text-white text-2xl font-medium mb-8">LUSION</div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNavClick(item.path, e)}
                    className="flex items-center justify-between px-4 py-4 text-white text-2xl font-normal rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Let's Talk - Full width button */}
          <div className="mt-auto space-y-4">
            <button className="w-full bg-white text-black px-6 py-4 rounded-2xl text-lg font-medium flex items-center justify-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" fill="currentColor" />
                <rect x="3" y="14" width="7" height="7" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" fill="currentColor" />
                <rect x="14" y="14" width="7" height="7" fill="currentColor" />
              </svg>
              LET'S TALK
            </button>

            {/* Labs Link */}
            <a
              href="https://labs.lusion.co"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-black text-white px-6 py-4 rounded-2xl flex items-center justify-between hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">ö</span>
                <span className="text-xl font-medium">LABS</span>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Desktop Dropdown Layout */}
        <div className="hidden md:block space-y-4">
          {/* Box 1 - Navigation Links */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <nav>
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      onClick={(e) => handleNavClick(item.path, e)}
                      onMouseEnter={
                        !isActive(item.path) ? handleMouseEnter : undefined
                      }
                      className={`group relative text-2xl xl:text-3xl font-normal text-black transition-all tracking-tight flex items-center justify-between px-4 py-3 rounded-xl ${
                        isActive(item.path) ? "" : "hover:bg-gray-100"
                      }`}
                      style={{ perspective: "1000px" }}
                    >
                      <span
                        className="flex overflow-hidden"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {item.label.split("").map((char, index) => (
                          <span
                            key={index}
                            className="letter inline-block"
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        ))}
                      </span>

                      {isActive(item.path) && (
                        <span className="w-2 h-2 bg-black rounded-full flex-shrink-0 ml-2" />
                      )}

                      {!isActive(item.path) && (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 12H19M19 12L12 5M19 12L12 19"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Box 2 - Newsletter */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-4xl xl:text-5xl font-normal text-black mb-4 leading-tight tracking-tight">
              Subscribe to
              <br />
              our newsletter
            </h3>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-6 py-6 bg-[#f5f5f7] rounded-xl text-xl xl:text-2xl text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 pr-12"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Box 3 - Labs Link */}
          <div className="bg-black rounded-2xl shadow-2xl p-2">
            <a
              href="https://labs.lusion.co"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black text-white rounded-full px-6 py-3 flex items-center justify-between hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-5xl">ö</span>
                <span className="text-3xl font-medium tracking-wider pl-4">
                  LABS
                </span>
              </div>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}