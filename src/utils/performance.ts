// Performance utilities

// TODO: Refine the type for args and return value if possible
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return ((...args: unknown[]) => {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func(...(args as Parameters<T>));
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func(...(args as Parameters<T>));
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime)
      );
    }
  }) as T;
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
