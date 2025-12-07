import { Coin } from '../types';

const STORAGE_KEY = 'numisma_collection_v1';

export const getStoredCoins = (): Coin[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load coins", error);
    return [];
  }
};

export const saveCoin = (coin: Coin): void => {
  try {
    const current = getStoredCoins();
    const updated = [coin, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save coin (likely quota exceeded)", error);
    alert("Storage limit reached. Try deleting some old coins or using smaller images.");
  }
};

export const deleteCoin = (id: string): void => {
  try {
    const current = getStoredCoins();
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to delete coin", error);
  }
};
