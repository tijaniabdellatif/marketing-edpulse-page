import { TabContentWrapper } from '@/components/hoc/tab-content-wrapper';
import { Gamepad2, BookOpenCheck, Sparkles, LucideIcon } from 'lucide-react';

export const magicTabs = [

     {
      title:"Personel Informations",
      value:"personal informations",
      content:(
        <TabContentWrapper title='Personel Informations'>
                 <div className=''>content</div>
        </TabContentWrapper>
      )
     },
     {
      title:"Grammar",
      value:"grammar",
      content:(
        <TabContentWrapper title='Grammar'>
                 <div className=''>grammar</div>
        </TabContentWrapper>
      )
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