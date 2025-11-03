// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function getStorageValue(key, defaultValue) {
  // Get stored value
  const saved = localStorage.getItem(key);
  const initial = saved ? JSON.parse(saved) : null;
  // Check if it's a function (as useState allows) or a value
  if (initial) return initial;
  if (defaultValue instanceof Function) return defaultValue();
  return defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // Store value in localStorage
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};