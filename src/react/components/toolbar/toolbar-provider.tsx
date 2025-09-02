'use client';

import React, { ReactNode, useEffect, useCallback, useMemo } from 'react';
import { PreprToolbarOptions, PreprToolbarProps } from '../../../types';
import { StegaErrorBoundary } from '../error-boundary';
import { PreprStoreInitializer } from '../store/prepr-store-initializer';
import { initDebugLogger } from '../../../utils/debug';
import useScrollPosition from '../../hooks/use-scroll-position';
import { usePreprStore, usePreviewMode } from '../../../stores/prepr-store';

interface PreprToolbarProviderProps {
  children: ReactNode;
  props: PreprToolbarProps;
  options?: PreprToolbarOptions;
}

export const PreprToolbarProvider: React.FC<PreprToolbarProviderProps> = ({
  children,
  props,
  options,
}) => {
  // Initialize debug logger with options
  useEffect(() => {
    const debugEnabled = options?.debug ?? false;
    initDebugLogger(debugEnabled);
  }, [options?.debug]);

  // Initialize scroll position handling for iframe communication
  useScrollPosition();

  return (
    <StegaErrorBoundary>
      <PreprStoreInitializer props={props}>{children}</PreprStoreInitializer>
    </StegaErrorBoundary>
  );
};

// Legacy hook for backward compatibility
export const usePreprToolbar = () => {
  // Convenience hook backed by Zustand store
  const selectedSegment = usePreprStore(s => s.selectedSegment);
  const segments = usePreprStore(s => s.segments);
  const emptySegment = usePreprStore(s => s.emptySegment);
  const setSelectedSegment = usePreprStore(s => s.setSelectedSegment);

  const selectedVariant = usePreprStore(s => s.selectedVariant);
  const emptyVariant = usePreprStore(s => s.emptyVariant);
  const setSelectedVariant = usePreprStore(s => s.setSelectedVariant);

  const editMode = usePreprStore(s => s.editMode);
  const setEditMode = usePreprStore(s => s.setEditMode);
  const isIframe = usePreprStore(s => s.isIframe);

  const resetPersonalizationStore = usePreprStore(s => s.resetPersonalization);
  const resetAllStore = usePreprStore(s => s.resetAll);
  const previewMode = usePreviewMode();

  const resetPersonalization = useCallback(() => {
    resetPersonalizationStore();
  }, [resetPersonalizationStore]);

  const resetAll = useCallback(() => {
    resetAllStore();
  }, [resetAllStore]);

  return useMemo(
    () => ({
      isPreviewMode: previewMode,
      activeSegment: selectedSegment._id,
      activeVariant: selectedVariant,
      data: segments,
      emptySegment,
      segmentList: segments,
      selectedSegment,
      setSelectedSegment,
      emptyVariant,
      selectedVariant,
      setSelectedVariant,
      editMode,
      setEditMode,
      isIframe,
      resetPersonalization,
      resetAll,
    }),
    [
      previewMode,
      selectedSegment,
      segments,
      emptySegment,
      setSelectedSegment,
      selectedVariant,
      emptyVariant,
      setSelectedVariant,
      editMode,
      setEditMode,
      isIframe,
      resetPersonalization,
      resetAll,
    ]
  );
};
