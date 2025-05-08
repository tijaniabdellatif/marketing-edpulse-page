import { Gamepad2, BookOpenCheck, Sparkles, LucideIcon } from 'lucide-react';

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