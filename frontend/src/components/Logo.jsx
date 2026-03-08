import React from 'react';
import logoOfficial from '../assets/logo-official.png';

/**
 * Konnectt Logo Component (PNG Version)
 * Uses high-quality official transparent assets for 100% design fidelity.
 * 
 * @param {string} size - 'small', 'medium', 'large'
 * @param {string} className - Additional CSS classes
 */
export default function Logo({ size = 'medium', className = '' }) {
    // Proportional heights for the container (Bold zoom as requested)
    const heights = {
        small: 'h-28',
        medium: 'h-48',
        large: 'h-76'
    };

    const currentHeight = heights[size] || heights.medium;

    return (
        <div className={`flex items-center justify-center ${className} transition-transform duration-300 hover:scale-[1.02]`}>
            <img
                src={logoOfficial}
                alt="Konnectt Logo"
                className={`${currentHeight} w-auto object-contain`}
            />
        </div>
    );
}
