"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";


const navbarVariants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0 },
};

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
  
 
  const handleScrollChange = useCallback((current: number | string) => {
    if (typeof current === "number") {
      const scrollY = window.scrollY;

      if (scrollY < 50) {
        setVisible(true);
      } else {
        if (scrollY < lastScrollY) {
          setVisible(true);
        } else {
          setVisible(false);
          if (mobileMenuOpen) {
            setMobileMenuOpen(false);
          }
        }
      }

      setLastScrollY(scrollY);
    }
  }, [lastScrollY, mobileMenuOpen]);

  useMotionValueEvent(scrollYProgress, "change", handleScrollChange);

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
      <motion.div
        variants={navbarVariants}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex font-mulish-sans max-w-fit fixed top-10 inset-x-0 bg-slate-100/50 mx-auto border border-purple rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-7 py-4 items-center justify-between",
          className
        )}
      >
        {/* Mobile Burger Menu Button */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col items-end justify-center gap-1.5">
            <span
              className={`block h-0.5 bg-zinc-700 transition-all duration-300 ease-out ${
                mobileMenuOpen ? "w-6 -rotate-45 translate-y-2" : "w-6"
              }`}
            />
            <span
              className={`block h-0.5 bg-zinc-700 transition-all duration-300 ease-out ${
                mobileMenuOpen ? "w-0 opacity-0" : "w-4"
              }`}
            />
            <span
              className={`block h-0.5 bg-zinc-700 transition-all duration-300 ease-out ${
                mobileMenuOpen ? "w-6 rotate-45 -translate-y-2" : "w-5"
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
              <span className="text-base group-hover:text-[#00897B] transition-colors duration-200 font-medium">
                {navItem.name}
              </span>
            </a>
          ))}
        </div>

    
        <div className="hidden sm:block w-6"></div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.2,
              type: "tween" 
            }}
            className="fixed inset-0 bg-[#9C62FF]/20 backdrop-blur-md z-[4999] sm:hidden pt-28 px-4 border-r border-[#9C62FF]/10"
          >
            <div className="flex flex-col space-y-6 items-start pl-6">
              {navItems.map((navItem, idx) => (
                <motion.a
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: idx * 0.05, 
                    type: "tween" 
                  }}
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
  );
};