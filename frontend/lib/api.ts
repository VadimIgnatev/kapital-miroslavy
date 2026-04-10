import { Trade } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getTrades(): Promise<Trade[]> {
  const res = await fetch(`${API_URL}/trades`, { cache: "no-store" });
  if (!res.ok) throw new Error("Ошибка загрузки сделок");
  return res.json();
}

export async function createTrade(
  trade: Omit<Trade, "id">
): Promise<Trade> {
  const res = await fetch(`${API_URL}/trades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trade),
  });
  if (!res.ok) throw new Error("Ошибка создания сделки");
  return res.json();
}
