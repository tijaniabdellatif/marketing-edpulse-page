"use client";
import React from 'react'

import { MobileNavbar } from '@/components/mobile-navbar';
import { Navbar } from '@/components/navbar';

const ResponsiveNavbar = () => {
  return (
    <div>

      <Navbar />
      <MobileNavbar />

    </div>
  )
}

export default ResponsiveNavbar
