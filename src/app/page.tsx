"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Welcome } from "@/components/hoc/Welcome";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <>
         <AnimatePresence mode="wait">

              {showWelcome && <Welcome onComplete={() => setShowWelcome(false)} />}
              {!showWelcome && (
                 <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
               >
                <div>
                  Hello world
                </div>
                </motion.div>
              )}
         </AnimatePresence>
    </>
  );
}
