import { useState, useEffect } from "react";

/**
 * Custom hook for persistent localStorage with TypeScript support
 * @param key - The localStorage key
 * @param initialValue - The initial value if nothing is stored
 * @returns [storedValue, setValue] - Current value and setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Hook for clearing specific localStorage keys
 */
export function useClearStorage() {
  const clearKey = (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  };

  const clearAll = () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing all localStorage:", error);
    }
  };

  return { clearKey, clearAll };
}

/**
 * Hook for bulk localStorage operations
 */
export function useBulkStorage() {
  const exportData = (keys: string[]) => {
    const data: Record<string, any> = {};
    keys.forEach((key) => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          data[key] = JSON.parse(item);
        }
      } catch (error) {
        console.error(`Error exporting key "${key}":`, error);
      }
    });
    return data;
  };

  const importData = (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error importing key "${key}":`, error);
      }
    });
  };

  return { exportData, importData };
}
