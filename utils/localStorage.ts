import { AppStorage } from '@models/App.ts'

const saveToLocalStorage = (key: string, value: string): void => {
    return localStorage.setItem(key, JSON.stringify(value));
}

const getFromLocalStorage = (key: string): string | null => {
    return JSON.parse(localStorage.getItem(key) || "null");
}

export const saveAppStorage = (appStorage: AppStorage): void => {
    saveToLocalStorage("APP_STORE", appStorage as string);
}

export const getAppStorage = (): AppStorage | null => {
    return getFromLocalStorage("APP_STORE") as AppStorage;
}