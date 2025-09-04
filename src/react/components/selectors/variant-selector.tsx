import React from 'react';
import { useSelectedVariant, usePreprStore } from '../../../stores/prepr-store';
import { usePathname, useRouter } from 'next/navigation';
import RadioSelector from './radio-selector';
import { usePreviewMode } from '../../../stores/prepr-store';

export default function VariantSelector() {
  const selectedVariant = useSelectedVariant();
  const setSelectedVariant = usePreprStore(state => state.setSelectedVariant);

  const pathname = usePathname();
  const router = useRouter();
  const previewMode = usePreviewMode();

  const updateSelectedVariant = (value: string | boolean) => {
    const params = new URLSearchParams(window.location.search);
    setSelectedVariant(String(value));
    params.set('prepr_preview_ab', String(value));

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
    router.refresh();
  };

  const options = [
    { value: 'A', label: 'A', width: 'p-w-[82px]' },
    { value: 'B', label: 'B', width: 'p-w-[82px]' },
  ];

  // Always show 'A' as active when state is not 'B'
  const displayValue = selectedVariant === 'B' ? 'B' : 'A';

  return (
    <RadioSelector
      value={displayValue}
      onChange={updateSelectedVariant}
      options={options}
      disabled={!previewMode}
    />
  );
}
