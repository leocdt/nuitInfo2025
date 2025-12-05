"use client";

import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const RetroButton: React.FC<RetroButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`
        px-8 py-4 
        bg-gray-600 hover:bg-gray-500 
        text-white font-bold text-2xl tracking-widest uppercase
        border-4 border-white 
        shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] 
        active:translate-y-1 active:shadow-none active:border-gray-300
        transition-all duration-100
        font-pixel
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};