
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { navItems } from "@/data/constants";
import { Navbar } from "@/components/navbar";
import LandingAbout from '@/components/hoc/landing-about';


const LandingHero = dynamic(
  () => import("@/components/hoc/landig-hero").then(mod => mod.LandingHero), 
  {
    loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>,
    ssr: true
  }
);

export default function Landing() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
     
      <Navbar navItems={navItems} />
      
     
      <div className="w-full">
      
        <section className="w-full">
          <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
            <LandingHero />
          </Suspense>
        </section>
        
      
        <section className="w-full mt-0" id="about">
          <LandingAbout />
        </section>
      </div>
    </main>
  );
}