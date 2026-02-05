import { useEffect, useRef } from 'react';
import { vercelStegaSplit, vercelStegaDecode } from '@vercel/stega';
import { createScopedLogger } from '../../utils/debug';

interface DecodedData {
  href: string;
  origin: string;
}

interface CleanedInfo {
  original: string;
  cleaned: string;
}

const debug = createScopedLogger('useStegaClean');

export function useStegaClean(previewMode: boolean) {
  const isProcessingRef = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const cleanedNodesRef = useRef<WeakMap<Text, CleanedInfo>>(new WeakMap());

  useEffect(() => {
    // Only run in preview mode and client-side (after hydration)
    if (!previewMode || typeof window === 'undefined') {
      return;
    }

    debug.log('starting stega clean in preview mode');

    const cleanTextNode = (textNode: Text): boolean => {
      // Skip if already processing this node or if it's in excluded elements
      if (textNode.parentElement?.closest('script, style, noscript')) {
        return false;
      }

      const textContent = textNode.textContent;
      if (!textContent?.trim()) {
        return false;
      }

      // Check if already cleaned
      const cleanedInfo = cleanedNodesRef.current.get(textNode);
      if (cleanedInfo && textContent === cleanedInfo.cleaned) {
        return false;
      }

      try {
        const { cleaned, encoded } = vercelStegaSplit(textContent);

        // Only process if there's encoded data and text differs
        if (encoded && cleaned !== textContent) {
          const decoded = vercelStegaDecode(textContent) as DecodedData;

          if (decoded?.href) {
            // Store original and cleaned text in WeakMap
            cleanedNodesRef.current.set(textNode, {
              original: textContent,
              cleaned: cleaned,
            });

            // Update text content to cleaned version
            textNode.textContent = cleaned;

            // Find the target element for data attributes
            // If there's a parent with data-prepr-edit-target, use that (backward compatibility)
            // Otherwise, use the immediate parent
            let targetElement = textNode.parentElement;
            const editTargetParent = textNode.parentElement?.closest(
              '[data-prepr-edit-target]'
            );
            if (editTargetParent) {
              targetElement = editTargetParent as HTMLElement;
            }

            if (targetElement) {
              targetElement.setAttribute('data-prepr-encoded', '');
              targetElement.setAttribute('data-prepr-href', decoded.href);
              targetElement.setAttribute('data-prepr-origin', decoded.origin);
              debug.log('cleaned text node:', {
                original: textContent,
                cleaned: cleaned,
                href: decoded.href,
                origin: decoded.origin,
                targetElement: targetElement.tagName,
              });
              return true;
            }
          }
        }
      } catch (e) {
        // Silently ignore decode errors
        debug.log('error cleaning text node:', String(e));
      }

      return false;
    };

    const scanAndClean = () => {
      debug.log('scanning document for stega-encoded text');
      isProcessingRef.current = true;

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: node => {
            if (node.parentElement?.closest('script, style, noscript')) {
              return NodeFilter.FILTER_REJECT;
            }
            if (!node.textContent?.trim()) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let cleanedCount = 0;
      let textNode: Node | null;

      while ((textNode = walker.nextNode())) {
        if (cleanTextNode(textNode as Text)) {
          cleanedCount++;
        }
      }

      debug.log('scan complete, cleaned', cleanedCount, 'text nodes');
      isProcessingRef.current = false;
    };

    const setupMutationObserver = () => {
      let debounceTimeout: NodeJS.Timeout | null = null;

      const handleMutations = (mutations: MutationRecord[]) => {
        // Skip if we're currently processing (prevent infinite loops)
        if (isProcessingRef.current) {
          return;
        }

        // Collect affected text nodes
        const affectedNodes = new Set<Text>();

        mutations.forEach(mutation => {
          // Handle new nodes
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                affectedNodes.add(node as Text);
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Scan all text nodes in added element
                const walker = document.createTreeWalker(
                  node,
                  NodeFilter.SHOW_TEXT,
                  {
                    acceptNode: n => {
                      if (n.parentElement?.closest('script, style, noscript')) {
                        return NodeFilter.FILTER_REJECT;
                      }
                      return NodeFilter.FILTER_ACCEPT;
                    },
                  }
                );
                let textNode: Node | null;
                while ((textNode = walker.nextNode())) {
                  affectedNodes.add(textNode as Text);
                }
              }
            });
          }

          // Handle text content changes (React re-renders)
          if (
            mutation.type === 'characterData' &&
            mutation.target.nodeType === Node.TEXT_NODE
          ) {
            const textNode = mutation.target as Text;
            const cleanedInfo = cleanedNodesRef.current.get(textNode);

            // Check if React restored the original encoded text
            if (cleanedInfo && textNode.textContent === cleanedInfo.original) {
              affectedNodes.add(textNode);
            }
          }
        });

        if (affectedNodes.size > 0) {
          // Debounce to batch multiple rapid changes
          if (debounceTimeout) {
            clearTimeout(debounceTimeout);
          }

          debounceTimeout = setTimeout(() => {
            isProcessingRef.current = true;
            let reCleanedCount = 0;

            affectedNodes.forEach(textNode => {
              if (cleanTextNode(textNode)) {
                reCleanedCount++;
              }
            });

            if (reCleanedCount > 0) {
              debug.log(
                're-cleaned',
                reCleanedCount,
                'text nodes after mutation'
              );
            }

            isProcessingRef.current = false;
          }, 50);
        }
      };

      observerRef.current = new MutationObserver(handleMutations);
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      debug.log('mutation observer set up');
    };

    // Use requestIdleCallback for non-blocking initial scan
    const scheduleInitialScan = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          scanAndClean();
          setupMutationObserver();
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          scanAndClean();
          setupMutationObserver();
        }, 0);
      }
    };

    scheduleInitialScan();

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      cleanedNodesRef.current = new WeakMap();
      debug.log('cleaned up stega clean');
    };
  }, [previewMode]);
}
