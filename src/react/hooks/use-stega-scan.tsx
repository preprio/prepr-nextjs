import { useEffect, useRef, useCallback, useMemo } from 'react';
import { DOMService } from '../../utils/dom';
import { createScopedLogger } from '../../utils/debug';
import { throttle } from '../../utils/performance';
import { useStegaOverlay } from './use-stega-overlay';
import { useStegaProximity } from './use-stega-proximity';
import { useStegaElements } from './use-stega-elements';

export default function useStegaScan(editMode: boolean): void {
  const debug = createScopedLogger('useStegaScan');
  const isInitializedRef = useRef(false);

  const {
    currentElementRef,
    hideTimeoutRef,
    createOverlay,
    showOverlay,
    hideOverlay,
    cleanup: cleanupOverlay,
    decode,
  } = useStegaOverlay();

  const {
    updateElementGradients,
    clearAllHighlights,
    refreshObserving,
    stopObserving,
  } = useStegaProximity();

  const {
    getElements,
    scanDocument,
    setupMutationObserver,
    cleanup: cleanupElements,
  } = useStegaElements();

  // Memoize the throttled mouse move handler
  const throttledMouseMove = useMemo(
    () =>
      throttle((e: Event) => {
        const mouseEvent = e as MouseEvent;
        const target = mouseEvent.target as HTMLElement;
        // Early return if hovering over tooltip
        if (target.closest('.prepr-tooltip')) {
          return;
        }
        updateElementGradients(mouseEvent.clientX, mouseEvent.clientY);
        const encodedElement = target.closest('[data-prepr-encoded]');
        if (encodedElement) {
          showOverlay(encodedElement as HTMLElement);
        } else {
          hideOverlay();
        }
      }, 16),
    [updateElementGradients, showOverlay, hideOverlay]
  );

  // Memoize tooltip handlers
  const handleTooltipMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, [hideTimeoutRef]);

  const handleTooltipMouseLeave = useCallback(() => {
    if (!currentElementRef.current) {
      hideOverlay();
    }
  }, [currentElementRef, hideOverlay]);

  useEffect(() => {
    debug.log('editMode changed to', editMode);
    if (!editMode) {
      debug.log('editMode is false, cleaning up');
      if (isInitializedRef.current) {
        DOMService.removeEventListener(
          document,
          'mousemove',
          throttledMouseMove
        );
        cleanupOverlay();
        clearAllHighlights();
        cleanupElements();
        isInitializedRef.current = false;
      }
      return;
    }
    if (isInitializedRef.current) {
      debug.log('already initialized, skipping setup');
      return;
    }
    debug.log('editMode is true, setting up scanning');
    // Create overlay and tooltip elements
    const { tooltip } = createOverlay();
    debug.log('created overlay and tooltip');
    DOMService.addEventListener(tooltip, 'mouseenter', handleTooltipMouseEnter);
    DOMService.addEventListener(tooltip, 'mouseleave', handleTooltipMouseLeave);
    debug.log('starting document scan');
    scanDocument(decode);
    const elements = getElements();
    debug.log('found', elements.length, 'encoded elements after scan');
    // Start observing visible candidates
    refreshObserving();
    setupMutationObserver(decode, () => {
      // Refresh visible candidates on DOM changes
      refreshObserving();
    });
    debug.log('set up mutation observer');
    DOMService.addEventListener(document, 'mousemove', throttledMouseMove);
    debug.log('added throttled mousemove handler');
    isInitializedRef.current = true;
    return () => {
      debug.log('cleaning up');
      DOMService.removeEventListener(document, 'mousemove', throttledMouseMove);
      DOMService.removeEventListener(
        tooltip,
        'mouseenter',
        handleTooltipMouseEnter
      );
      DOMService.removeEventListener(
        tooltip,
        'mouseleave',
        handleTooltipMouseLeave
      );
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      cleanupOverlay();
      clearAllHighlights();
      stopObserving();
      cleanupElements();
      isInitializedRef.current = false;
    };
  }, [editMode]);
}
