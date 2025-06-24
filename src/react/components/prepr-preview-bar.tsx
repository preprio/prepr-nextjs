'use client';

import React from 'react';
import { useEditModeContext } from '../contexts';
import useStegaScan from '../hooks/use-stega-scan';
import PreviewBarWrapper from './preview-bar-wrapper';
import PreviewBarIndicatorWrapper from './preview-bar-indicator-wrapper';

export default function PreprPreviewBar() {
  const { editMode } = useEditModeContext();

  useStegaScan(editMode);

  return (
    <>
      <PreviewBarWrapper />
      <PreviewBarIndicatorWrapper />
    </>
  );
}
