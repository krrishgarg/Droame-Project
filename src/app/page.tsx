"use client";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Drone from "@/components/Drone";
import LoginOverlay from "@/components/LoginOverlay";
import InviteGenerator from '../components/InviteGenerator';
import WelcomeScreen from '../components/WelcomeScreen';

interface User {
  user_name: string;
  details: any;
  access_code: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false); // Controls the intro screen

  // Handle Login: Set user AND trigger welcome screen
  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowWelcome(true);
  };

  return (
    <main className="relative h-screen w-full bg-white">

      {/* 1. Login Overlay (Only visible if no user) */}
      {!user && <LoginOverlay onLogin={handleLogin} />}

      {/* 2. Main Content (Visible AFTER login) */}
      {user && (
        <>
          {/* Intro Screen - AnimatePresence handles the fade-out */}
          <AnimatePresence>
            {showWelcome && (
              <WelcomeScreen
                name={user.user_name}
                onComplete={() => setShowWelcome(false)}
              />
            )}
          </AnimatePresence>

          {/* 3D Drone & UI (We mount this immediately so it loads in the background) */}
          <Drone />

          {/* Persistent UI Elements (Fade in after welcome is done) */}
          {!showWelcome && (
            <div className="animate-in fade-in duration-1000">
              <div className="absolute top-10 left-10 z-40 text-black mix-blend-difference">
                <p className="text-sm uppercase tracking-widest opacity-60">Authorized Access</p>
                <h1 className="text-2xl font-bold">{user.user_name}</h1>
              </div>

              {/* The Generator Button */}
              <InviteGenerator adminCode={user.access_code} />
            </div>
          )}
        </>
      )}
    </main>
  );
}