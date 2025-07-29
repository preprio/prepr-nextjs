import { useEffect } from 'react';
import { sendPreprEvent } from '../../utils';
import { createScopedLogger } from '../../utils';

// Mark this hook as having side effects to prevent tree shaking

export default function useScrollPosition() {
  const debug = createScopedLogger('useScrollPosition');

  useEffect(() => {
    sendPreprEvent('getScrollPosition', {
      value: 0,
    });

    if (window.parent !== self) {
      let parentOrigin: string | null = null; //Get origin of parent outside iframe
      sendPreprEvent('loaded');

      const handleMessage = (evt: MessageEvent) => {
        debug.log('received message:', evt.data);

        if (evt?.data?.event === 'prepr:initVE' && !parentOrigin) {
          parentOrigin = evt.origin;

          if (evt.data?.scrollPosition) {
            debug.log('scrolling to position:', evt.data.scrollPosition);
            //Timeout needed in order to scroll to position
            setTimeout(() => {
              window.scrollTo(0, evt.data?.scrollPosition);
            }, 1);
          }
        }
        if (evt.origin !== parentOrigin) return;

        if (evt?.data?.event === 'prepr:getScrollPosition') {
          const currentScrollY =
            window.scrollY || document.documentElement.scrollTop;
          debug.log('sending scroll position:', currentScrollY);
          sendPreprEvent('getScrollPosition', {
            value: currentScrollY,
          });
        }
      };

      window.addEventListener('message', handleMessage);

      debug.log('set up iframe message listener');

      return () => {
        window.removeEventListener('message', handleMessage);
        debug.log('cleaned up iframe message listener');
      };
    } else {
      debug.log('not in iframe, skipping iframe setup');
      return undefined;
    }
  }, [debug]);

  // Return something to prevent tree shaking
  return true;
}
