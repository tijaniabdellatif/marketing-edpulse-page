import { TabContentWrapper } from '@/components/hoc/tab-content-wrapper';
import { Gamepad2, BookOpenCheck, Sparkles, LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PersonalInfoForm } from '@/components/hoc/personal-information';

// Define type for a tab
export interface MagicTab {
  title: string;
  value: string;
  content?: React.ReactNode;
}

// Quiz tabs configuration
export const magicTabs: MagicTab[] = [
  {
    title: "Personal Information",
    value: "personal-information",
    content: (
      <TabContentWrapper title="Tell us about yourself">
       <PersonalInfoForm onSkip={} onComplete={() => {}} />
      </TabContentWrapper>
    ),
  },
  {
    title: "About Yourself",
    value: "about-yourself",
    content: (
      <TabContentWrapper title="Tell us more about your learning goals">
        <div className="space-y-6">
          <div>
            <label className="block text-foreground mb-2" htmlFor="about">
              What do you hope to achieve with language learning?
            </label>
            <Textarea
              id="about"
              placeholder="I want to learn this language because..."
              className="h-32 bg-white/10 border-teal-primary/20"
            />
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="ghost" 
              className="text-light hover:text-white hover:bg-blue-primary/20"
            >
              Skip this step
            </Button>
            
            <Button 
              className="bg-teal-primary hover:bg-teal-dark text-white"
            >
              Next Step
            </Button>
          </div>
        </div>
      </TabContentWrapper>
    ),
  },
  {
    title: "Start Quiz",
    value: "start-quiz",
    content: (
      <TabContentWrapper title="Ready to begin your assessment?">
        <div className="space-y-6">
          <p className="text-foreground">
            Our quick assessment will help us understand your current language level 
            and personalize your learning journey.
          </p>
          
          <div className="bg-blue-primary/20 rounded-lg p-4 border border-teal-primary/20">
            <h3 className="text-lg font-medium text-white mb-2">What to expect:</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground">
              <li>5-10 minute assessment</li>
              <li>Mix of multiple choice and short answer questions</li>
              <li>Instant results and level placement</li>
              <li>Personalized learning path based on your results</li>
            </ul>
          </div>
          
          <motion.div 
            className="p-4 rounded-lg bg-yellow-primary/10 border border-yellow-primary/20 text-foreground"
            initial={{ opacity: 0.8 }}
            animate={{ 
              opacity: [0.8, 1, 0.8],
              y: [0, -3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <p>
              <span className="font-medium text-yellow-primary">Note:</span> You can skip this assessment and take it later if you prefer.
            </p>
          </motion.div>
          
          <div className="flex justify-between items-center mt-8">
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Link href="/dashboard">
                  <Button 
                    className="bg-coral-primary hover:bg-coral-dark text-white relative group overflow-hidden pl-4 pr-10"
                  >
                    Skip Quiz
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      animate={{ 
                        x: [0, 3, 0] 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </Link>
                
                {/* Subtle pulsing effect behind the skip button */}
                <motion.div
                  className="absolute -inset-1 rounded-md bg-gradient-to-r from-coral-primary/30 to-yellow-primary/30 -z-10 blur"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    scale: [0.98, 1.01, 0.98],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                />
              </motion.div>
            </div>
            
            <Button 
              className="bg-teal-primary hover:bg-teal-dark text-white"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </TabContentWrapper>
    ),
  },
];

// Define the Step interface with Lucide icon type
export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    icon: Gamepad2,
    title: "Start with a Game",
    description: "Take our fun language challenge to discover your level",
  },
  {
    icon: BookOpenCheck,
    title: "Get Your Assessment",
    description: "Receive a personalized learning path based on your score",
  },
  {
    icon: Sparkles,
    title: "Unlock Your Language Journey",
    description: "Join our courses and grow your skills with confidence",
  },
];