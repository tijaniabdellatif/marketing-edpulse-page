"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type Tab = {
  title: string;
  value: string;
  content?: React.ReactNode;
};

interface MagicTabProps {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  activeTabIndex?: number;
  onTabChange?: (index: number) => void;
}

export const MagicTab = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  activeTabIndex = 0,
  onTabChange
}: MagicTabProps) => {
  const [active, setActive] = useState<Tab>(propTabs[activeTabIndex] || propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>([...propTabs]);
  const [hovering, setHovering] = useState(false);
  
  // Update active tab when activeTabIndex prop changes
  useEffect(() => {
    if (activeTabIndex >= 0 && activeTabIndex < propTabs.length) {
      const selectedTab = propTabs[activeTabIndex];
      setActive(selectedTab);
      
      // Recreate tabs array with selected tab first
      const newTabs = [...propTabs];
      const selectedTabIndex = newTabs.findIndex(tab => tab.value === selectedTab.value);
      
      if (selectedTabIndex !== -1) {
        const [movedTab] = newTabs.splice(selectedTabIndex, 1);
        newTabs.unshift(movedTab);
        setTabs(newTabs);
      }
    }
  }, [activeTabIndex, propTabs]);
  
  const moveSelectedTabToTop = (idx: number) => {
    if (idx < 0 || idx >= propTabs.length) return;
    
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
    
    // Call onTabChange callback if provided
    if (onTabChange) {
      onTabChange(idx);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-center py-5 relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <motion.button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("relative px-4 py-1 rounded-full cursor-pointer", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full",
                  activeTabClassName
                )}
              />
            )}
            
            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </motion.button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn("mt-20", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  active,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 10, 0] : 0, // Reduced bounce effect
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};