"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createTrade } from "@/lib/api";
import { ALLOWED_TICKERS } from "@/lib/types";

export default function AddPage() {
  const [ticker, setTicker] = useState(ALLOWED_TICKERS[0]);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quantity || !price) return;

    setStatus("saving");
    try {
      await createTrade({
        ticker,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        date,
      });
      setStatus("success");
      setQuantity("");
      setPrice("");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <motion.h1
        className="text-xl font-semibold"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Добавить сделку
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Тикер */}
        <div>
          <label className="text-xs text-muted block mb-1">Тикер</label>
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {ALLOWED_TICKERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Количество */}
        <div>
          <label className="text-xs text-muted block mb-1">Количество</label>
          <input
            type="number"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="10"
            className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Цена */}
        <div>
          <label className="text-xs text-muted block mb-1">Цена за единицу</label>
          <input
            type="number"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="295.50"
            className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Дата */}
        <div>
          <label className="text-xs text-muted block mb-1">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* Кнопка */}
        <motion.button
          type="submit"
          disabled={status === "saving"}
          className="w-full h-11 rounded-xl bg-accent text-white text-sm font-medium disabled:opacity-50"
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          {status === "saving"
            ? "Сохраняю..."
            : status === "success"
            ? "Сохранено!"
            : status === "error"
            ? "Ошибка"
            : "Сохранить"}
        </motion.button>
      </motion.form>
    </div>
  );
}
