import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils';
import { useEditModeContext } from '../../contexts';
import { useModal } from '../../hooks/useModal';
import { PreviewBarContent } from './preview-bar-content';
import { PreviewBarButton } from './preview-bar-button';

interface PreviewBarProps {
  children?: React.ReactNode;
}

export default function PreviewBar({ children }: PreviewBarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isBarVisible, setIsBarVisible] = React.useState(false);
  const { editMode } = useEditModeContext();
  const { contentRef, triggerRef } = useModal({
    isVisible: isBarVisible,
    onClose: () => setIsBarVisible(false),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ref for the popup box
  const popupBoxRef = React.useRef<HTMLDivElement>(null);
  const [popupTop, setPopupTop] = React.useState<string | number>('');

  const updatePopupPosition = React.useCallback(() => {
    if (popupBoxRef.current && triggerRef.current) {
      const popupHeight = popupBoxRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      // Center popup relative to the icon (trigger)
      const triggerCenter = triggerRect.top + triggerRect.height / 2;
      let top = triggerCenter - popupHeight / 2;
      // Clamp to leave at least 32px top and bottom
      top = Math.max(32, Math.min(top, windowHeight - popupHeight - 32));
      setPopupTop(top);
    }
  }, [triggerRef]);

  useEffect(() => {
    if (isBarVisible) {
      updatePopupPosition();
      window.addEventListener('resize', updatePopupPosition);
      return () => window.removeEventListener('resize', updatePopupPosition);
    }
    return undefined;
  }, [isBarVisible, updatePopupPosition]);

  const handleClick = () => {
    setIsBarVisible(!isBarVisible);
  };

  useEffect(() => {
    if (editMode) {
      setTimeout(() => {
        setIsBarVisible(false);
      }, 150);
    }
  }, [editMode]);

  const previewBarContent = (
    <>
      {isBarVisible && <div className="preview-bar-backdrop" />}
      <div className={cn('preview-bar-container')}>
        {/* Button holder*/}
        <div className="p-pr-4" ref={triggerRef}>
          <PreviewBarButton onClick={handleClick} />
        </div>

        {/* Box holder */}
        <div
          ref={popupBoxRef}
          style={
            popupTop !== ''
              ? { top: popupTop, position: 'fixed', right: 0 }
              : {}
          }
          className={cn(
            'preview-bar-popup',
            isBarVisible
              ? 'p-pointer-events-auto p-opacity-100'
              : 'p-pointer-events-none p-opacity-0'
          )}
        >
          {children || (
            <PreviewBarContent onClose={handleClick} contentRef={contentRef} />
          )}
        </div>
      </div>
    </>
  );

  if (!isMounted) return null;

  return createPortal(previewBarContent, document.body);
}

// Compound component pattern
PreviewBar.Content = PreviewBarContent;
PreviewBar.Button = PreviewBarButton;
