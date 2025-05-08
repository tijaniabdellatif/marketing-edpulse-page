"use client";
import { BackGroundBeams } from "../ui/background-beams";
import { MagicTab } from "../ui/magic-tab";
import { magicTabs } from "@/data/constants";

export default function QuizLayout() {

    return (
        <BackGroundBeams className="mt-2">
            <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-6xl mx-auto w-full  items-start justify-start my-30">
                <div className="py-4">
                    <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                        What’s brighter than your future?{" "}
                        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                <span className="">Start with a quick catch.</span>
                            </div>
                            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                                <span className="">Start with a quick catch.</span>
                            </div>
                        </div>
                    </h2>
                </div>
                <MagicTab  tabs={magicTabs} />
            </div>
        </BackGroundBeams>

    )
}