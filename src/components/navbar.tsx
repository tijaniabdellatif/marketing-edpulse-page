import { cn } from '@/lib/utils'
import React from 'react'

export const Navbar = () => {
  return (
    <div className={cn([
    'w-full transition-all duration-200 h-[12vh] z-[1000'
    ])}>

        <div className='flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto'>

            <h1 className='text-xl md:text-2xl font-bold'><span className='text-3xl md:text-4xl text-gradient-blue-teal'>E</span>pulse</h1>
        </div>
    </div>
  )
}

