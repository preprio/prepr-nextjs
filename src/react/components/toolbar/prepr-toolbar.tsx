'use client';

import React from 'react';
import { useEditMode } from '../../../stores/prepr-store';
import useStegaScan from '../../hooks/use-stega-scan';
import ToolbarWrapper from './toolbar-wrapper';
import ToolbarIndicatorWrapper from './toolbar-indicator-wrapper';

export default function PreprToolbar() {
  const editMode = useEditMode();

  useStegaScan(editMode);

  return (
    <>
      <ToolbarWrapper />
      <ToolbarIndicatorWrapper />
    </>
  );
}
