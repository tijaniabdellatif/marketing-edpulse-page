"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThreeDMarqueeWithOverlay } from '../ui/3d-section';
import { GlassModal } from './sub-components/glass-modal';

const LandingCta = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const images = [
        "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
        "https://assets.aceternity.com/animated-modal.png",
        "https://assets.aceternity.com/animated-testimonials.webp",
        "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
        "https://assets.aceternity.com/github-globe.png",
        "https://assets.aceternity.com/glare-card.png",
        "https://assets.aceternity.com/layout-grid.png",
        "https://assets.aceternity.com/flip-text.png",
        "https://assets.aceternity.com/hero-highlight.png",
        "https://assets.aceternity.com/carousel.webp",
        "https://assets.aceternity.com/placeholders-and-vanish-input.png",
        "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
        "https://assets.aceternity.com/signup-form.png",
        "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
        "https://assets.aceternity.com/spotlight-new.webp",
        "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
        "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
        "https://assets.aceternity.com/tabs.png",
        "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
        "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
        "https://assets.aceternity.com/glowing-effect.webp",
        "https://assets.aceternity.com/hover-border-gradient.png",
        "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
        "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
        "https://assets.aceternity.com/macbook-scroll.png",
        "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
        "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
        "https://assets.aceternity.com/multi-step-loader.png",
        "https://assets.aceternity.com/vortex.png",
        "https://assets.aceternity.com/wobble-card.png",
        "https://assets.aceternity.com/world-map.webp",
    ];
    
    return (
        <div className="overflow-x-clip bg-slate-100 overflow-hidden  font-mulish-sans">
            <div className="max-w-[540px] mx-auto pricing-head_before relative">
                <div className="flex justify-center py-4"></div>
                <h2 className={cn([
                    'text-center',
                    'text-gradient-blue-teal',
                    'text-3xl lg:text-6xl md:text-4xl py-2 font-semibold tracking-tighter'
                ])}>Join us Today</h2>
                <p className={cn([
                    'text-center my-4 text-base leading-7 tracking-tight',
                    "md:text-[18px] md:text-center md:leading-8 lg:text-1xl lg:leading-10 text-color-dark font-poppins"
                ])}>
                    Unlock your potential
                </p>
            </div>

            <div className="mx-auto w-full font-mulish-sans">
                <ThreeDMarqueeWithOverlay 
                    images={images} 
                    overlayTitle="Join Our Language Center" 
                    overlayDescription="Unlock your potential with expert-led English courses designed for real-world success.Start speaking with confidence — your journey begins here." 
                    buttonText="Get Started Now" 
                    onButtonClick={() => setIsModalOpen(true)}
                />
            </div>
            
      
            <GlassModal 
                isOpen={isModalOpen} 
                onOpenChange={setIsModalOpen}
                title="Sign Up for Early Access"
                description="Create your account get a personnalized learning path"
            />
        </div>
    );
};

export default LandingCta;