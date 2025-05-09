"use client";
import { BackGroundBeams } from "../ui/background-beams";
import { MagicTab } from "../ui/magic-tab";
import { magicTabs } from "@/data/constants";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getVisitorId, saveVisitorId } from '@/lib/utils';
import { PersonalInfoForm } from '@/components/hoc/personal-information';
import { ITab } from "@/types";
import { TabContentWrapper } from "./tab-content-wrapper";
import { motion } from 'framer-motion';

export default function QuizLayout() {

    const router = useRouter();
    const [visitorId, setVisitorId] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [tabs, setTabs] = useState<ITab[]>([]);

    useEffect(() => {


        const tabsConfig = [
            {
                title: "Personal Information",
                value: "personal-information",
                content: (
                    <TabContentWrapper title="Tell us about yourself">
                        <PersonalInfoForm
                            onComplete={handlePersonalInfoComplete}
                            onSkip={handleSkipStep}
                        />
                    </TabContentWrapper>
                ),
            },

            {
                title: "About Yourself",
                value: "about-yourself",
                content: (
                    <TabContentWrapper title="Tell us more about your learning goals">
                        <h1>Bio form</h1>
                    </TabContentWrapper>
                ),
            }
        ];

        setTabs(tabsConfig);
    }, [visitorId])

    useEffect(() => {
        const id = getVisitorId();
        if (id) {
            setVisitorId(id);
        }
    }, []);

    // Handle completion of personal info form
    const handlePersonalInfoComplete = (id: string) => {
        setVisitorId(id);
        moveToNextStep();
    };

    // Handle completion of bio form
    const handleBioComplete = () => {
        moveToNextStep();
    };

    // Handle start quiz button
    const handleStartQuiz = () => {
        router.push('/quiz/questions');
    };


    const handleSkipQuiz = () => {
        router.push('/dashboard');
    };


    const handleSkipStep = () => {
        moveToNextStep();
    };

    // Helper to move to next tab
    const moveToNextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 2)); // Max of 2 (0-indexed)
    };

    // MagicTab helper
    const selectTab = (index: number) => {
        setCurrentStep(index);
    };

    return (
       <main className="relative h-[50rem] z-50">
         <BackGroundBeams>
            <div className="h-[40rem] md:h-[60rem] [perspective:1000px] relative flex flex-col max-w-6xl mx-auto w-full items-start justify-start">
                <div className="mt-4">
                    <h2 className="text-2xl py-5 relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                        What's brighter than your future?{" "}
                        <div className="relative mx-auto  inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-teal-primary via-blue-primary to-teal-primary [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                <span className="">Start with a quick catch.</span>
                            </div>
                            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-teal-primary via-blue-primary to-teal-primary py-4">
                                <span className="">Start with a quick catch.</span>
                            </div>
                        </div>
                    </h2>
                </div>

                {/* Progress indicators */}
                <div className="w-full flex my-5 justify-center">
                    <div className="flex items-center space-x-4">
                        {[0, 1, 2].map((step) => (
                            <motion.div
                                key={step}
                                className={`w-3 h-3 rounded-full ${step <= currentStep
                                        ? "bg-teal-primary"
                                        : "bg-blue-primary/30"
                                    }`}
                                initial={{ scale: step === currentStep ? 0.8 : 1 }}
                                animate={{
                                    scale: step === currentStep ? [0.8, 1.2, 0.8] : 1,
                                    opacity: step <= currentStep ? 1 : 0.5
                                }}
                                transition={{
                                    scale: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Main content area with current tab */}
                <div className="w-full h-full">
                    {tabs.length > 0 && (
                        <MagicTab
                            tabs={tabs}
                            activeTabClassName="bg-teal-primary"
                            tabClassName="text-white mx-1 font-medium"
                            onTabChange={selectTab}
                            activeTabIndex={currentStep}
                        />
                    )}
                </div>
            </div>
        </BackGroundBeams>
       </main>


    )
}