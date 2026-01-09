import { useEffect, useRef, useState } from "react";
import { useLocation} from "react-router-dom";
import gsap from "gsap";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const location = useLocation();
  // const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest("button")) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleContactClick = () => {
    // Always dispatch event to show footer on current page
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
    <div
      ref={menuRef}
      className="fixed top-20 sm:top-24 md:top-28 right-4 sm:right-8 md:right-12 lg:right-16 w-[100vw] sm:w-[320px] md:w-[380px] z-[100] space-y-4"
      style={{ opacity: 0 }}
    >
      {/* Box 1 - Navigation Links */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-6">
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
                  className={`group relative text-xl sm:text-2xl md:text-3xl font-normal text-black transition-all tracking-tight flex items-center justify-between px-4 py-3 rounded-xl ${
                    isActive(item.path) ? "" : "hover:bg-gray-100"
                  }`}
                  style={{ perspective: "1000px" }}
                >
                  <span
                    className="flex"
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

                  {/* Active dot indicator */}
                  {isActive(item.path) && (
                    <span className="w-2 h-2 bg-black rounded-full" />
                  )}

                  {/* Hover arrow */}
                  {!isActive(item.path) && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
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
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <h3 className="text-2xl sm:text-4xl md:text-5xl font-normal text-black mb-4 leading-tight tracking-tight pb-5">
          Subscribe to
          <br />
          our newsletter
        </h3>
        <div className="relative">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-6 py-6 bg-[#f5f5f7] rounded-xl text-2xl text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 pr-12"
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
            <span className="text-lg sm:text-3xl font-medium tracking-wider pl-4">
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
  );
}
