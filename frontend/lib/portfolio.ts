import { Trade, Asset, CATEGORIES } from "./types";

export function buildPortfolio(trades: Trade[]): Asset[] {
  const map = new Map<string, { quantity: number; totalCost: number }>();

  for (const t of trades) {
    const existing = map.get(t.ticker) || { quantity: 0, totalCost: 0 };
    existing.quantity += t.quantity;
    existing.totalCost += t.quantity * t.price;
    map.set(t.ticker, existing);
  }

  const assets: Asset[] = [];
  let grandTotal = 0;

  for (const [ticker, data] of map) {
    const totalValue = data.totalCost;
    grandTotal += totalValue;
    assets.push({
      ticker,
      quantity: data.quantity,
      avgPrice: data.totalCost / data.quantity,
      totalValue,
      share: 0,
      category: CATEGORIES[ticker] || "exporters",
    });
  }

  for (const a of assets) {
    a.share = grandTotal > 0 ? (a.totalValue / grandTotal) * 100 : 0;
  }

  return assets.sort((a, b) => b.totalValue - a.totalValue);
}

export function getTotalCapital(assets: Asset[]): number {
  return assets.reduce((sum, a) => sum + a.totalValue, 0);
}

export function getCategoryShares(assets: Asset[]) {
  const total = getTotalCapital(assets);
  if (total === 0) return { exporters: 0, dividend: 0, crypto: 0 };

  const sums = { exporters: 0, dividend: 0, crypto: 0 };
  for (const a of assets) {
    sums[a.category] += a.totalValue;
  }

  return {
    exporters: (sums.exporters / total) * 100,
    dividend: (sums.dividend / total) * 100,
    crypto: (sums.crypto / total) * 100,
  };
}
