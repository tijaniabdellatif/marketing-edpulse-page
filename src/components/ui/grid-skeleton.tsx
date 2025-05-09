"use client";

import React from "react";

export const Skeleton = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
        {children}
    </div>
);