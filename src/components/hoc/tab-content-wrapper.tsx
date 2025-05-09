import React from "react";
import { TabContentWrapperProps } from "@/types";
import { motion } from 'motion/react';

export function TabContentWrapper({
    title,
    children,
    className = ""
}: TabContentWrapperProps) {
    return (
        <motion.div
            className={`w-full rounded-xl bg-blue-primary/10 backdrop-blur-sm border border-teal-primary/20 p-6 md:p-8 shadow-lg ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold text-gradient-blue-teal mb-6">{title}</h2>
            {children}
        </motion.div>
    );
}