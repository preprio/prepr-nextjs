import { useRef, useCallback } from 'react';
import { createScopedLogger } from '../../utils/debug';
import { createElementCache } from '../../utils/performance';

export function useStegaProximity() {
  const debug = createScopedLogger('useStegaProximity');
  const highlightedElementsRef = useRef<Set<HTMLElement>>(new Set());
  const getEncodedElements = createElementCache<HTMLElement>('[data-prepr-encoded]', 200);

  // Track on-screen candidates via IntersectionObserver
  const visibleElementsRef = useRef<Set<HTMLElement>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const refreshObserving = useCallback(() => {
    try {
      if (!('IntersectionObserver' in window)) return; // Fallback handled later

      // Reset observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      const visible = new Set<HTMLElement>();
      visibleElementsRef.current = visible;

      observerRef.current = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visible.add(el);
          } else {
            visible.delete(el);
          }
        });
      }, { root: null, rootMargin: '0px', threshold: 0 });

      const nodes = getEncodedElements();
      nodes.forEach(el => observerRef.current!.observe(el));
      debug.log('observing', nodes.length, 'encoded elements');
    } catch (e) {
      debug.log('error setting up IntersectionObserver:', e as Error);
    }
  }, [debug, getEncodedElements]);

  const stopObserving = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
      visibleElementsRef.current.clear();
    }
  }, []);

  const updateElementGradients = useCallback(
    (cursorX: number, cursorY: number) => {
      // Use visible candidates when available; fall back to all
      const candidates =
        visibleElementsRef.current.size > 0
          ? Array.from(visibleElementsRef.current)
          : Array.from(getEncodedElements());
      const newHighlightedElements = new Set<HTMLElement>();
      let highlightedCount = 0;

      candidates.forEach(element => {
        const rect = element.getBoundingClientRect();

        // Calculate shortest distance from cursor to element edges
        const distanceLeft = Math.abs(cursorX - rect.left);
        const distanceRight = Math.abs(cursorX - rect.right);
        const distanceTop = Math.abs(cursorY - rect.top);
        const distanceBottom = Math.abs(cursorY - rect.bottom);

        // Use minimum distance to any edge
        const distance = Math.min(
          distanceLeft,
          distanceRight,
          distanceTop,
          distanceBottom
        );

        const el = element as HTMLElement;
        if (distance < 150) {
          // Calculate relative cursor position within the element
          const relativeX = cursorX - rect.left;
          const relativeY = cursorY - rect.top;

          el.style.setProperty('--cursor-x', `${relativeX}px`);
          el.style.setProperty('--cursor-y', `${relativeY}px`);

          // Set gradient size based on element dimensions
          // Calculate base gradient size based on element dimensions
          const baseGradientSize = Math.max(
            150,
            Math.max(rect.width, rect.height) * 1.1
          );
          // Scale gradient size based on distance (400 is max distance, closer = larger gradient)
          const distanceScale = Math.max(0, (400 - distance) / 400);
          const gradientSize = baseGradientSize * distanceScale;

          el.style.setProperty('--gradient-size', `${gradientSize}px`);
          el.classList.add('prepr-proximity-highlight');
          newHighlightedElements.add(el);
          highlightedCount++;
        } else {
          el.classList.remove('prepr-proximity-highlight');
        }
      });

      // Update the highlighted elements reference
      highlightedElementsRef.current = newHighlightedElements;

      if (highlightedCount > 0) {
        debug.log('highlighted', highlightedCount, 'elements near cursor');
      }
    },
    [debug, getEncodedElements]
  );

  const clearAllHighlights = useCallback(() => {
    const highlightedElements = highlightedElementsRef.current;
    let clearedCount = 0;

    highlightedElements.forEach(element => {
      element.classList.remove('prepr-proximity-highlight');
      clearedCount++;
    });

    highlightedElementsRef.current.clear();

    if (clearedCount > 0) {
      debug.log('cleared highlights from', clearedCount, 'elements');
    }
  }, [debug]);

  return {
    updateElementGradients,
    clearAllHighlights,
    refreshObserving,
    stopObserving,
    highlightedElementsRef,
  };
}
