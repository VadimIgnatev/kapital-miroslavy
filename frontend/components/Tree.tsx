"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface TreeProps {
  capital: number;
}

export default function Tree({ capital }: TreeProps) {
  const growth = Math.min(capital / 1_000_000, 1);
  const controls = useAnimationControls();
  const prevCapital = useRef(capital);

  useEffect(() => {
    if (prevCapital.current !== capital && prevCapital.current !== 0) {
      controls.start({
        scale: [1, 1.03, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }
    prevCapital.current = capital;
  }, [capital, controls]);

  const trunkH = 55 + growth * 40;
  const s = 0.45 + growth * 0.55; // масштаб кроны
  const op = 0.25 + growth * 0.75; // opacity кроны
  const branchCount = Math.floor(1 + growth * 2); // 1–3

  const baseY = 176;
  const trunkTop = baseY - trunkH;
  const cy = trunkTop - 16 * s; // центр кроны

  const caption =
    capital === 0
      ? "начало пути"
      : growth < 0.3
      ? "каждая инвестиция — это рост"
      : growth < 0.7
      ? "терпение создаёт капитал"
      : "время — лучший инвестор";

  return (
    <motion.div
      className="relative flex flex-col items-center pt-8 pb-4"
      animate={controls}
    >
      {/* Фоновый glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: "8%",
            width: 180 + growth * 40,
            height: 160 + growth * 30,
            background: `radial-gradient(ellipse at 50% 45%, rgba(90,154,106,${0.06 + growth * 0.06}) 0%, rgba(90,154,106,0) 70%)`,
          }}
        />
      </motion.div>

      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <defs>
          <linearGradient id="trunk-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6e5a3e" />
            <stop offset="35%" stopColor="#8a7455" />
            <stop offset="65%" stopColor="#7d6949" />
            <stop offset="100%" stopColor="#5e4e35" />
          </linearGradient>

          <radialGradient id="crown-g" cx="45%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#5a9a6a" />
            <stop offset="100%" stopColor="#3d6b4a" />
          </radialGradient>

          <radialGradient id="ambient" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#5a9a6a" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#5a9a6a" stopOpacity="0" />
          </radialGradient>

          <filter id="soft">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Тень под деревом */}
        <motion.ellipse
          cx="100"
          cy={baseY + 1}
          rx={16 + growth * 14}
          ry="2.5"
          fill="#1c1917"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 + growth * 0.03 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />

        {/* Ствол */}
        <motion.path
          d={`
            M96.5 ${baseY}
            C96 ${baseY - trunkH * 0.3} 95 ${baseY - trunkH * 0.6} 98 ${trunkTop}
            L102 ${trunkTop}
            C105 ${baseY - trunkH * 0.6} 104 ${baseY - trunkH * 0.3} 103.5 ${baseY}
            Z
          `}
          fill="url(#trunk-g)"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          style={{ transformOrigin: `100px ${baseY}px` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        />

        {/* Ветки */}
        {branchCount >= 1 && (
          <motion.path
            d={`M99 ${trunkTop + trunkH * 0.35}
                Q88 ${trunkTop + trunkH * 0.2} 80 ${trunkTop + trunkH * 0.1}`}
            stroke="#6e5a3e"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />
        )}
        {branchCount >= 2 && (
          <motion.path
            d={`M101 ${trunkTop + trunkH * 0.45}
                Q112 ${trunkTop + trunkH * 0.3} 122 ${trunkTop + trunkH * 0.22}`}
            stroke="#6e5a3e"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          />
        )}
        {branchCount >= 3 && (
          <motion.path
            d={`M99 ${trunkTop + trunkH * 0.18}
                Q90 ${trunkTop + trunkH * 0.05} 84 ${trunkTop - 4}`}
            stroke="#6e5a3e"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 0.6, delay: 1.05 }}
          />
        )}

        {/* Ambient glow за кроной */}
        <motion.ellipse
          cx="100"
          cy={cy}
          rx={42 * s}
          ry={36 * s}
          fill="url(#ambient)"
          filter="url(#soft)"
          initial={{ opacity: 0 }}
          animate={{ opacity: op * 0.8 }}
          transition={{ delay: 0.4, duration: 1 }}
        />

        {/* Слой 1 — задний, сдвинут чуть вправо и вниз, темнее */}
        <motion.ellipse
          cx={100 + 8 * s}
          cy={cy + 6 * s}
          rx={32 * s}
          ry={26 * s}
          fill="#3a6547"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: op * 0.55, scale: 1 }}
          style={{ transformOrigin: `${100 + 8 * s}px ${cy + 6 * s}px` }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        />

        {/* Слой 2 — основной, центральный */}
        <motion.ellipse
          cx={100 - 2 * s}
          cy={cy}
          rx={34 * s}
          ry={28 * s}
          fill="url(#crown-g)"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: op, scale: 1 }}
          style={{ transformOrigin: `${100 - 2 * s}px ${cy}px` }}
          transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
        />

        {/* Слой 3 — верхний акцент, светлее, меньше */}
        {growth > 0.1 && (
          <motion.ellipse
            cx={100 - 6 * s}
            cy={cy - 10 * s}
            rx={18 * s}
            ry={14 * s}
            fill="#5a9a6a"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: op * 0.5, scale: 1 }}
            style={{ transformOrigin: `${100 - 6 * s}px ${cy - 10 * s}px` }}
            transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
          />
        )}

        {/* Breathing */}
        <motion.ellipse
          cx="100"
          cy={cy}
          rx={30 * s}
          ry={24 * s}
          fill="#4a7c59"
          animate={{
            scale: [0.98, 1.015, 0.98],
            opacity: [0, op * 0.06, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ transformOrigin: `100px ${cy}px` }}
        />
      </motion.svg>

      {/* Подпись */}
      <motion.p
        className="relative z-10 text-[11px] text-muted tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {caption}
      </motion.p>
    </motion.div>
  );
}
