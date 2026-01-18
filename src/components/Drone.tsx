'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function Drone() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // 1. Track Scroll Progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // 2. Sync Video Time with Scroll
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video metadata is loaded so we know the duration
        const handleMetadata = () => {
            // Optional: You can set specific states here
        };
        video.addEventListener('loadedmetadata', handleMetadata);

        // Update video time whenever scroll changes
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            if (video.duration) {
                // Calculate time: Progress (0-1) * Duration
                const time = latest * video.duration;

                // Use fastSeek if available (smoother), else currentTime
                // @ts-ignore
                if (video.fastSeek) {
                    // @ts-ignore
                    video.fastSeek(time);
                } else {
                    video.currentTime = time;
                }
            }
        });

        return () => {
            unsubscribe();
            video.removeEventListener('loadedmetadata', handleMetadata);
        };
    }, [scrollYProgress]);

    return (
        <div ref={containerRef} className="relative h-[400vh] w-full bg-white">

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <video
                    ref={videoRef}
                    src="/beta/krrish/drone.mp4" // Make sure this matches your S3 path
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover" // object-cover ensures it fills screen without bars
                />

                {/* Reuse your TextOverlay component here */}
                <TextOverlay scrollProgress={scrollYProgress} />
            </div>
        </div>
    );
}

// ... Paste your existing TextOverlay function here ...


// ---------------------------------------------------------
// Sub-component: Text Overlay (Top Aligned & Centered)
// ---------------------------------------------------------

function TextOverlay({ scrollProgress }: { scrollProgress: any }) {
    const useScrollOpacity = (start: number, end: number) => {
        return useTransform(
            scrollProgress,
            [start, start + 0.05, end - 0.05, end],
            [0, 1, 1, 0]
        );
    };

    const useScrollY = (start: number, end: number) => {
        return useTransform(
            scrollProgress,
            [start, end],
            [0, -20]
        );
    };

    // FIX: 'w-full' ensures the div spans the screen width so text-center works.
    // 'items-center' is added back to center the flex children (like the button).
    const positionClasses = "absolute inset-0 w-full flex flex-col items-center justify-start pt-32 md:pt-40 text-center px-6";

    return (
        <div className="pointer-events-none absolute inset-0 w-full h-full">

            {/* 0% - Start */}
            <motion.div
                style={{ opacity: useScrollOpacity(-0.05, 0.2), y: useScrollY(0, 0.2) }}
                className={positionClasses}
            >
                <h1 className="text-6xl font-bold tracking-tighter text-black md:text-8xl">
                    We have
                </h1>
            </motion.div>

            {/* 30% */}
            <motion.div
                style={{ opacity: useScrollOpacity(0.25, 0.45), y: useScrollY(0.25, 0.45) }}
                className={positionClasses}
            >
                <h2 className="text-5xl font-semibold tracking-tight text-black md:text-7xl">
                    Physical AI
                </h2>
                <p className="mt-4 max-w-sm text-lg text-black/60">
                    Intelligence that breaks the screen barrier.
                </p>
            </motion.div>

            {/* 60% */}
            <motion.div
                style={{ opacity: useScrollOpacity(0.55, 0.75), y: useScrollY(0.55, 0.75) }}
                className={positionClasses}
            >
                <h2 className="text-5xl font-semibold tracking-tight text-black md:text-7xl">
                    Onboard
                </h2>
                <p className="mt-4 max-w-sm text-lg text-black/60">
                    Processing power that rivals workstations.
                </p>
            </motion.div>

            {/* 90% */}
            <motion.div
                style={{ opacity: useScrollOpacity(0.85, 1.0), y: useScrollY(0.85, 1.0) }}
                className={positionClasses}
            >
                <h1 className="text-6xl font-bold tracking-tighter text-black md:text-8xl">
                    This is the future
                </h1>
                <button className="pointer-events-auto mt-8 rounded-full bg-black px-8 py-3 text-sm font-medium tracking-wide text-white transition-transform hover:scale-105">
                    PRE-ORDER NOW
                </button>
            </motion.div>

        </div>
    );
}