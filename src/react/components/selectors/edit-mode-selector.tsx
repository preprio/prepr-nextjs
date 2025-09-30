import React from 'react';
import { useEditMode, usePreprStore } from '../../../stores/prepr-store';
import RadioSelector from './radio-selector';
import { useTranslations } from '../../hooks/use-i18n';

export default function EditModeSelector() {
  const editMode = useEditMode();
  const setEditMode = usePreprStore(state => state.setEditMode);
  const { t } = useTranslations();
  const updateEditMode = (value: string | boolean) => {
    setEditMode(value === 'true' || value === true);
  };

  const options = [
    { value: 'false', label: t('common.off') },
    { value: 'true', label: t('common.on') },
  ];

  return (
    <RadioSelector
      options={options}
      value={editMode.toString()}
      onChange={updateEditMode}
    />
  );
}
