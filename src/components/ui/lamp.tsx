"use client";
import React from "react";
import { motion } from "framer-motion"; // Fixed import
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
  bgColor = "bg-slate-100",
  lampColor = "bg-cyan-400",
  translateY = "-translate-y-80", // Added customizable y-translation
  height = "min-h-screen", // Added customizable height
}: {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  lampColor?: string;
  translateY?: string; // For controlling child content position
  height?: string; // For controlling container height
}) => {
  // Extract the color name for gradient use
  const lampColorName = lampColor.replace('bg-', '');
  
  return (
    <div
      className={cn(
        `relative flex ${height} flex-col items-center justify-center overflow-hidden ${bgColor} w-full rounded-md z-0`,
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className={`absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-${lampColorName} via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]`}
        >
          <div className={`absolute w-[100%] left-0 ${bgColor} h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]`} />
          <div className={`absolute w-40 h-[100%] left-0 ${bgColor} bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]`} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className={`absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-${lampColorName} text-white [--conic-position:from_290deg_at_center_top]`}
        >
          <div className={`absolute w-40 h-[100%] right-0 ${bgColor} bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]`} />
          <div className={`absolute w-[100%] right-0 ${bgColor} h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]`} />
        </motion.div>
        <div className={`absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 ${bgColor} blur-2xl`}></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className={`absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full ${lampColor} opacity-50 blur-3xl`}></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={`absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full ${lampColor} blur-2xl`}
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={`absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] ${lampColor}`}
        ></motion.div>

        <div className={`absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] ${bgColor}`}></div>
      </div>

      <div className={`relative z-50 flex ${translateY} flex-col items-center px-5`}>
        {children}
      </div>
    </div>
  );
};