import { Trade } from "./types";
import { getTelegramUser } from "./telegram";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function adminHeaders(): Record<string, string> {
  const user = getTelegramUser();
  const headers: Record<string, string> = {};
  if (user) {
    headers["X-Telegram-User-Id"] = String(user.id);
  }
  return headers;
}

export async function getTrades(): Promise<Trade[]> {
  const res = await fetch(`${API_URL}/trades`, { cache: "no-store" });
  if (!res.ok) throw new Error("Ошибка загрузки сделок");
  return res.json();
}

export async function getTradeById(id: number): Promise<Trade> {
  const res = await fetch(`${API_URL}/trades/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Сделка не найдена");
  return res.json();
}

export async function createTrade(trade: Omit<Trade, "id">): Promise<Trade> {
  const res = await fetch(`${API_URL}/trades`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...adminHeaders() },
    body: JSON.stringify(trade),
  });
  if (!res.ok) throw new Error("Ошибка создания сделки");
  return res.json();
}

export async function updateTrade(
  id: number,
  data: Partial<Pick<Trade, "quantity" | "price" | "date">>
): Promise<Trade> {
  const res = await fetch(`${API_URL}/trades/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...adminHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ошибка обновления сделки");
  return res.json();
}

export async function deleteTrade(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/trades/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Ошибка удаления сделки");
}
