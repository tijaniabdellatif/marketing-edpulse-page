import {
  Gamepad2, BookOpenCheck, Sparkles, LucideIcon,
  Smile,
  DollarSign,
  CloudSun,
  Users,
  Headphones,
  ShieldCheck,
  Globe
} from 'lucide-react';
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

export const navItems = [


  { name: "About", link: "#about", icon: "ℹ️" },              // Info
  { name: "Services", link: "#services", icon: "🛠️" },         // Tools/Services
  { name: "Testimonials", link: "#testimonials", icon: "💼" },           // Professionalism/Work   // Knowledge/Experience
  { name: "Join us", link: "#joinus", icon: "📞" }             // Phone/Contact


];

export const features = [
  {
    title: "Expert Instructors",
    description:
      "Learn from certified native and bilingual English teachers who make lessons engaging and effective.",
    icon: <BookOpenCheck />,
  },
  {
    title: "Enjoyable Learning",
    description:
      "Interactive, fun, and practical classes that make learning English something to look forward to.",
    icon: <Smile />,
  },
  {
    title: "Affordable Plans",
    description:
      "Choose from flexible pricing options that suit your goals and budget — no hidden fees.",
    icon: <DollarSign />,
  },
  {
    title: "Reliable Access",
    description:
      "Join classes online or in-person with full confidence — we’re always available when you need us.",
    icon: <CloudSun />,
  },
  {
    title: "Group & Private Lessons",
    description:
      "Whether you prefer personal attention or the energy of group learning, we’ve got you covered.",
    icon: <Users />,
  },
  {
    title: "24/7 Support",
    description:
      "Have questions? Our team is here to help anytime, so you never feel stuck on your journey.",
    icon: <Headphones />,
  },
  {
    title: "Satisfaction Guaranteed",
    description:
      "We’re confident you’ll love your progress — or your money back, no hassle.",
    icon: <ShieldCheck />,
  },
  {
    title: "Global Community",
    description:
      "Join a vibrant international student community and unlock doors to the world.",
    icon: <Globe />,
  },
];