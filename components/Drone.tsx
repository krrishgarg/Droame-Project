'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const FRAME_COUNT = 240;
// Adjust this path to match where you store your images in /public
const IMG_PATH = (index: number) =>
    `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

export default function Drone() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Scroll Hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Map scroll (0 to 1) to frame index (0 to 239)
    const currentIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // 2. Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === FRAME_COUNT) {
                setImages(imgArray);
                setIsLoading(false);
            }
        };

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = IMG_PATH(i);
            img.onload = onImageLoad;
            // Fallback in case of error to prevent blocking
            img.onerror = onImageLoad;
            imgArray.push(img);
        }
    }, []);

    // 3. Render Loop
    useEffect(() => {
        if (isLoading || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle High-DPI screens and resizing
        const render = (index: number) => {
            const img = images[Math.round(index)];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            // Aspect Ratio Fit Logic (Contain)
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgRatio = img.width / img.height;
            const canvasRatio = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawHeight = canvasHeight;
                drawWidth = img.width * (canvasHeight / img.height);
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvasWidth;
                drawHeight = img.height * (canvasWidth / img.width);
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Initial draw
        render(currentIndex.get());

        // Subscribe to scroll updates
        const unsubscribe = currentIndex.on('change', (latest) => {
            requestAnimationFrame(() => render(latest));
        });

        return () => unsubscribe();
    }, [isLoading, images, currentIndex]);

    // 4. Resize Observer for Canvas Resolution
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                // Redraw current frame immediately on resize
                if (images.length > 0 && !isLoading) {
                    // Trigger a manual update if needed, typically the scroll listener catches this
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Init

        return () => window.removeEventListener('resize', handleResize);
    }, [isLoading, images]);

    return (
        <div ref={containerRef} className="relative h-[400vh] w-full bg-[#050505]">

            {/* Loading State */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <p className="text-sm font-light tracking-widest opacity-60">LOADING ASSETS</p>
                    </div>
                </div>
            )}

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="block h-full w-full object-contain"
                />

                {/* Text Overlay System */}
                <TextOverlay scrollProgress={scrollYProgress} />

                {/* DEBUG OVERLAY */}
                <div className="fixed top-20 left-4 z-50 bg-black/50 p-2 text-xs text-white">
                    <p>Loading: {isLoading ? 'YES' : 'NO'}</p>
                    <p>Images Needed: {FRAME_COUNT}</p>
                    <p>Images Loaded: {images.length}</p>
                    <p>Frame Index: {Math.round(currentIndex.get())}</p>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Sub-component: Text Overlay
// ---------------------------------------------------------

function TextOverlay({ scrollProgress }: { scrollProgress: any }) {
    // Helper to create fade in/out animations based on scroll ranges
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
            [20, -20] // Subtle parallax move up
        );
    };

    return (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-6 md:px-20">

            {/* 0% - Start */}
            <motion.div
                style={{ opacity: useScrollOpacity(-0.05, 0.2), y: useScrollY(0, 0.2) }}
                className="absolute inset-0 flex items-center justify-center text-center"
            >
                <h1 className="text-6xl font-bold tracking-tighter text-white/90 md:text-8xl">
                    We have
                </h1>
            </motion.div>

            {/* 30% - Left */}
            <motion.div
                style={{ opacity: useScrollOpacity(0.25, 0.45), y: useScrollY(0.25, 0.45) }}
                className="absolute left-10 md:left-32 top-1/2 -translate-y-1/2"
            >
                <h2 className="text-5xl font-semibold tracking-tight text-white/90 md:text-7xl">
                    Physical AI
                </h2>
                <p className="mt-4 max-w-sm text-lg text-white/60">
                    Intelligence that breaks the screen barrier.
                </p>
            </motion.div>

            {/* 60% - Right */}
            <motion.div
                style={{ opacity: useScrollOpacity(0.55, 0.75), y: useScrollY(0.55, 0.75) }}
                className="absolute right-10 md:right-32 top-1/2 -translate-y-1/2 text-right"
            >
                <h2 className="text-5xl font-semibold tracking-tight text-white/90 md:text-7xl">
                    Onboard
                </h2>
                <p className="mt-4 ml-auto max-w-sm text-lg text-white/60">
                    Processing power that rivals workstations, in the palm of your hand.
                </p>
            </motion.div>

            {/* 90% - End */}
            <motion.div
                style={{ opacity: useScrollOpacity(0.85, 1.0), y: useScrollY(0.85, 1.0) }}
                className="absolute inset-0 flex items-center justify-center flex-col text-center"
            >
                <h1 className="text-6xl font-bold tracking-tighter text-white/90 md:text-8xl">
                    This is the future
                </h1>
                <button className="pointer-events-auto mt-8 rounded-full bg-white px-8 py-3 text-sm font-medium tracking-wide text-black transition-transform hover:scale-105">
                    PRE-ORDER NOW
                </button>
            </motion.div>

        </div>
    );
}