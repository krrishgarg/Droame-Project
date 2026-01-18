'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface WelcomeProps {
    name: string;
    onComplete: () => void;
}

export default function WelcomeScreen({ name, onComplete }: WelcomeProps) {

    // Automatically trigger the completion after the animation is done
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 4500); // 4.5 seconds total duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white px-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
            <div className="max-w-4xl text-center space-y-6">

                {/* Line 1: Welcome [Name] */}
                <motion.h1
                    className="text-4xl md:text-7xl font-light tracking-tighter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                >
                    Welcome, <span className="font-bold">{name}</span>
                </motion.h1>

                {/* Line 2: To the world of drones */}
                <motion.div
                    className="overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <motion.p
                        className="text-xl md:text-3xl text-gray-400 font-light tracking-[0.2em] uppercase"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
                    >
                        To the world of drones
                    </motion.p>
                </motion.div>

                {/* Decorative Line */}
                <motion.div
                    className="h-[1px] bg-white/20 mx-auto"
                    initial={{ width: 0 }}
                    animate={{ width: "200px" }}
                    transition={{ duration: 1.5, delay: 2, ease: "easeInOut" }}
                />

            </div>
        </motion.div>
    );
}