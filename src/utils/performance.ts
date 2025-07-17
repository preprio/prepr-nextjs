// Performance utilities

/**
 * Throttled function with cancellation support
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

/**
 * Improved throttle function with better memory management and cancellation
 * @param func - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns Throttled function with cancel method
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ThrottledFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  const throttledFunc = ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    if (timeSinceLastExec >= delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - timeSinceLastExec);
    }
  }) as ThrottledFunction<T>;

  throttledFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttledFunc;
}

/**
 * Debounce function with cancellation support
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns Debounced function with cancel method
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ThrottledFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFunc = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }) as ThrottledFunction<T>;

  debouncedFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunc;
}

// Simple DOM element cache for querySelectorAll
export function createElementCache<T extends Element = Element>(
  query: string,
  ttl: number = 1000
) {
  let cache: NodeListOf<T> | null = null;
  let lastCacheTime = 0;
  return () => {
    const now = Date.now();
    if (!cache || now - lastCacheTime > ttl) {
      cache = document.querySelectorAll<T>(query);
      lastCacheTime = now;
    }
    return cache;
  };
}
