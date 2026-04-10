// Утилита для работы с Telegram WebApp
// Сейчас: определение среды + логирование пользователя
// Будущее: проверка прав (isAdmin), передача initData на backend

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/** Возвращает true, если приложение открыто внутри Telegram */
export function isTelegram(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.Telegram?.WebApp;
}

/** Возвращает объект пользователя из initDataUnsafe или null */
export function getTelegramUser(): TelegramUser | null {
  if (!isTelegram()) return null;
  return window.Telegram?.WebApp.initDataUnsafe?.user ?? null;
}
