import React from 'react';
import { Logo } from '../ui';
import { SegmentSelector, VariantSelector, EditModeSelector, PreviewModeSelector } from '../selectors';
import { ResetButton } from '../ui';

interface ToolbarContentProps {
  onClose: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export function ToolbarContent({ onClose, contentRef }: ToolbarContentProps) {
  return (
    <div
      ref={contentRef}
      className="p-box-shadow p-right-0 p-z-[101] p-flex p-w-full p-flex-col p-gap-y-10 p-rounded-lg p-bg-primary-50 p-p-6 sm:p-w-[502px] sm:p-p-10"
    >
      {/* Header */}
      <div className="p-flex p-items-center p-justify-between p-gap-2">
        <div className="p-flex p-items-start p-gap-3">
          <Logo />
          <div className="p-flex p-h-6 p-items-center p-rounded p-bg-primary-100 p-px-3 p-py-1 p-text-sm p-text-primary-700">
            toolbar
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-flex p-h-8 p-w-8 p-cursor-pointer p-items-center p-justify-center p-rounded-md p-bg-primary-100 p-text-gray-700"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.17578 1.07031C8.41016 0.816406 8.82031 0.816406 9.05469 1.07031C9.30859 1.30469 9.30859 1.71484 9.05469 1.94922L5.75391 5.25L9.05469 8.57031C9.30859 8.80469 9.30859 9.21484 9.05469 9.44922C8.82031 9.70312 8.41016 9.70312 8.17578 9.44922L4.875 6.14844L1.55469 9.44922C1.32031 9.70312 0.910156 9.70312 0.675781 9.44922C0.421875 9.21484 0.421875 8.80469 0.675781 8.57031L3.97656 5.25L0.675781 1.94922C0.421875 1.71484 0.421875 1.30469 0.675781 1.07031C0.910156 0.816406 1.32031 0.816406 1.55469 1.07031L4.875 4.37109L8.17578 1.07031Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Personalized Content */}
      <div className="p-space-y-2">
        <span className="p-text-sm p-text-grey-400">Personalized content</span>
        <div className="p-gap p-flex p-flex-wrap p-items-center p-justify-between p-gap-x-6 p-gap-y-2">
          <h2 className="p-text-grey-800 p-font-semibold">View Mode</h2>
          <PreviewModeSelector />
        </div>
        <div className="p-gap p-flex p-flex-wrap p-items-center p-justify-between p-gap-x-6 p-gap-y-2">
          <h2 className="p-text-grey-800 p-font-semibold">Apply segment</h2>
          <SegmentSelector />
        </div>
        <div className="p-gap p-flex p-flex-wrap p-items-center p-justify-between p-gap-x-6 p-gap-y-2">
          <h2 className="p-text-grey-800 p-font-semibold">Show A/B variant</h2>
          <VariantSelector />
        </div>
      </div>

      {/* Collaboration */}
      <div className="p-space-y-2">
        <span className="p-text-sm p-text-grey-400">Collaboration</span>
        <div className="p-gap p-flex p-flex-wrap p-items-center p-justify-between p-gap-x-6 p-gap-y-2">
          <h2 className="p-text-grey-800 p-font-semibold">Edit mode</h2>
          <EditModeSelector />
        </div>
      </div>

      <ResetButton />
    </div>
  );
}
