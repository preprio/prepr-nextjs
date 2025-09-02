import React from 'react';
import { usePreviewMode, usePreprStore } from '../../../stores/prepr-store';
import RadioSelector from './radio-selector';

export default function PreviewModeSelector() {
  const previewMode = usePreviewMode();
  const setPreviewMode = usePreprStore(state => state.setPreviewMode);

  const updatePreviewMode = (value: string | boolean) => {
    setPreviewMode(value === 'true' || value === true);
  };

  const options = [
    {
      value: 'false',
      label: 'User',
      title: 'View the site as a real user (use cookies)'
    },
    {
      value: 'true',
      label: 'Preview',
      title: 'Use the toolbar to simulate segments and A/B variants'
    },
  ];

  return (
    <RadioSelector
      options={options}
      value={previewMode.toString()}
      onChange={updatePreviewMode}
    />
  );
}
