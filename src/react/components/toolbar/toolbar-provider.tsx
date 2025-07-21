'use client';

import React, { ReactNode, useEffect, useCallback, useMemo } from 'react';
import { PreprToolbarOptions, PreprToolbarProps } from '../../../types';
import {
  SegmentProvider,
  VariantProvider,
  EditModeProvider,
  useSegmentContext,
  useVariantContext,
  useEditModeContext,
} from '../../contexts';
import { StegaErrorBoundary } from '../error-boundary';
import { initDebugLogger } from '../../../utils/debug';
import useScrollPosition from '../../hooks/use-scroll-position';

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
  const { activeSegment, activeVariant, data } = props;

  // Initialize debug logger with options
  useEffect(() => {
    const debugEnabled = options?.debug ?? false;
    initDebugLogger(debugEnabled);
  }, [options?.debug]);

  // Initialize scroll position handling for iframe communication
  useScrollPosition();

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
export const usePreprToolbar = () => {
  // This will be deprecated in favor of specific context hooks
  // but kept for backward compatibility
  const segmentContext = useSegmentContext();
  const variantContext = useVariantContext();
  const editModeContext = useEditModeContext();

  const resetPersonalization = useCallback(() => {
    segmentContext.setSelectedSegment(segmentContext.emptySegment);
    variantContext.setSelectedVariant(variantContext.emptyVariant);
  }, [segmentContext, variantContext]);

  const resetAll = useCallback(() => {
    segmentContext.setSelectedSegment(segmentContext.emptySegment);
    variantContext.setSelectedVariant(variantContext.emptyVariant);
    editModeContext.setEditMode(false);
  }, [segmentContext, variantContext, editModeContext]);

  return useMemo(
    () => ({
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
      resetPersonalization,
      resetAll,
    }),
    [
      segmentContext.selectedSegment,
      segmentContext.segments,
      segmentContext.emptySegment,
      segmentContext.setSelectedSegment,
      variantContext.selectedVariant,
      variantContext.emptyVariant,
      variantContext.setSelectedVariant,
      editModeContext.editMode,
      editModeContext.setEditMode,
      editModeContext.isIframe,
      resetPersonalization,
      resetAll,
    ]
  );
};
