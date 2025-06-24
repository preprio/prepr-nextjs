import React from 'react';
import { usePreprPreviewBar } from '../prepr-previewbar-provider';
import XMark from './icons/xmark';

export default function CloseEditModePill() {
  const { editMode, setEditMode, isIframe } = usePreprPreviewBar();

  if (!editMode || isIframe) {
    return null;
  }

  return (
    <div className="p-z-[999] p-flex">
      <button
        type="button"
        onClick={() => setEditMode && setEditMode(false)}
        className="p-flex p-items-center p-gap-2 p-rounded-full p-bg-primary-50 p-px-4 p-py-2 p-text-xs p-font-medium p-text-gray-800 p-shadow-lg p-transition-colors p-duration-150 hover:p-bg-primary-100"
        aria-label="Close edit mode"
      >
        <span>Edit mode</span>
        <XMark className="transition-colors duration-150 p-h-4 p-w-4 p-text-gray-500 hover:p-text-gray-700" />
      </button>
    </div>
  );
}
