"use client";
import React from 'react';
import { motion } from 'framer-motion'; 
import { LampContainer } from '../ui/lamp';
import { Features } from './sub-components/features';

const LandingAbout = () => {
    return (
        <div className="w-full">
           
            <div className="w-full h-[60vh] relative overflow-visible">
                <LampContainer 
                    className="w-full"
                    height="min-h-[60vh]"
                    translateY="-translate-y-40"
                    bgColor="bg-slate-100"
                >
                    <motion.h1
                        initial={{ opacity: 0.5, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        className="mt-4 text-gradient-teal-blue py-2 text-center text-3xl font-medium tracking-tight md:text-6xl"
                    >
                        Why choose <br /> Edpulse
                    </motion.h1>
                </LampContainer>
            </div>
            
           
            <div className="w-full mt-[-10vh] relative z-20 bg-slate-100">
                <Features />
            </div>
        </div>
    );
}

export default LandingAbout;