"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Updated ThreeDMarquee with dark overlay
export const ThreeDMarqueeWithOverlay = ({
  images,
  className,
  overlayTitle = "",
  overlayDescription = "",
  buttonText = "Get Started",
  onButtonClick,
}: {
  images: string[];
  className?: string;
  overlayTitle?: string;
  overlayDescription?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}) => {
  // Split the images array into 4 equal parts
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });

  return (
    <div className="relative w-full">
      {/* Original ThreeDMarquee */}
      <div
        className={cn(
          "mx-auto block h-[600px] w-full overflow-hidden  max-sm:h-100",
          className,
        )}
      >
        {/* Existing marquee code... */}
        <div className="flex size-full items-center justify-center">
          <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
            <div
              style={{
                transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              }}
              className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-3d"
            >
              {chunks.map((subarray, colIndex) => (
                <motion.div
                  animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                  transition={{
                    duration: colIndex % 2 === 0 ? 10 : 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  key={colIndex + "marquee"}
                  className="flex flex-col items-start gap-8"
                >
                  <GridLineVertical className="-left-4" offset="80px" />
                  {subarray.map((image, imageIndex) => (
                    <div className="relative" key={imageIndex + image}>
                      <GridLineHorizontal className="-top-4" offset="20px" />
                      <motion.img
                        whileHover={{
                          y: -10,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        key={imageIndex + image}
                        src={image}
                        alt={`Image ${imageIndex + 1}`}
                        className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-2xl"
                        width={970}
                        height={700}
                      />
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Overlay - Full coverage with absolute positioning */}
      <div className="absolute inset-0">
        {/* Dark glassy background covering the entire component */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        {/* Content centered in the overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full p-8 flex flex-col items-center justify-center"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-white">{overlayTitle}</h2>
            <p className="text-center mb-8 text-gray-200 max-w-md mx-auto">{overlayDescription}</p>
            
            {/* Button wrapped with Tooltip */}
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white w-full max-w-md"
                    size="lg"
                    onClick={onButtonClick}
                  >
                    {buttonText}
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  className="text-base font-medium bg-gradient-to-r from-blue-600 to-teal-500 text-white border-none p-3 font-medium animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1"
                  side="top"
                  sideOffset={5}
                >
                  Click to register now and get full access
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// GridLineHorizontal and GridLineVertical components remain unchanged
const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  // Existing code...
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  // Existing code...
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};