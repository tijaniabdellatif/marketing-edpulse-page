import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { gridItems } from "@/data/constants";
import { cn } from '@/lib/utils';

const LandingFeatures = () => {
    return (

        <div className="overflow-x-clip  bg-slate-100 overflow-hidden  py-10 md:py-12 pb-20 font-mulish-sans">
            
            <div className="max-w-[540px] mx-auto pricing-head_before relative">
                     <div className="flex justify-center py-4">
                      
                     </div>
                     <h2 className={cn([
                       'text-center',
                       'text-gradient-blue-teal',
                       'text-3xl lg:text-6xl md:text-4xl py-2 font-semibold tracking-tighter'
                     ])}>Explore our services</h2>
                     <p className={cn([
                       'text-center my-4 text-base leading-7 tracking-tight',
                       "md:text-[18px] md:text-center md:leading-8 lg:text-1xl lg:leading-10 text-color-dark font-poppins"
                     ])}>
                       See beyond the language, explore our capabilities
           
                     </p>
           
           
           
           
            </div>

            <div className="w-full pb-[10vh] relative z-20 bg-slate-100">
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