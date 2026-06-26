

const isClient = typeof window !== 'undefined';

export const getItem = <T = any>(key: string): T | null => {
  if (!isClient) return null;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {

    return null;
  }
};

export const setItem = <T = any>(key: string, value: T): void => {
  if (!isClient) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {

    console.warn(`Failed to save to localStorage: ${key}`);
  }
};

export const removeItem = (key: string): void => {
  if (!isClient) return;

  try {
    localStorage.removeItem(key);
  } catch {

    console.warn(`Failed to remove from localStorage: ${key}`);
  }
};

export const clear = (): void => {
  if (!isClient) return;

  try {
    localStorage.clear();
  } catch {
    console.warn('Failed to clear localStorage');
  }
};
