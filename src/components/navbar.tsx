"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";


export const Navbar = ({
  navItems,
  className
}: {
  navItems: {
    name: string,
    link: string,
    icon?: React.ReactNode
  }[],
  className?: string
}) => {
  const { scrollYProgress } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const scrollY = window.scrollY;

      // Show navbar when at the top
      if (scrollY < 50) {
        setVisible(true);
      }
      // Show when scrolling up, hide when scrolling down
      else {
        if (scrollY < lastScrollY) {
          // Scrolling up
          setVisible(true);
        } else {
          // Scrolling down
          setVisible(false);

          // Close mobile menu when scrolling down
          if (mobileMenuOpen) {
            setMobileMenuOpen(false);
          }
        }
      }

      setLastScrollY(scrollY);
    }
  });

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);
  return (

    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "flex font-mulish-sans max-w-fit fixed top-10 inset-x-0 bg-slate-100/50 mx-auto border border-purple rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-7 py-4 items-center justify-between",
            className
          )}
        >
          {/* Mobile Burger Menu Button (moved to left) */}
          <button
            className="sm:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end justify-center gap-1.5">
              <span
                className={`block h-0.5 bg-zinc-700 transition-all duration-300 ease-out ${mobileMenuOpen ? "w-6 -rotate-45 translate-y-2" : "w-6"
                  }`}
              />
              <span
                className={`block h-0.5 bg-zinc-700 transition-all duration-300 ease-out ${mobileMenuOpen ? "w-0 opacity-0" : "w-4"
                  }`}
              />
              <span
                className={`block h-0.5 bg-zinc-700 transition-all duration-300 ease-out ${mobileMenuOpen ? "w-6 rotate-45 -translate-y-2" : "w-5"
                  }`}
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center justify-center space-x-6 mx-auto">
            {navItems.map((navItem, idx) => (
              <a
                key={`nav-link-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative group text-zinc-700 text-center transition-colors duration-200"
                )}
              >
                <span className="text-base group-hover:text-[#9C62FF] transition-colors duration-200 font-medium">{navItem.name}</span>
              </a>
            ))}
          </div>

          {/* Empty div to balance the flex layout */}
          <div className="hidden sm:block w-6"></div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#9C62FF]/20 backdrop-blur-md z-[4999] sm:hidden pt-28 px-4 border-r border-[#9C62FF]/10"
          >
            <div className="flex flex-col space-y-6 items-start pl-6">
              {navItems.map((navItem, idx) => (
                <motion.a
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  key={`mobile-link-${idx}`}
                  href={navItem.link}
                  className="text-zinc-700 hover:text-purple flex items-center gap-2 text-lg font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {navItem.icon && <span className="text-purple">{navItem.icon}</span>}
                  <span>{navItem.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

