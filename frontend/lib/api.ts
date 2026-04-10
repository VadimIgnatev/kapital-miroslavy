import { Trade } from "./types";
import { getTelegramUser } from "./telegram";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getTrades(): Promise<Trade[]> {
  const res = await fetch(`${API_URL}/trades`, { cache: "no-store" });
  if (!res.ok) throw new Error("Ошибка загрузки сделок");
  return res.json();
}

export async function createTrade(
  trade: Omit<Trade, "id">
): Promise<Trade> {
  const user = getTelegramUser();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (user) {
    headers["X-Telegram-User-Id"] = String(user.id);
  }

  const res = await fetch(`${API_URL}/trades`, {
    method: "POST",
    headers,
    body: JSON.stringify(trade),
  });
  if (!res.ok) throw new Error("Ошибка создания сделки");
  return res.json();
}
