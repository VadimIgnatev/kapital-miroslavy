"use client";

import { useEffect } from "react";
import { isTelegram, getTelegramUser } from "@/lib/telegram";

/**
 * Невидимый компонент — монтируется один раз в layout.
 * Инициализирует Telegram WebApp: ready() + expand() + логирование.
 */
export default function TelegramInit() {
  useEffect(() => {
    if (!isTelegram()) {
      console.log("[App] running in browser");
      return;
    }

    console.log("[App] running in Telegram");

    const tg = window.Telegram!.WebApp;

    // Сообщаем Telegram, что приложение готово
    tg.ready();

    // Разворачиваем на весь экран
    tg.expand();

    // Цвета шапки и фона под стиль приложения
    try {
      tg.setHeaderColor("bg_color");
      tg.setBackgroundColor("#fafaf9");
    } catch {
      // Старые версии клиента могут не поддерживать эти методы
    }

    // Логируем пользователя (для отладки)
    const user = getTelegramUser();
    if (user) {
      console.log(
        `[Telegram] user_id: ${user.id} | username: ${user.username ?? "—"} | name: ${user.first_name ?? "—"}`
      );
    } else {
      console.log("[Telegram] WebApp detected, user not available");
    }
  }, []);

  return null;
}
