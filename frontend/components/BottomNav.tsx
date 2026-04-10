"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "Портфель", icon: "◉" },
  { href: "/history", label: "История", icon: "☰" },
  { href: "/strategy", label: "Стратегия", icon: "◎" },
  { href: "/add", label: "Добавить", icon: "＋" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href} className="flex-1">
              <motion.div
                className="flex flex-col items-center gap-0.5 py-2"
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.15 }}
              >
                <span
                  className={`text-lg ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                >
                  {tab.icon}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? "text-accent" : "text-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
