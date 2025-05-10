"use client";
import React from 'react';
import { motion } from "framer-motion"; 
import { AuroraBackground } from "@/components/ui/aurora";
import { Button } from '../ui/moving-border';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

export const LandingHero = () => {

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Smooth scroll to the section
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        variants={heroVariants}
        initial="hidden"
        whileInView="visible"
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="font-mulish-sans w-full max-w-7xl mx-auto relative flex flex-col gap-4 items-center justify-center px-4 sm:px-10"
      >
        <div className="text-2xl py-2 md:text-6xl font-bold text-gradient-teal-blue text-center">
         Unlock Your potential with Fluent English
        </div>
        <div className="text-center font-extralight text-base md:text-2xl text-gradient-blue-teal py-4">
          Master English with expert teachers, personalized learning, and proven results.

        </div>
        
        
        <Button
          borderRadius="1.75rem"
          className="bg-white cursor-pointer dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          enableBounce={true} 
          onClick={() => scrollToSection('joinus')}
        >
          Join Us Now
        </Button>
      </motion.div>
    </AuroraBackground>
  );
};
