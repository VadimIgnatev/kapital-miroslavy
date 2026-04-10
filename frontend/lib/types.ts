export interface Trade {
  id: number;
  ticker: string;
  quantity: number;
  price: number;
  date: string;
}

export interface Asset {
  ticker: string;
  quantity: number;
  avgPrice: number;
  totalValue: number;
  share: number;
  category: "exporters" | "dividend" | "crypto";
}

export const CATEGORIES: Record<string, "exporters" | "dividend" | "crypto"> = {
  NVTK: "exporters",
  GMKN: "exporters",
  PLZL: "exporters",
  PHOR: "exporters",
  CHMF: "exporters",
  NLMK: "exporters",
  LKOH: "dividend",
  SIBN: "dividend",
  MTSS: "dividend",
  SBER: "dividend",
  BTC: "crypto",
  ETH: "crypto",
};

export const ALLOWED_TICKERS = Object.keys(CATEGORIES);
