"use client";

import React from 'react';
import { Boxes } from '../ui/background-boxes';
import { TextGenerateEffect } from '../ui/text-generate-effect';

export default function Hero() {

    return (
        <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <TextGenerateEffect words='Ready to Test Your Knowledge?' className='md:text-4xl text-xl text-white relative z-20' />
            <TextGenerateEffect words=' Dive into the ultimate quiz game and discover your true level!' className='text-center mt-2 text-neutral-300 relative z-20' />
        </div>
    );
}