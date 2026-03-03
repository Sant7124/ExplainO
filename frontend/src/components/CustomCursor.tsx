import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isPointer, setIsPointer] = useState(false);

    // High fidelity springs for smooth movement
    const springConfig = { stiffness: 1000, damping: 50 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                ['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(target.tagName) ||
                target.closest('.glass') !== null
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [x, y]);

    // Radial spokes configuration
    const spokeCount = 24;
    const dotsPerSpoke = 3;

    return (
        <div className="fixed top-0 left-0 pointer-events-none z-[9999]">
            <motion.div
                style={{ x, y }}
                className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            >
                {/* SVG for the "Dotted Flower" Radial Pattern */}
                <div className="w-[45px] h-[45px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        {/* Radial Spokes of Dots */}
                        {Array.from({ length: spokeCount }).map((_, spokeIndex) => {
                            const angle = (spokeIndex * (360 / spokeCount)) * (Math.PI / 180);

                            return Array.from({ length: dotsPerSpoke }).map((_, dotIndex) => {
                                // Distance from center increases for each dot in the spoke
                                const distance = 18 + (dotIndex * 8);
                                const cx = 50 + Math.cos(angle) * distance;
                                const cy = 50 + Math.sin(angle) * distance;

                                // Dots get smaller as they go further out
                                const r = 1.5 - (dotIndex * 0.3);

                                return (
                                    <motion.circle
                                        key={`${spokeIndex}-${dotIndex}`}
                                        cx={cx}
                                        cy={cy}
                                        r={r}
                                        fill="white"
                                        initial={{ opacity: 0.8 }}
                                        animate={{
                                            scale: isPointer ? 1.2 : 1,
                                            opacity: isPointer ? 1 : 0.6 - (dotIndex * 0.1)
                                        }}
                                        className="origin-center"
                                    />
                                );
                            });
                        })}

                        {/* Static Concentric Faint Rings (Subtle detail from image) */}
                        <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                        <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                    </svg>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
