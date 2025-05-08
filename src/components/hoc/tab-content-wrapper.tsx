import React from "react";

export const TabContentWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => {
    return (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
            <p>{title} tab</p>
            {children}
        </div>
    );
};
