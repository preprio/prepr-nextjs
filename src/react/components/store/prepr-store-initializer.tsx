'use client';

import React, { ReactNode, useEffect } from 'react';
import { usePreprStore } from '../../../stores/prepr-store';
import { PreprToolbarProps } from '../../../types';

interface PreprStoreInitializerProps {
  children: ReactNode;
  props: PreprToolbarProps;
}

export function PreprStoreInitializer({
  children,
  props,
}: PreprStoreInitializerProps) {
  const initialize = usePreprStore(state => state.initialize);
  const setIsIframe = usePreprStore(state => state.setIsIframe);
  const editMode = usePreprStore(state => state.editMode);
  const setEditMode = usePreprStore(state => state.setEditMode);
  const setToolbarOpen = usePreprStore(state => state.setToolbarOpen);

  // Initialize store with server data
  useEffect(() => {
    initialize({
      initialSegments: props.data,
      activeSegment: props.activeSegment,
      activeVariant: props.activeVariant,
    });
  }, [initialize, props.data, props.activeSegment, props.activeVariant]);

  // Handle iframe detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.parent !== window) {
      setIsIframe(true);
    }
  }, [setIsIframe]);

  // Handle escape key for edit mode
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && editMode) {
        setEditMode(false);
      }
    };

    if (editMode) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [editMode, setEditMode]);

  // Initialize preview mode from cookie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };

      const cookieValue = getCookie('Prepr-Preview-Mode');
      if (cookieValue !== null) {
        // Don't trigger events on initial load
        usePreprStore.setState({ previewMode: cookieValue === 'true' });
      }

      const toolbarOpenCookie = getCookie('Prepr-Toolbar-Open');
      if (toolbarOpenCookie !== null) {
        setToolbarOpen(toolbarOpenCookie === 'true');
      }
    }
  }, [setToolbarOpen]);

  return <>{children}</>;
}
