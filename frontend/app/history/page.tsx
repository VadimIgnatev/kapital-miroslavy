"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getTrades, deleteTrade } from "@/lib/api";
import { isAdmin } from "@/lib/telegram";
import { Trade } from "@/lib/types";

function formatNumber(n: number): string {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const admin = isAdmin();

  useEffect(() => {
    getTrades()
      .then(setTrades)
      .catch(() => setTrades([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Удалить сделку?")) return;
    try {
      await deleteTrade(id);
      setTrades((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Не удалось удалить сделку");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted text-sm">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.h1
        className="text-xl font-medium"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        История сделок
      </motion.h1>

      {trades.length === 0 ? (
        <div className="py-10 text-center space-y-1">
          <p className="text-sm font-medium text-foreground">Начало пути 🌱</p>
          <p className="text-xs text-muted">Первая инвестиция — самый важный шаг</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {trades.map((trade, i) => (
            <motion.div
              key={trade.id}
              className="bg-card rounded-xl p-4 shadow-sm border border-border"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              layout
            >
              {/* Основная строка */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{trade.ticker}</p>
                  <p className="text-xs text-muted">{formatDate(trade.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatNumber(trade.quantity)} шт.
                  </p>
                  <p className="text-xs text-muted">
                    по {formatNumber(trade.price)} ₽
                  </p>
                </div>
              </div>

              {/* Кнопки — только для админа */}
              {admin && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                  <Link
                    href={`/add?id=${trade.id}`}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Изменить
                  </Link>
                  <button
                    onClick={() => handleDelete(trade.id)}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
