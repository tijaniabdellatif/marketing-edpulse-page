import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { gridItems } from "@/data/constants";
import { motion } from 'framer-motion';
import { LampContainer } from '@/components/ui/lamp';
import { TextHeading } from '../ui/text-heading';

const LandingFeatures = () => {
    return (
        <div className="w-full">
            {/* LampContainer with visible height */}
            <div className="w-full pt-4 h-[40vh] relative overflow-visible">
                <TextHeading
                    words="Explore our services"
                    className="text-center text-3xl md:text-6xl"
                    duration={0.7}
                    lineColor="#00897B"
                    lineWidth="20%"
                />
            </div>

            <div className="w-full mb-[10vh] relative z-20 bg-slate-100">
                <BentoGrid className='max-w-7xl mx-auto'>
                    {
                        gridItems.map((item, i) => (
                            <BentoGridItem
                                key={i}
                                title={item.title}
                                description={item.description}
                                header={item.header}
                                icon={item.icon}
                                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                            />
                        ))
                    }
                </BentoGrid>
            </div>
        </div>
    );
};

export default LandingFeatures;