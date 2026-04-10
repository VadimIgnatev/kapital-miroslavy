"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createTrade, updateTrade, getTradeById } from "@/lib/api";
import { ALLOWED_TICKERS } from "@/lib/types";

// useSearchParams требует Suspense в Next.js App Router
export default function AddPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><p className="text-muted text-sm">Загрузка...</p></div>}>
      <AddForm />
    </Suspense>
  );
}

function AddForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get("id") ? Number(searchParams.get("id")) : null;
  const isEdit = editId !== null;

  const [ticker, setTicker] = useState(ALLOWED_TICKERS[0]);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loadingTrade, setLoadingTrade] = useState(isEdit);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // В режиме редактирования — загружаем существующую сделку
  useEffect(() => {
    if (!editId) return;
    getTradeById(editId)
      .then((trade) => {
        setTicker(trade.ticker);
        setQuantity(String(trade.quantity));
        setPrice(String(trade.price));
        setDate(trade.date);
      })
      .catch(() => {
        alert("Не удалось загрузить сделку");
        router.push("/history");
      })
      .finally(() => setLoadingTrade(false));
  }, [editId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quantity || !price) return;

    setStatus("saving");
    try {
      if (isEdit && editId) {
        await updateTrade(editId, {
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          date,
        });
        setStatus("success");
        setTimeout(() => router.push("/history"), 800);
      } else {
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
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  if (loadingTrade) {
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
        {isEdit ? "Редактировать сделку" : "Добавить сделку"}
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Тикер — в режиме редактирования заблокирован */}
        <div>
          <label className="text-xs text-muted block mb-1">Тикер</label>
          {isEdit ? (
            <div className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm flex items-center text-muted">
              {ticker}
            </div>
          ) : (
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {ALLOWED_TICKERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
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
            : isEdit
            ? "Сохранить изменения"
            : "Сохранить"}
        </motion.button>
      </motion.form>
    </div>
  );
}
