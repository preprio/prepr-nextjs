import React from 'react';
import { usePreprToolbar } from '../toolbar/toolbar-provider';
import { usePreviewMode, useSegments, usePreprStore } from '../../../stores/prepr-store';
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

  const segments = useSegments();

  const router = useRouter();
  const pathname = usePathname();
  const previewMode = usePreviewMode();
  const setPreviewMode = usePreprStore(state => state.setPreviewMode);

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

  // Always show in preview mode; default segment label falls back to "All other users"
  const defaultSegmentName =
    segments.find(s => s._id === 'all_other_users')?.name || 'All other users';
  const segmentLabel = !previewMode
    ? 'User'
    : selectedSegment && selectedSegment._id !== (emptySegment?._id ?? 'null')
      ? selectedSegment.name
      : defaultSegmentName;

  return (
    <div className="p-z-[998] p-flex p-gap-2">
      <button
        type="button"
        onClick={previewMode ? handleReset : () => setPreviewMode(true)}
        className="p-flex p-items-center p-gap-2 p-rounded-full p-bg-primary-700 p-px-4 p-py-2 p-text-xs p-font-medium p-text-white p-shadow-lg"
      >
        <span className="p-text-[10px] p-text-white/60">Viewing as:</span>
        <span className="max-w-[120px] p-inline-block p-truncate">{segmentLabel}</span>
        {previewMode && selectedVariant && selectedVariant !== (emptyVariant ?? 'null') && (
          <span className="max-w-[80px] p-inline-block p-truncate p-rounded p-bg-white/20 p-px-2">
            {selectedVariant}
          </span>
        )}
      </button>
    </div>
  );
}
