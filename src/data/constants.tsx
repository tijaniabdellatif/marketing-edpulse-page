import {
  Gamepad2, BookOpenCheck, Sparkles, LucideIcon,
  Smile,
  DollarSign,
  CloudSun,
  Users,
  Headphones,
  ShieldCheck,
  Globe,
  GraduationCap,
  Laptop,
  PenTool,
  MessageSquare,
  BookOpen,
  FileText,
  Compass
} from 'lucide-react';
import { Skeleton } from '@/components/ui/grid-skeleton';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export interface MagicTab {
  title: string;
  value: string;
  content?: React.ReactNode;
}

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

export const gridItems = [
  {
    title: "English for All Levels",
    description: "Beginner to advanced — we tailor classes to match your current skills and goals.",
    header: <Skeleton>
      <img className='object-fit h-[100%] w-[100%]' src="/level.png" alt="english level" />
    </Skeleton>,
    icon: <GraduationCap className="h-4 w-4 text-[#00897B]" />,
  },
  {
    title: "Online & In-Person Classes",
    description: "Learn your way, anytime — join virtual or classroom sessions from anywhere.",
    header: <Skeleton> <img className='object-fit h-[100%] w-[100%]' src="/online.jpg" alt="online in person" /></Skeleton>,
    icon: <Laptop className="h-4 w-4 text-[#00897B]" />,
  },
  {
    title: "Academic & Exam Prep",
    description: "Prepare for TOEFL, IELTS, and school exams with expert guidance.",
    header: <Skeleton> <img className='object-fit h-[100%] w-[100%]' src="/exam.avif" alt="online in person" /></Skeleton>,
    icon: <BookOpen className="h-4 w-4 text-[#00897B]" />,
  },
  {
    title: "Conversation Practice",
    description: "Boost your speaking skills with real-life dialogues and fluent expression.",
    header: <Skeleton> <img className='object-fit h-[100%] w-[100%]' src="/conversation.jpg" alt="online in person" /></Skeleton>,
    icon: <MessageSquare className="h-4 w-4 text-[#00897B]" />,
  },
  {
    title: "Business English",
    description: "Speak confidently at work with vocabulary and skills tailored to professionals.",
    header:  <Skeleton> <img className='object-fit h-[100%] w-[100%]' src="/business.jpg" alt="online in person" /></Skeleton>,
    icon: <FileText className="h-4 w-4 text-[#00897B]" />,
  },
  {
    title: "Writing & Grammar Workshops",
    description: "Master English structure and style through engaging writing sessions.",
    header: <Skeleton> <img className='object-fit h-[100%] w-[100%]' src="/workshop.png" alt="online in person" /></Skeleton>,
    icon: <PenTool className="h-4 w-4 text-[#00897B]" />,
  },
  {
    title: "Cultural Exchange Programs",
    description: "Explore new cultures and practice English in real-world settings.",
    header: <Skeleton> <img className='object-fit h-[100%] w-[100%]' src="/exchange.jpg" alt="online in person" /></Skeleton>,
    icon: <Compass className="h-4 w-4 text-[#00897B]" />,
  },
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    text: "This platform completely changed how I work. The interface is clean, and the support team is incredibly responsive!",
    username: "@sarahj",
    image: Avatar
  },
  {
    name: "Daniel Lee",
    text: "Amazing experience! Everything just works out of the box and helped me boost my productivity.",
    username: "@daniellee",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Fatima Zahra",
    text: "I love how intuitive and user-friendly the platform is. It made a big difference for my small business.",
    username: "@fatimazahra",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "James Carter",
    text: "Reliable, fast, and easy to use. Highly recommend it to anyone looking for a modern solution.",
    username: "@jamescarter",
   image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Linda Nguyen",
    text: "Excellent value and outstanding customer service. I felt supported every step of the way.",
    username: "@lindanguyen",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Carlos Rivera",
    text: "Their attention to detail and care for the user experience is unmatched. I'm a fan for life!",
    username: "@carlosr",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Emily Chen",
    text: "The onboarding was super smooth and quick. I was up and running in no time!",
    username: "@emchen",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Mohamed El Amrani",
    text: "What I appreciate most is the team's willingness to listen to feedback and constantly improve.",
    username: "@moamrani",
   image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Isabelle Martin",
    text: "The clean UI and seamless workflow have been a game-changer for my projects.",
    username: "@isabelle.m",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Ali Khan",
    text: "I’ve tried many tools before, but none offered the balance of power and simplicity like this one.",
    username: "@alikhan",
   image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Nina Petrova",
    text: "This platform helps me stay organized and focused every single day. Love it!",
    username: "@ninap",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  },
  {
    name: "Tom Becker",
    text: "Every update brings something new and useful. The team really listens to what users need.",
    username: "@tbecker",
    image: <Avatar>
      <AvatarImage src="/avatar.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  }
];

export type TestimonialsType = typeof testimonials;