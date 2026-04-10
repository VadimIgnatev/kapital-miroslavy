"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { isAdmin } from "@/lib/telegram";

const ALL_TABS = [
  { href: "/",         label: "Портфель",  adminOnly: false },
  { href: "/history",  label: "История",   adminOnly: false },
  { href: "/strategy", label: "Стратегия", adminOnly: false },
  { href: "/add",      label: "Добавить",  adminOnly: true  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const admin = isAdmin();

  const tabs = ALL_TABS.filter((tab) => !tab.adminOnly || admin);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href} className="flex-1">
              <motion.div
                className="flex items-center justify-center h-full py-2"
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.12 }}
              >
                <span
                  className={`text-[13px] font-medium transition-colors ${
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
