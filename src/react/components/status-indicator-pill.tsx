import React from 'react';
import { usePreprPreviewBar } from '../prepr-previewbar-provider';

export default function StatusIndicatorPill() {
  const {
    selectedSegment,
    selectedVariant,
    emptySegment,
    emptyVariant,
    isIframe,
  } = usePreprPreviewBar();

  // Only show if a segment or variant is applied (not empty/null)
  const show =
    (selectedSegment &&
      selectedSegment._id !== (emptySegment?._id ?? 'null')) ||
    (selectedVariant && selectedVariant !== (emptyVariant ?? 'null'));

  if (isIframe) {
    return null;
  }

  return (
    <div className="p-z-[998] p-flex p-gap-2">
      {show && (
        <div className="p-flex p-items-center p-gap-2 p-rounded-full p-bg-primary-700 p-px-4 p-py-2 p-text-xs p-font-medium p-text-white p-shadow-lg">
          <span className="p-text-[10px] p-text-white/60">viewing as</span>
          {selectedSegment &&
            selectedSegment._id !== (emptySegment?._id ?? 'null') && (
              <span className="max-w-[120px] p-inline-block p-truncate">
                {selectedSegment.name}
              </span>
            )}
          {selectedVariant && selectedVariant !== (emptyVariant ?? 'null') && (
            <span className="max-w-[80px] p-inline-block p-truncate p-rounded p-bg-white/20 p-px-2">
              {selectedVariant}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
