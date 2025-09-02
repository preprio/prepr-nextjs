import React from 'react';
import { usePreviewMode, usePreprStore } from '../../../stores/prepr-store';
import XMark from '../icons/xmark';
import { usePreprToolbar } from '../toolbar/toolbar-provider';

export default function PreviewModePill() {
  const previewMode = usePreviewMode();
  const setPreviewMode = usePreprStore(state => state.setPreviewMode);
  const { isIframe } = usePreprToolbar();

  // Only show when toolbar preview mode is OFF and not in iframe
  if (previewMode || isIframe) {
    return null;
  }

  return (
    <div className="p-z-[999] p-flex">
      <button
        type="button"
        onClick={() => setPreviewMode(true)}
        className="p-flex p-items-center p-gap-2 p-rounded-full p-bg-primary-50 p-px-4 p-py-2 p-text-xs p-font-medium p-text-gray-800 p-shadow-lg p-transition-colors p-duration-150 hover:p-bg-primary-100"
        aria-label="Enable Editor Overrides"
      >
        <span>Viewing as: User</span>
        <XMark className="transition-colors duration-150 p-h-4 p-w-4 p-text-gray-500 hover:p-text-gray-700" />
      </button>
    </div>
  );
}
