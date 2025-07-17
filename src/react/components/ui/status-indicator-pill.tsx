import React from 'react';
import { usePreprToolbar } from '../toolbar/toolbar-provider';
import XMark from '../icons/xmark';
import { usePathname, useRouter } from 'next/navigation';

export default function StatusIndicatorPill() {
  const {
    selectedSegment,
    selectedVariant,
    emptySegment,
    emptyVariant,
    isIframe,
    resetPersonalization,
  } = usePreprToolbar();

  // Only show if a segment or variant is applied (not empty/null)
  const show =
    (selectedSegment &&
      selectedSegment._id !== (emptySegment?._id ?? 'null')) ||
    (selectedVariant && selectedVariant !== (emptyVariant ?? 'null'));

  const router = useRouter();
  const pathname = usePathname();

  const handleReset = () => {
    resetPersonalization();
    // Set preview params to 'null' in the URL, then remove them for a clean URL
    const params = new URLSearchParams();
    params.set('prepr_preview_segment', 'null');
    params.set('prepr_preview_ab', 'null');

    // First, push the URL with reset params to trigger any listeners
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();

    // Then, push the clean URL (without the reset params)
    router.push(pathname, { scroll: false });
    router.refresh();
  };

  if (isIframe) {
    return null;
  }

  return (
    <div className="p-z-[998] p-flex p-gap-2">
      {show && (
        <button
          type="button"
          onClick={handleReset}
          className="p-flex p-cursor-pointer p-items-center p-gap-2 p-rounded-full p-bg-primary-700 p-px-4 p-py-2 p-text-xs p-font-medium p-text-white p-shadow-lg p-transition-colors p-duration-150 hover:p-bg-primary-800"
        >
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
          <XMark className="p-h-3 p-w-3 p-text-white" />
        </button>
      )}
    </div>
  );
}
