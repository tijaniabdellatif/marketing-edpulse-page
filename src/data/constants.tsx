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