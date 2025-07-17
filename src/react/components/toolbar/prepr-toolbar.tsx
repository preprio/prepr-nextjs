'use client';

import React from 'react';
import { useEditModeContext } from '../../contexts';
import useStegaScan from '../../hooks/use-stega-scan';
import ToolbarWrapper from './toolbar-wrapper';
import ToolbarIndicatorWrapper from './toolbar-indicator-wrapper';

export default function PreprToolbar() {
  const { editMode } = useEditModeContext();

  useStegaScan(editMode);

  return (
    <>
      <ToolbarWrapper />
      <ToolbarIndicatorWrapper />
    </>
  );
}
