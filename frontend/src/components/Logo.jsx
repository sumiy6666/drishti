import React from 'react';

/**
 * Konnectt Logo SVG Component
 * @param {string} variant - 'light' (white text) or 'dark' (black/dark text)
 * @param {string} size - 'small', 'medium', 'large'
 * @param {string} className - Additional CSS classes
 */
export default function Logo({ variant = 'dark', size = 'medium', className = '' }) {
    const isLight = variant === 'light';

    // Size mapping
    const sizes = {
        small: { h: 'h-8', text: 'text-xl' },
        medium: { h: 'h-10', text: 'text-2xl' },
        large: { h: 'h-16', text: 'text-4xl' }
    };

    const currentSize = sizes[size] || sizes.medium;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* The Chain Icon */}
            <svg
                viewBox="0 0 160 60"
                className={`${currentSize.h} w-auto drop-shadow-sm`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Link 1 - Cyan */}
                <path d="M35 15C35 9.47715 30.5228 5 25 5H15C9.47715 5 5 9.47715 5 15V25C5 30.5228 9.47715 35 15 35H25C30.5228 35 35 30.5228 35 25V15Z" stroke="#22D3EE" strokeWidth="6" strokeLinecap="round" />
                {/* Link 2 - Green */}
                <path d="M55 15C55 9.47715 50.5228 5 45 5H35C29.4772 5 25 9.47715 25 15V25C25 30.5228 29.4772 35 35 35H45C50.5228 35 55 30.5228 55 25V15Z" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
                {/* Link 3 - Orange/Yellow */}
                <path d="M75 15C75 9.47715 70.5228 5 65 5H55C49.4772 5 45 9.47715 45 15V25C45 30.5228 49.4772 35 55 35H65C70.5228 35 75 30.5228 75 25V15Z" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
                {/* Link 4 - Red */}
                <path d="M95 15C95 9.47715 90.5228 5 85 5H75C69.4772 5 65 9.47715 65 15V25C65 30.5228 69.4772 35 75 35H85C90.5228 35 95 30.5228 95 25V15Z" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                {/* Link 5 - Pink/Magenta */}
                <path d="M115 15C115 9.47715 110.5228 5 105 5H95C89.4772 5 85 9.47715 85 15V25C85 30.5228 89.4772 35 95 35H105C110.5228 35 115 30.5228 115 25V15Z" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
                {/* Link 6 - Purple */}
                <path d="M135 15C135 9.47715 130.523 5 125 5H115C109.477 5 105 9.47715 105 15V25C105 30.5228 109.477 35 115 35H125C130.523 35 135 30.5228 135 25V15Z" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />

                {/* Overlapping parts to create the link effect */}
                <path d="M35 15V25" stroke="#22D3EE" strokeWidth="6" strokeLinecap="round" />
                <path d="M55 15V25" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
                <path d="M75 15V25" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
                <path d="M95 15V25" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                <path d="M115 15V25" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
            </svg>

            <span className={`${currentSize.text} font-bold tracking-tight ${isLight ? 'text-white' : 'text-secondary'}`}>
                Konnectt
            </span>
        </div>
    );
}
