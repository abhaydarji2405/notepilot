import { LS_FILE_PREFIX } from '../constants';

/**
 * Generate a unique untitled tab name based on existing tabs
 */
export const generateUntitledName = (tabs) => {
  const untitledNumbers = tabs
    .filter((t) => t.name.startsWith('untitled-'))
    .map((t) => parseInt(t.name.replace('untitled-', ''), 10))
    .filter((n) => !isNaN(n));

  let num = 1;
  while (untitledNumbers.includes(num)) {
    num++;
  }
  return `untitled-${num}`;
};

/**
 * Save file content to localStorage
 */
export const saveToLocalStorage = (tabId, content) => {
  try {
    localStorage.setItem(`${LS_FILE_PREFIX}${tabId}`, content);
  } catch {
    // Storage might be full; silently fail
  }
};

/**
 * Load file content from localStorage
 */
export const loadFromLocalStorage = (tabId) => {
  return localStorage.getItem(`${LS_FILE_PREFIX}${tabId}`) || '';
};

/**
 * Remove file content from localStorage
 */
export const removeFromLocalStorage = (tabId) => {
  localStorage.removeItem(`${LS_FILE_PREFIX}${tabId}`);
};

/**
 * Debounce a function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Format a drive file name for display (strip extension)
 */
export const displayName = (fileName) => fileName.replace(/\.txt$/, '');
