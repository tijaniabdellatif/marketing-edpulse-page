"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
      
        
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          404
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl font-medium text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Oups, we have a problem!
        </motion.p>
      </motion.div>

      <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600 text-center">
              The page you're looking for has drifted into deep space or never existed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
              <Link href="/" className="w-full sm:w-auto">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Return to Home
                </Button>
              </Link>
              
              <Link href="/contact" className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 font-medium px-6 py-2 rounded-full transition-all duration-300"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </CardContent>
      </Card>
      
      <motion.div
        className="mt-8 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Lost? Try searching our site or browse popular categories below</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {['Home', 'About', 'Courses', 'Blog', 'FAQ'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`}
              className="px-3 py-1 bg-white/50 hover:bg-white rounded-full text-xs text-gray-600 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}