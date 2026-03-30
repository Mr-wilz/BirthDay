"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, Sparkles, Pause, Play, Cake, Star } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import {
  Cormorant_Garamond,
  Fredoka,
  Great_Vibes,
  Luckiest_Guy,
} from "next/font/google";

const heroFont = Luckiest_Guy({ subsets: ["latin"], weight: "400" });
const playfulFont = Fredoka({ subsets: ["latin"], weight: ["500", "700"] });
const wishTitleFont = Great_Vibes({ subsets: ["latin"], weight: "400" });
const wishBodyFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function BirthdaySurprise() {
  const [showGift, setShowGift] = useState(false);
  const [phase, setPhase] = useState(1); // Phase 1: Landing, Phase 2: French Reveal, Phase 3: Final Photo
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Memoized fields (Keeping your exact decorations)
  const starField = React.useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        top: (i * 17) % 100,
        left: (i * 29) % 100,
        size: i % 5 === 0 ? 18 : i % 2 === 0 ? 12 : 10,
        duration: 2.4 + (i % 5) * 0.45,
        delay: (i % 7) * 0.35,
      })),
    [],
  );
  const glitterField = React.useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        top: (i * 13 + 7) % 100,
        left: (i * 19 + 11) % 100,
        duration: 1.8 + (i % 4) * 0.4,
        delay: (i % 6) * 0.25,
      })),
    [],
  );
  const floatingDecor = React.useMemo(
    () => [
      { Icon: Sparkles, className: "top-8 left-8 text-amber-400" },
      { Icon: Star, className: "top-16 right-16 text-rose-300" },
      { Icon: Cake, className: "bottom-10 left-14 text-orange-400" },
    ],
    [],
  );
  const balloonField = React.useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: (i * 13 + 6) % 96,
        size: 72 + (i % 3) * 18,
        duration: 10 + (i % 4) * 1.8,
        delay: i * 1.15,
        drift: i % 2 === 0 ? 14 : -14,
      })),
    [],
  );

  const fireCelebrationConfetti = React.useCallback(() => {
    const duration = 9000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 34,
      spread: 360,
      ticks: 95,
      zIndex: 1000,
      colors: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#E2B6FF"],
    };
    confetti({
      ...defaults,
      particleCount: 260,
      spread: 120,
      origin: { y: 0.64 },
    });
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return window.clearInterval(interval);
      const particleCount = Math.max(
        26,
        Math.floor(160 * (timeLeft / duration)),
      );
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() * 0.2 + 0.1 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.3 + 0.6, y: Math.random() * 0.2 + 0.1 },
      });
    }, 280);
  }, []);

  const revealGift = () => {
    setShowGift(true);
    setPhase(2); // Start the French animation phase
    if (audioRef.current) audioRef.current.play().catch(() => {});
    fireCelebrationConfetti();

    // After 3 seconds of the French.png glory, switch to the final photo layout
    setTimeout(() => {
      setPhase(3);
    }, 3500);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!showGift) return;

    const confettiLoop = window.setInterval(() => {
      fireCelebrationConfetti();
    }, 18000);

    return () => window.clearInterval(confettiLoop);
  }, [showGift, fireCelebrationConfetti]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/Hbd.mp3" type="audio/mpeg" />
      </audio>

      {/* Dynamic Background - Kept your specific colors */}
      <div
        className={`fixed inset-0 -z-10 transition-colors duration-3000 ${showGift ? "bg-[linear-gradient(135deg,#ffd6e8_0%,#ffe7be_35%,#c2f3d5_70%,#bcdcff_100%)]" : "bg-[linear-gradient(135deg,#9d80e6_0%,#7a58cb_48%,#5a3ea8_100%)]"}`}
      />

      {/* Decorations (Starfield, Glitter, Balloons, FloatingDecor) - UNTOUCHED */}
      {balloonField.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="pointer-events-none fixed z-30"
          style={{ left: `${balloon.left}%`, bottom: "-120px" }}
          initial={{ opacity: 0, y: "20vh", x: 0 }}
          animate={{
            opacity: [0, 0.85, 0.85, 0],
            y: ["20vh", "-135vh"],
            x: [0, balloon.drift, 0],
          }}
          transition={{
            duration: balloon.duration,
            delay: balloon.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image
            src="/hbd.png"
            alt="balloon"
            width={balloon.size}
            height={balloon.size}
          />
        </motion.div>
      ))}
      {floatingDecor.map(({ Icon, className }, i) => (
        <motion.div
          key={className}
          animate={{ opacity: 0.9, y: [0, -10, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          className={`fixed z-0 ${className}`}
        >
          <Icon size={showGift ? 30 : 24} />
        </motion.div>
      ))}
      {!showGift &&
        starField.map((star) => (
          <motion.div
            key={star.id}
            className="fixed z-0"
            style={{ top: `${star.top}%`, left: `${star.left}%` }}
            animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.75, 1.2, 0.75] }}
            transition={{ duration: star.duration, repeat: Infinity }}
          >
            <Star size={star.size} className="text-white/80" />
          </motion.div>
        ))}

      <AnimatePresence mode="wait">
        {/* PHASE 1: THE LANDING */}
        {phase === 1 && (
          <motion.section
            key="landing"
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 h-screen flex items-center justify-center p-6"
          >
            <div className="bg-white/28 backdrop-blur-2xl border border-white/70 p-12 rounded-[40px] shadow-2xl text-center max-w-xl">
              <Gift
                size={64}
                className="text-rose-500 mx-auto mb-6 animate-bounce"
              />
              <h1
                className={`${heroFont.className} text-5xl md:text-6xl text-white drop-shadow-lg mb-5`}
              >
                HAPPY BIRTHDAY FELICITY
              </h1>
              <button
                onClick={revealGift}
                className={`${playfulFont.className} px-9 py-4 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white rounded-full font-bold text-xl shadow-xl hover:scale-105 transition-transform`}
              >
                Open Gift ✨
              </button>
            </div>
          </motion.section>
        )}

        {/* PHASE 2: THE AWESOME FRENCH REVEAL (Hero Moment) */}
        {phase === 2 && (
          <motion.section
            key="french-reveal"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
            exit={{ opacity: 0, y: -100, filter: "blur(10px)" }}
            transition={{ duration: 1, type: "spring" }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-[80vw] h-[50vh]">
              <Image
                src="/french.png"
                alt="Joyeux Anniversaire"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
                priority
              />
            </div>
          </motion.section>
        )}

        {/* PHASE 3: THE FINAL PHOTO & WISH (Spirit Lifting) */}
        {phase === 3 && (
          <motion.section
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 pb-10 pt-20 md:px-10 min-h-screen flex items-center justify-center"
          >
            <button
              onClick={toggleMusic}
              className="fixed top-6 right-6 z-50 p-4 bg-white/45 backdrop-blur-xl border border-white/60 rounded-full shadow-lg"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="mx-auto w-full max-w-5xl rounded-4xl bg-gradient-to-br from-[#f93dff9c] via-[#6BCB77] to-[#E2B6FF] p-1 shadow-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="bg-white/30 backdrop-blur-2xl p-8 md:p-12 rounded-[calc(2rem+4px)] border border-white/60 grid md:grid-cols-2 gap-10 items-center"
              >
                {/* Solid Birthday Photo Frame */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border-[6px] border-white shadow-2xl ring-1 ring-black/5"
                >
                  <Image
                    src="/felz.jpg"
                    alt="Felicity"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>

                {/* Solid Birthday Wish Side */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-left space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="text-rose-500 fill-rose-500" size={32} />
                    <Sparkles className="text-amber-400" size={24} />
                  </div>

                  <h2
                    className={`${wishTitleFont.className} text-5xl md:text-6xl text-slate-800 leading-tight`}
                  >
                    To the One & Only <br />{" "}
                    <span className="text-rose-600">Felicity</span>
                  </h2>

                  <div
                    className={`${wishBodyFont.className} space-y-4 text-xl text-slate-700 leading-relaxed font-medium`}
                  >
                    <p>
                      Happy Birthday Felicity! Watching you grow has been such a
                      beautiful journey for all of us. You bring so much joy,
                      laughter, and light into this family.
                    </p>

                    <p>
                      Today we celebrate not just your birthday, but the
                      wonderful person you are becoming. May this new year of
                      your life be filled with happiness, success, good health,
                      and countless amazing memories.
                    </p>

                    <p>- Wilz for the family</p>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <div className="h-px flex-1 bg-slate-300" />
                    <Cake className="text-orange-500" size={28} />
                    <div className="h-px flex-1 bg-slate-300" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
