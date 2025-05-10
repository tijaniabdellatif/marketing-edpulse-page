"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Check } from "lucide-react";
import { motion } from "motion/react";


const FooterColumn = ({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialIcon = ({
  icon: Icon,
  href,
}: {
  icon: any;
  href: string;
}) => (
  <Link href={href} target="_blank" rel="noopener noreferrer">
    <div className="flex items-center group justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-zinc-200 hover:to-teal-700 transition-colors duration-500">
      <Icon className="w-5 h-5 text-gray-200 group-hover:text-zinc-900 transition-colors duration-500" />
    </div>
  </Link>
);

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted email:", email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 pr-12"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className={cn(
            "absolute right-1 top-1 h-8",
            isSubmitted
              ? "text-green-400 hover:text-green-400"
              : "text-blue-400 hover:text-blue-300"
          )}
          disabled={isSubmitted}
        >
          {isSubmitted ? <Check className="h-4 w-4" /> : "Subscribe"}
        </Button>
      </div>
      {isSubmitted && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-green-400"
        >
          Thank you for subscribing!
        </motion.p>
      )}
    </form>
  );
};

const Footer = () => {
  // Navigation links to match your site structure
  const companyLinks = [
    { label: "About Us", href: "#about" },
    { label: "Our Services", href: "#team" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ];

  const serviceLinks = [
    { label: "Online Courses", href: "#courses" },
    { label: "Tutorials", href: "#tutorials" },
    { label: "Mentorship", href: "#mentorship" },
    { label: "Workshops", href: "#workshops" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-slate-100 font-mulish-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Company Name and Logo */}
          <div className="space-y-4">
           
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                EdPulse Education
              </h2>
           
            <p className="text-gray-400 mt-4">
              Empowering the next generation through innovative and accessible education.
            </p>
          </div>

          {/* Column 2 - Company Links */}
          <FooterColumn title="Company" items={companyLinks} />

          {/* Column 3 - Services Links */}
          <FooterColumn title="Services" items={serviceLinks} />

          {/* Column 4 - Subscribe */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100">Subscribe</h3>
              <p className="text-gray-400 text-sm">
                Get the latest updates and offers from EdPulse.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-gray-800" />

        {/* Bottom section with copyright and social icons */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-500 text-sm">
            © {currentYear} EdPulse Education. All rights reserved.
          </div>

          <div className="flex space-x-3">
            <SocialIcon icon={Facebook} href="https://facebook.com" />
            <SocialIcon icon={Instagram} href="https://instagram.com" />
            <SocialIcon icon={Twitter} href="https://twitter.com" />
            <SocialIcon icon={Linkedin} href="https://linkedin.com" />
            <SocialIcon icon={Mail} href="mailto:info@edpulse.com" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;