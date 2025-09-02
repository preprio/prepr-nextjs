import { useRef, useCallback } from 'react';
import { DOMService } from '../../utils/dom';
import { handleStegaError } from '../../utils/errors';
import { createScopedLogger } from '../../utils/debug';
import { vercelStegaDecode } from '@vercel/stega';

interface DecodedData {
  origin: string;
  href: string;
}

const decodeLogger = createScopedLogger('decode');

function decode(str: string | null): DecodedData | null {
  if (!str) return null;

  try {
    // First, try to decode the string directly
    decodeLogger.log('attempting to decode stega data');

    const decoded = vercelStegaDecode(str) as DecodedData;
    decodeLogger.log('vercelStegaDecode result:', decoded);

    if (decoded?.href) {
      decodeLogger.log('successfully decoded', decoded);
      return decoded;
    }
  } catch (e) {
    decodeLogger.log('error decoding stega data:', e as Error);
    // If it fails, it might be because of trailing characters.
    // Regex to find the JSON string
    const regex = /{"origin.*?}/;
    const match = str.match(regex);

    if (match) {
      try {
        // Now, try to decode the matched JSON string
        const decodedMatch = vercelStegaDecode(match[0]) as DecodedData;
        if (decodedMatch?.href) {
          decodeLogger.log('successfully decoded with regex match', decodedMatch);
          return decodedMatch;
        }
      } catch (e) {
        handleStegaError(e as Error, 'decode', { input: str });
      }
    }
  }

  return null;
}

export function useStegaOverlay() {
  const debug = createScopedLogger('useStegaOverlay');
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentElementRef = useRef<HTMLElement | null>(null);

  const createOverlay = useCallback(() => {
    const overlay = DOMService.createElement(
      'div',
      'prepr-overlay'
    ) as HTMLDivElement;
    overlay.style.display = 'none';

    const tooltip = DOMService.createElement(
      'div',
      'prepr-tooltip'
    ) as HTMLDivElement;
    tooltip.style.display = 'none';

    DOMService.appendToBody(overlay);
    DOMService.appendToBody(tooltip);

    overlayRef.current = overlay;
    tooltipRef.current = tooltip;

    debug.log('created overlay and tooltip elements');

    return { overlay, tooltip };
  }, [debug]);

  const showOverlay = useCallback(
    (element: HTMLElement) => {
      if (!overlayRef.current || !tooltipRef.current) return;

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      // Update active class on elements
      if (currentElementRef.current && currentElementRef.current !== element) {
        currentElementRef.current.classList.remove('prepr-overlay-active');
      }

      const rect = DOMService.getElementRect(element);
      const href = element.getAttribute('data-prepr-href');
      const origin = element.getAttribute('data-prepr-origin');

      debug.log('showing overlay for element:', { href, origin, rect });

      // Position overlay
      const overlay = overlayRef.current;
      overlay.style.display = 'block';
      overlay.style.top = `${rect.top + window.scrollY - 2}px`;
      overlay.style.left = `${rect.left + window.scrollX - 4}px`;
      overlay.style.width = `${rect.width + 8}px`;
      overlay.style.height = `${rect.height + 4}px`;

      // Position and show tooltip
      const tooltip = tooltipRef.current;
      if (tooltip && href && origin) {
        const MIN_WIDTH_FOR_TEXT = 80;
        const isCompact = rect.width < MIN_WIDTH_FOR_TEXT;
        tooltip.textContent = isCompact ? '↗' : `${origin} ↗`;
        tooltip.style.display = 'block';

        // Remove min-width constraint for compact tooltips
        if (isCompact) {
          tooltip.style.minWidth = 'auto';
        } else {
          tooltip.style.minWidth = '80px';
        }

        // Use requestAnimationFrame to ensure the DOM has updated before calculating position
        requestAnimationFrame(() => {
          if (tooltip) {
            // Compute desired positions
            let top = rect.top + window.scrollY - tooltip.clientHeight - 2;
            let left = rect.right + 4 - tooltip.clientWidth;

            // Clamp within viewport bounds
            const minTop = window.scrollY + 4;
            const maxTop = window.scrollY + window.innerHeight - tooltip.clientHeight - 4;
            const minLeft = window.scrollX + 4;
            const maxLeft = window.scrollX + window.innerWidth - tooltip.clientWidth - 4;

            if (top < minTop) {
              // If above viewport, place below the element
              top = rect.bottom + window.scrollY + 2;
            }
            top = Math.max(minTop, Math.min(top, maxTop));
            left = Math.max(minLeft, Math.min(left, maxLeft));

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
          }
        });

        tooltip.onclick = () =>
          window.open(href, '_blank', 'noopener,noreferrer');
      }

      currentElementRef.current = element;
      element.classList.add('prepr-overlay-active');
    },
    [debug]
  );

  const hideOverlay = useCallback(() => {
    if (!overlayRef.current || !tooltipRef.current) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      if (currentElementRef.current) {
        currentElementRef.current.classList.remove('prepr-overlay-active');
      }
      currentElementRef.current = null;
      debug.log('hidden overlay and tooltip');
    }, 100);
  }, [debug]);

  const cleanup = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (overlayRef.current) {
      DOMService.removeFromBody(overlayRef.current);
    }
    if (tooltipRef.current) {
      DOMService.removeFromBody(tooltipRef.current);
    }

    debug.log('cleaned up overlay and tooltip');
  }, [debug]);

  return {
    overlayRef,
    tooltipRef,
    currentElementRef,
    hideTimeoutRef,
    createOverlay,
    showOverlay,
    hideOverlay,
    cleanup,
    decode,
  };
}
