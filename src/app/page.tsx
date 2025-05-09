"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Welcome } from "@/components/hoc/Welcome";
import Hero from "@/components/hoc/Hero";
import QuizLayout from "@/components/hoc/quiz-layout";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <>
          {/* <AnimatePresence mode="wait"> */}

              {/* {showWelcome && <Welcome onComplete={() => setShowWelcome(false)} />}  */}
               {/* {!showWelcome && ( */}
                 <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative"
               >
                <div className="w-full relative z-30 font-mulish-sans">
                  <Hero />
                  <QuizLayout />
                </div>
                </motion.div>
          {/* </AnimatePresence> */}
    </>
  );
}
