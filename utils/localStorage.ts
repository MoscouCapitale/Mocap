import { AppStorage } from "@models/App.ts";

const saveToLocalStorage = (key: string, value: string): void => {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch (_e) {
    console.error("Error saving to local storage");
  }
};

const getFromLocalStorage = (key: string): string | null => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (_e) {
    return null;
  }
};

export const saveAppStorage = (appStorage: AppStorage): void => {
  saveToLocalStorage("APP_STORE", appStorage as string);
};

export const getAppStorage = (): AppStorage | null => {
  return getFromLocalStorage("APP_STORE") as AppStorage | null;
};
