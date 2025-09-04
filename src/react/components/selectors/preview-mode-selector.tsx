import React from 'react';
import { usePreviewMode, usePreprStore } from '../../../stores/prepr-store';
import RadioSelector from './radio-selector';
import { useTranslations } from '../../hooks/use-i18n';

export default function PreviewModeSelector() {
  const previewMode = usePreviewMode();
  const setPreviewMode = usePreprStore(state => state.setPreviewMode);
  const { t } = useTranslations();
  const updatePreviewMode = (value: string | boolean) => {
    setPreviewMode(value === 'true' || value === true);
  };

  const options = [
    {
      value: 'false',
      label: t('common.off'),
      title: t('adaptiveContent.offDescription')
    },
    {
      value: 'true',
      label: t('common.on'),
      title: t('adaptiveContent.onDescription')
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
