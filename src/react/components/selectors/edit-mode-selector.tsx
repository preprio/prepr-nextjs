import React from 'react';
import { useEditMode, usePreprStore, usePreviewMode } from '../../../stores/prepr-store';
import RadioSelector from './radio-selector';

export default function EditModeSelector() {
  const editMode = useEditMode();
  const setEditMode = usePreprStore(state => state.setEditMode);
  const previewMode = usePreviewMode();

  const updateEditMode = (value: string | boolean) => {
    setEditMode(value === 'true' || value === true);
  };

  const options = [
    { value: 'false', label: 'Off' },
    { value: 'true', label: 'On' },
  ];

  return (
    <RadioSelector
      options={options}
      value={editMode.toString()}
      onChange={updateEditMode}
      disabled={!previewMode}
    />
  );
}
