import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toolbar } from './toolbar';

export default function ToolbarWrapper() {
  const searchParams = useSearchParams();
  const [isIframe, setIsIframe] = useState<boolean>(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    // Check for the blocked shortcuts
    const isSaveShortcut = (event.ctrlKey || event.metaKey) && key === 's';
    const isPrintShortcut = (event.ctrlKey || event.metaKey) && key === 'p';
    const isAddressBarShortcut =
      (event.ctrlKey || event.metaKey) && key === 'l';
    if (isSaveShortcut || isPrintShortcut || isAddressBarShortcut) {
      event.preventDefault(); // Prevent the browser's default action
    }
  };

  useEffect(() => {
    const isIframe =
      typeof window !== 'undefined' && window?.parent !== window.self;
    if (isIframe) {
      setIsIframe(true);
      const previewBarMessage = {
        name: 'prepr_preview_bar',
        event: 'loaded',
      };
      window.parent.postMessage(previewBarMessage, '*');
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (isIframe) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  if (searchParams.get('prepr_hide_bar') === 'true' || isIframe) {
    return null;
  }

  return <Toolbar />;
}
