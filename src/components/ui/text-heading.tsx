"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHeading = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  showLine = true,
  lineColor = "#00897B",
  lineWidth = "80px", // Changed to pixel value for more precision
  lineHeight = "3px", // New prop for line height
  shadowSize = "15px", // New prop for shadow size
  shadowOpacity = 0.7, // New prop for shadow opacity
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  showLine?: boolean;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  shadowSize?: string;
  shadowOpacity?: number;
}) => {
  let wordsArray = words.split(" ");

  // Animation variants for text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0,
      filter: filter ? "blur(10px)" : "none", 
    },
    visible: { 
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: duration,
      },
    },
  };

  // Animation variants for line
  const lineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: lineWidth,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={cn("font-bold relative", className)}>
      <div className="py-6 flex flex-col items-center">
        <motion.div 
          className="bg-gradient-to-r from-blue-100 to-purple text-transparent bg-clip-text leading-snug tracking-wide text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {wordsArray.map((word, idx) => (
            <motion.span
              key={word + idx}
              className="text-gradient-teal-blue"
              variants={wordVariants}
            >
              {word}{" "}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Container for lamp effect */}
        <div className="relative mt-4 flex justify-center">
          {/* Glow backdrop for more lamp-like effect */}
          {showLine && (
            <motion.div 
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: shadowOpacity }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{ 
                width: lineWidth,
                height: "2px",
                bottom: "-5px",
                borderRadius: "50%",
                boxShadow: `0 0 ${shadowSize} ${shadowSize} ${lineColor}`,
                filter: "blur(3px)",
              }}
            />
          )}
          
          {/* Actual line */}
          {showLine && (
            <motion.div 
              className="relative z-10"
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              style={{ 
                height: lineHeight,
                backgroundColor: lineColor,
                borderRadius: "2px",
                boxShadow: `0 4px 8px -2px ${lineColor}`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};