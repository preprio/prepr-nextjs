import React from 'react';
import { useEditModeContext } from '../contexts';
import RadioSelector from './radio-selector';

export default function EditModeSelector() {
  const { editMode, setEditMode } = useEditModeContext();

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
    />
  );
}
