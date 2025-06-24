'use client';

import React, { ReactNode, useEffect } from 'react';
import { PreprPreviewBarOptions, PreprPreviewBarProps } from '../types';
import {
  SegmentProvider,
  VariantProvider,
  EditModeProvider,
  useSegmentContext,
  useVariantContext,
  useEditModeContext,
} from './contexts';
import { StegaErrorBoundary } from './components/error-boundary';
import { initDebugLogger } from '../utils/debug';

interface PreprPreviewBarProviderProps {
  children: ReactNode;
  props: PreprPreviewBarProps;
  options?: PreprPreviewBarOptions;
}

export const PreprPreviewBarProvider: React.FC<
  PreprPreviewBarProviderProps
> = ({ children, props, options }) => {
  const { activeSegment, activeVariant, data } = props;

  // Initialize debug logger with options
  useEffect(() => {
    const debugEnabled = options?.debug ?? false;
    initDebugLogger(debugEnabled);
  }, [options?.debug]);

  return (
    <StegaErrorBoundary>
      <SegmentProvider initialSegments={data} activeSegment={activeSegment}>
        <VariantProvider activeVariant={activeVariant}>
          <EditModeProvider>{children}</EditModeProvider>
        </VariantProvider>
      </SegmentProvider>
    </StegaErrorBoundary>
  );
};

// Legacy hook for backward compatibility
export const usePreprPreviewBar = () => {
  // This will be deprecated in favor of specific context hooks
  // but kept for backward compatibility
  const segmentContext = useSegmentContext();
  const variantContext = useVariantContext();
  const editModeContext = useEditModeContext();

  return {
    isPreviewMode: false,
    activeSegment: segmentContext.selectedSegment._id,
    activeVariant: variantContext.selectedVariant,
    data: segmentContext.segments,
    emptySegment: segmentContext.emptySegment,
    segmentList: segmentContext.segments,
    selectedSegment: segmentContext.selectedSegment,
    setSelectedSegment: segmentContext.setSelectedSegment,
    emptyVariant: variantContext.emptyVariant,
    selectedVariant: variantContext.selectedVariant,
    setSelectedVariant: variantContext.setSelectedVariant,
    editMode: editModeContext.editMode,
    setEditMode: editModeContext.setEditMode,
    isIframe: editModeContext.isIframe,
    resetSelected: () => {
      segmentContext.setSelectedSegment(segmentContext.emptySegment);
      variantContext.setSelectedVariant(variantContext.emptyVariant);
      editModeContext.setEditMode(false);
    },
  };
};
