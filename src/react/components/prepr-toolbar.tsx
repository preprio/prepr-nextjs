'use client';

import React from 'react';
import { useEditModeContext } from '../contexts';
import useStegaScan from '../hooks/use-stega-scan';
import PreviewBarWrapper from './toolbar-wrapper';
import PreviewBarIndicatorWrapper from './toolbar-indicator-wrapper';

export default function PreprToolbar() {
  const { editMode } = useEditModeContext();

  useStegaScan(editMode);

  return (
    <>
      <PreviewBarWrapper />
      <PreviewBarIndicatorWrapper />
    </>
  );
}
