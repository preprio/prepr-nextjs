import { useRef, useCallback } from 'react';
import { createScopedLogger } from '../../utils/debug';

// Define the expected structure for decoded data
interface DecodedData {
  href: string;
  origin: string;
}

export function useStegaElements() {
  const debug = createScopedLogger('useStegaElements');
  const elementsRef = useRef<NodeListOf<Element> | undefined>(undefined);
  const observerRef = useRef<MutationObserver | null>(null);

  const getElements = useCallback(() => {
    if (!elementsRef.current) {
      elementsRef.current = document.querySelectorAll('[data-prepr-encoded]');
    }
    return elementsRef.current;
  }, []);

  const scanNode = useCallback(
    (node: Node, decode: (str: string | null) => DecodedData | null) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent?.trim()) return;
        if (node.parentElement?.closest('script, style, noscript')) return;
        const decoded = decode(node.textContent);
        if (decoded?.href) {
          const target = node.parentElement;
          if (target && !target.hasAttribute('data-prepr-encoded')) {
            target.setAttribute('data-prepr-encoded', '');
            target.setAttribute('data-prepr-href', decoded.href);
            target.setAttribute('data-prepr-origin', decoded.origin);
            debug.log('encoded element found:', {
              href: decoded.href,
              origin: decoded.origin,
            });
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          scanNode(node.childNodes[i], decode);
        }
      }
    },
    [debug]
  );

  const scanDocument = useCallback(
    (decode: (str: string | null) => DecodedData | null) => {
      debug.log('starting document scan');
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
      let textNode;
      let encodedCount = 0;
      while ((textNode = walker.nextNode())) {
        const decoded = decode(textNode.textContent);
        if (decoded?.href) {
          const target = textNode.parentElement;
          if (target && !target.hasAttribute('data-prepr-encoded')) {
            target.setAttribute('data-prepr-encoded', '');
            target.setAttribute('data-prepr-href', decoded.href);
            target.setAttribute('data-prepr-origin', decoded.origin);
            encodedCount++;
          }
        }
      }
      debug.log('document scan complete, encoded', encodedCount, 'elements');
      elementsRef.current = document.querySelectorAll('[data-prepr-encoded]');
    },
    [debug]
  );

  const setupMutationObserver = useCallback(
    (decode: (str: string | null) => DecodedData | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      let pendingMutations: MutationRecord[] = [];
      let debounceTimeout: NodeJS.Timeout | null = null;
      const processMutations = () => {
        const allAddedNodes = new Set<Node>();
        pendingMutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => allAddedNodes.add(node));
        });
        allAddedNodes.forEach(node => scanNode(node, decode));
        pendingMutations = [];
        elementsRef.current = document.querySelectorAll('[data-prepr-encoded]');
      };
      observerRef.current = new MutationObserver(mutations => {
        pendingMutations.push(...mutations);
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(processMutations, 100);
      });
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
      debug.log('mutation observer set up');
    },
    [scanNode, debug]
  );

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    const encodedElements = document.querySelectorAll('[data-prepr-encoded]');
    encodedElements.forEach(element => {
      element.removeAttribute('data-prepr-encoded');
      element.removeAttribute('data-prepr-href');
      element.removeAttribute('data-prepr-origin');
    });
    debug.log('cleaned up', encodedElements.length, 'encoded elements');
    elementsRef.current = undefined;
  }, [debug]);

  return {
    getElements,
    scanDocument,
    setupMutationObserver,
    cleanup,
  };
}
