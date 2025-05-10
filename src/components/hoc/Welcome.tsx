"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from "@/lib/animations";
import { steps } from "@/data/constants";
import { BackgroundLines } from "../ui/background-lines";
import { ColourfulText } from "../ui/colourful-text";

interface WelcomeProps {
  onComplete: () => void;
}

export function Welcome({ onComplete }: WelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else if (currentStep === steps.length - 1) {
        setIsComplete(true);
        timerRef.current = setTimeout(() => onComplete(), 2000);
      }
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden font-mulish-sans">
      <BackgroundLines
        className="absolute inset-0 w-full h-full bg-blue-dark"
        svgOptions={{
          duration: 15,
          lineCount: 30,
          opacity: 0.2
        }}
      >
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={`step-${currentStep}`}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {currentStep < steps.length && (
                    <>
                      <motion.div
                        className="mb-8 inline-block"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 3, -3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      >

                        <div className="w-20 h-20 rounded-full bg-teal-primary flex items-center justify-center mx-auto shadow-md">
                          {(() => {
                            const Icon = steps[currentStep]!.icon;
                            return <Icon className="w-10 h-10 text-white" />;
                          })()}
                        </div>
                      </motion.div>


                      <motion.h1
                        className="text-gradient-blue-teal text-4xl md:text-5xl font-bold mb-6 text-shadow-sm"
                        variants={fadeIn}
                        initial="hidden"
                        animate="show"
                      >
                        {steps[currentStep]!.title}
                      </motion.h1>


                      <motion.p
                        className="text-xl text-white max-w-2xl mx-auto"
                        variants={fadeIn}
                        initial="hidden"
                        animate="show"
                      >
                        {steps[currentStep]!.description}
                      </motion.p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut"
                  }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-8">
                    <div className="relative w-full h-full">

                      <div className="absolute inset-0 border-t-2 border-r-2 border-coral-primary rounded-full animate-spin" />
                      <div className="absolute inset-2 border-t-2 border-l-2 border-coral-primary/50 rounded-full animate-spin-slow" />
                      <div className="absolute inset-4 border-b-2 border-r-2 border-coral-primary/30 rounded-full animate-spin-slower" />
                    </div>
                  </div>
                  <p className="text-3xl font-medium text-white animate-pulse">
                    Preparing your <ColourfulText className="text-3xl" text="language journey" />
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </BackgroundLines>
    </div>
  );
}