"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
    lineCount?: number;
    opacity?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "h-[20rem] md:h-screen w-full bg-blue-dark relative overflow-hidden",
        className
      )}
    >
      <SVG svgOptions={svgOptions} />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

const SVG = ({
  svgOptions,
}: {
  svgOptions?: {
    duration?: number;
    lineCount?: number;
    opacity?: number;
  };
}) => {
  
  const generateAngularPaths = (count: number) => {
    const paths = [];
    
    for (let i = 0; i < count; i++) {
      let x = Math.random() * 1440;
      let y = Math.random() * 900;
      let path = `M${x} ${y}`;
      const segments = Math.floor(Math.random() * 3) + 3;
      
      for (let j = 0; j < segments; j++) {
        const isHorizontal = Math.random() > 0.5;
        const length = Math.random() * 500 + 200;
        
        if (isHorizontal) {
          x += (Math.random() > 0.5 ? 1 : -1) * length;
          
          x = Math.max(-200, Math.min(x, 1640));
        } else {
          y += (Math.random() > 0.5 ? 1 : -1) * length;

          y = Math.max(-200, Math.min(y, 1100));
        }
        
        path += ` L${x} ${y}`;
      }
      
      paths.push(path);
    }
    
    return paths;
  };

  const colors = [
    "var(--teal-primary)",     // #26A69A - Teal
    "var(--teal-light)",       // #4DB6AC - Light teal
    "var(--accent)",           // #4DD0E1 - Cyan
    "var(--blue-light)",       // #1A5F7A - Navy blue
    "var(--coral-primary)",    // #FF6B7A - Coral
    "var(--yellow-primary)",   // #FFD54F - Yellow
    "var(--purple-primary)",   // #9C62FF - Purple
    "var(--orange-primary)",   // #FF9642 - Orange
    "var(--mint-primary)",     // #A5D6A7 - Mint green
  ];
  
  const lineCount = svgOptions?.lineCount || 30;
  const duration = svgOptions?.duration || 15;
  const maxOpacity = svgOptions?.opacity || 0.25; 
  const paths = generateAngularPaths(lineCount);

  const createLines = () => {
    return paths.map((path, idx) => {
      const delay = idx * 0.1; 
      
      return (
        <motion.path
          key={`path-${idx}`}
          d={path}
          stroke={colors[idx % colors.length]}
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeDasharray="40 200"
          initial={{ opacity: 0, strokeDashoffset: 1000 }}
          animate={{ 
            opacity: [0, maxOpacity, maxOpacity, 0],
            strokeDashoffset: [1000, 0]
          }}
          transition={{
            opacity: {
              duration: duration,
              times: [0, 0.1, 0.9, 1],
              repeat: Infinity,
              repeatType: "loop",
              delay: delay,
              ease: "linear"
            },
            strokeDashoffset: {
              duration: duration,
              repeat: Infinity,
              repeatType: "loop",
              delay: delay,
              ease: "linear"
            }
          }}
        />
      );
    });
  };
  
  const createAlternateLines = () => {
    return paths.slice(0, Math.floor(paths.length / 2)).map((path, idx) => {
      const modifiedPath = path.split(' ').map((part, i) => {
        if (i > 0 && !isNaN(parseFloat(part))) {
          return (parseFloat(part) + (Math.random() * 30 - 15)).toFixed(2);
        }
        return part;
      }).join(' ');
      
      const delay = idx * 0.1 + 1; 
      const lowerOpacity = maxOpacity * 0.8; 
      
      return (
        <motion.path
          key={`path-alt-${idx}`}
          d={modifiedPath}
          stroke={colors[(idx + 4) % colors.length]}
          strokeWidth="1.2"
          strokeLinecap="square"
          strokeDasharray="40 200"
          initial={{ opacity: 0, strokeDashoffset: 1000 }}
          animate={{ 
            opacity: [0, lowerOpacity, lowerOpacity, 0],
            strokeDashoffset: [1000, 0]
          }}
          transition={{
            opacity: {
              duration: duration,
              times: [0, 0.1, 0.9, 1],
              repeat: Infinity,
              repeatType: "loop",
              delay: delay,
              ease: "linear"
            },
            strokeDashoffset: {
              duration: duration,
              repeat: Infinity,
              repeatType: "loop",
              delay: delay,
              ease: "linear"
            }
          }}
        />
      );
    });
  };

  return (
    <motion.svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 1 }}
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {createLines()}
      {createAlternateLines()}
    </motion.svg>
  );
};