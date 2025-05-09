import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/constants";
import LandingHero from "@/components/hoc/landig-hero";

export default function Landing() {

  return (
    <main className={cn([
      'relative overflow-clip mx-auto sm:px-10 px-5',
      'flex flex-col justify-center items-center',
       "min-h-screen"
    ])}>

      <div className='max-w-7xl w-full relative z-10'>
        <Navbar navItems={navItems} />
        <LandingHero />
        
      </div>

    </main>
  );
}