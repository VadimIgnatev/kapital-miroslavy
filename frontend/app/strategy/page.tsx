"use client";

import { motion } from "framer-motion";

export default function StrategyPage() {
  return (
    <div className="space-y-4">
      <motion.h1
        className="text-xl font-semibold"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Стратегия
      </motion.h1>

      <motion.div
        className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <p className="text-sm leading-relaxed text-foreground">
          Портфель Мирославы — это долгосрочная стратегия накопления капитала
          для ребёнка. Горизонт инвестирования — от 15 лет.
        </p>

        <div className="space-y-3">
          <StrategyBlock
            title="Экспортёры"
            text="Компании с валютной выручкой: NVTK, GMKN, PLZL, PHOR, CHMF, NLMK. Защита от девальвации рубля."
          />
          <StrategyBlock
            title="Дивидендные акции"
            text="Стабильные плательщики: LKOH, SIBN, MTSS, SBER. Реинвестирование дивидендов."
          />
          <StrategyBlock
            title="Криптовалюта"
            text="BTC и ETH — небольшая доля для диверсификации. Высокий риск, высокий потенциал."
          />
        </div>

        <p className="text-xs text-muted pt-2">
          Стратегия пересматривается раз в год. Ребалансировка — по необходимости.
        </p>
      </motion.div>
    </div>
  );
}

function StrategyBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs text-muted leading-relaxed">{text}</p>
    </div>
  );
}
