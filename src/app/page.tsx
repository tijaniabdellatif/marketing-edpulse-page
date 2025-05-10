"use client"
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { navItems } from "@/data/constants";
import { Navbar } from "@/components/navbar";
import LandingAbout from '@/components/hoc/landing-about';
import LandingFeatures from '@/components/hoc/landing-feature';
import Testimonials from '@/components/hoc/testimonials';
import LandingCta from '@/components/hoc/landing-cta';
import Footer from '@/components/hoc/landing-footer';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Welcome } from "@/components/hoc/Welcome";


const LandingHero = dynamic(
  () => import("@/components/hoc/landig-hero").then(mod => mod.LandingHero),
  {
    loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>,
    ssr: true
  }
);

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  return (

    <>
      <AnimatePresence mode="wait">
        {showWelcome && <Welcome onComplete={() => setShowWelcome(false)} />}

        {
          !showWelcome && (<main className="relative min-h-screen w-full overflow-x-hidden">

            <Navbar navItems={navItems} />


            <div className="w-full font-mulish-sans">

              <section className="w-full">
                <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                  <LandingHero />
                </Suspense>
              </section>


              <section className="w-full mt-0" id="about">
                <LandingAbout />
              </section>

              <section className="w-full mt-0 bg-slate-100" id="services">
                <LandingFeatures />
              </section>

              <section className="w-full mt-0 bg-slate-100" id="testimonials">
                <Testimonials />
              </section>

              <section className="w-full  mt-0 bg-slate-100" id="joinus">
                <LandingCta />
              </section>

              <Footer />
            </div>
          </main>)
        }

      </AnimatePresence>

    </>


  );
}