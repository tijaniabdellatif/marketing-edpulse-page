'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface BackgroundBeamsProps {
  children: React.ReactNode;
  className?: string;
}

export function BackGroundBeams({ 
  children, 
  className 
}: BackgroundBeamsProps) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  // Update container size and set initial mouse position
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
      setMousePosition({ x: width / 2, y: height / 2 });
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      
      // Get mouse coordinates relative to container
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [containerSize]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative  w-full overflow-hidden bg-slate-200',
        className
      )}
    >
      {/* Primary beam - teal */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(38, 166, 154, 0.4), transparent 40%)`,
        }}
      />
      
      {/* Secondary beam - blue */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(26, 95, 122, 0.3), transparent 30%)`,
        }}
      />
      
      {/* Accent beam - coral */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 122, 0.2), transparent 25%)`,
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full 
              ${i % 5 === 0 ? 'bg-teal-primary/20' :
                i % 5 === 1 ? 'bg-blue-light/15' :
                i % 5 === 2 ? 'bg-coral-primary/10' :
                i % 5 === 3 ? 'bg-purple-primary/15' :
                'bg-yellow-primary/10'
              }`}
            initial={{
              x: Math.random() * containerSize.width,
              y: Math.random() * containerSize.height,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: [
                Math.random() * containerSize.width,
                Math.random() * containerSize.width,
                Math.random() * containerSize.width,
              ],
              y: [
                Math.random() * containerSize.height,
                Math.random() * containerSize.height,
                Math.random() * containerSize.height,
              ],
              scale: [0, Math.random() * 0.5 + 0.5, 0],
              opacity: [0, Math.random() * 0.3 + 0.1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              width: `${Math.random() * 10 + 10}px`,
              height: `${Math.random() * 10 + 10}px`,
            }}
          />
        ))}
      </div>
      
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(38, 166, 154, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(38, 166, 154, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}