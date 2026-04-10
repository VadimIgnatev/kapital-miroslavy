"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { getTrades } from "@/lib/api";
import { buildPortfolio, getTotalCapital, getCategoryShares } from "@/lib/portfolio";
import { Trade, Asset } from "@/lib/types";
import Tree from "@/components/Tree";

function formatNumber(n: number): string {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function useCountUp(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const diff = target - from;
    if (diff === 0) return;

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOut quad
      const ease = 1 - (1 - t) * (1 - t);
      setDisplay(from + diff * ease);
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        prev.current = target;
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);

  return display;
}

export default function HomePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const capitalControls = useAnimationControls();
  const prevTotal = useRef(0);

  useEffect(() => {
    getTrades()
      .then((trades: Trade[]) => setAssets(buildPortfolio(trades)))
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  }, []);

  const total = getTotalCapital(assets);
  const displayTotal = useCountUp(total);
  const categories = getCategoryShares(assets);

  // Pulse при изменении капитала
  useEffect(() => {
    if (prevTotal.current !== 0 && prevTotal.current !== total) {
      capitalControls.start({
        scale: [1, 1.04, 1],
        transition: { duration: 0.4, ease: "easeInOut" },
      });
    }
    prevTotal.current = total;
  }, [total, capitalControls]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.p
          className="text-muted text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Загрузка...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Hero — дерево + капитал */}
      <div className="flex flex-col items-center">
        <Tree capital={total} />

        <motion.div
          className="text-center mt-2 mb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-[13px] text-muted mb-2">Общий капитал</p>
          <motion.p
            className="text-4xl font-semibold tracking-tight"
            animate={capitalControls}
          >
            {formatNumber(displayTotal)}{" "}
            <span className="text-2xl font-normal text-muted">₽</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Структура по категориям */}
      <motion.div
        className="bg-card rounded-2xl p-4 shadow-sm border border-border"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 1.0 }}
      >
        <p className="text-[13px] font-medium text-muted mb-3">Структура</p>
        <div className="space-y-2.5">
          <CategoryBar label="Экспортёры" value={categories.exporters} color="#059669" />
          <CategoryBar label="Дивиденды" value={categories.dividend} color="#3b82f6" />
          <CategoryBar label="Крипто" value={categories.crypto} color="#f59e0b" />
        </div>
      </motion.div>

      {/* Список активов */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 1.15 }}
      >
        <p className="text-[13px] font-medium text-muted mb-2 mt-4">Активы</p>
        {assets.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">
            Пока нет активов
          </p>
        ) : (
          <div className="space-y-2">
            {assets.map((asset, i) => (
              <motion.div
                key={asset.ticker}
                className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center justify-between"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 1.2 + i * 0.05 }}
              >
                <div>
                  <p className="font-medium text-[14px]">{asset.ticker}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {formatNumber(asset.quantity)} шт. ×{" "}
                    {formatNumber(asset.avgPrice)} ₽
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[14px]">
                    {formatNumber(asset.totalValue)} ₽
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {asset.share.toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function CategoryBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted w-24">{label}</span>
      <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 1.1 }}
        />
      </div>
      <span className="text-xs font-medium w-12 text-right">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}
