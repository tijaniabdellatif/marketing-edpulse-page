export interface ITab {
  title: string;
  value: string;
  content: React.ReactNode;
}


export interface  TabContentWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}


export interface  BackgroundBeamsProps {
  children: React.ReactNode;
  className?: string;
}

export interface BioFormProps {
  visitorId: string;
  onComplete: () => void;
  onSkip: () => void;
}