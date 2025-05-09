"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BackgroundGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: "small" | "medium" | "large";
  interactive?: boolean;
  containerClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

export const BackgroundGradient = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "80, 210, 255",
  thirdColor = "232, 213, 255",
  fourthColor = "129, 0, 255",
  fifthColor = "55, 0, 179",
  pointerColor = "140, 100, 255",
  size = "medium",
  interactive = true,
  containerClassName,
  className,
  children,
  ...props
}: BackgroundGradientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [interacting, setInteracting] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [cursorMoved, setCursorMoved] = useState(false);

  const updateGradient = (x: number, y: number) => {
    if (!cursorMoved) {
      setCursorMoved(true);
    }
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const relativeX = x - containerRect.left;
      const relativeY = y - containerRect.top;
      setCursorPosition({ x: relativeX, y: relativeY });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!interacting && interactive) {
        updateGradient(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [interacting, interactive]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (interacting || !cursorMoved) return;
      setPointerPosition((prev) => {
        return {
          x: cursorPosition.x,
          y: cursorPosition.y,
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [interacting, cursorPosition, cursorMoved]);

  const handleMouseEnter = () => {
    setInteracting(true);
  };

  const handleMouseLeave = () => {
    setInteracting(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interacting) {
      updateGradient(e.clientX, e.clientY);
      setPointerPosition({ x: e.clientX, y: e.clientY });
    }
  };

  let sizeClass = "w-[200px] h-[200px]";
  switch (size) {
    case "small":
      sizeClass = "w-[160px] h-[160px]";
      break;
    case "medium":
      sizeClass = "w-[400px] h-[400px]";
      break;
    case "large":
      sizeClass = "w-[600px] h-[600px]";
      break;
    default:
      break;
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg",
        containerClassName
      )}
      style={{
        background: `linear-gradient(to bottom right, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
      }}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-[0.4]",
          interacting ? "opacity-[0.65]" : "opacity-[0.4]"
        )}
        style={{
          background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(${pointerColor}, 0.8) 0%, rgba(${pointerColor}, 0) 70%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-[0.4]",
          interacting ? "opacity-[0.65]" : "opacity-[0.4]"
        )}
        style={{
          background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(${firstColor}, 0.8) 0%, rgba(${firstColor}, 0) 50%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-[0.4]",
          interacting ? "opacity-[0.65]" : "opacity-[0.4]"
        )}
        style={{
          background: `radial-gradient(circle at ${pointerPosition.x}px ${pointerPosition.y}px, rgba(${secondColor}, 0.8) 0%, rgba(${secondColor}, 0) 50%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-[0.4]",
          interacting ? "opacity-[0.65]" : "opacity-[0.4]"
        )}
        style={{
          background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(${thirdColor}, 0.8) 0%, rgba(${thirdColor}, 0) 50%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-[0.4]",
          interacting ? "opacity-[0.65]" : "opacity-[0.4]"
        )}
        style={{
          background: `radial-gradient(circle at ${pointerPosition.x}px ${pointerPosition.y}px, rgba(${fourthColor}, 0.8) 0%, rgba(${fourthColor}, 0) 50%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-[0.4]",
          interacting ? "opacity-[0.65]" : "opacity-[0.4]"
        )}
        style={{
          background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(${fifthColor}, 0.8) 0%, rgba(${fifthColor}, 0) 50%)`,
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};