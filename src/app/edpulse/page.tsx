import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { navItems } from "@/data/constants";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

// Use named import instead of default
const LandingHero = dynamic(
  () => import("@/components/hoc/landig-hero").then(mod => mod.LandingHero), 
  {
    loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>,
    ssr: true
  }
);

export default function Landing() {
  return (
    <main className={cn([
      'relative overflow-clip mx-auto',
      'flex flex-col justify-center items-center',
      "min-h-screen"
    ])}>
      <div className='w-full relative z-10'>
        <Navbar navItems={navItems} />
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <LandingHero />
        </Suspense>
      </div>
    </main>
  );
}
