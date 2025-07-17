import React from 'react';
import StatusIndicatorPill from './status-indicator-pill';
import CloseEditModePill from './close-edit-mode-pill';

export default function ToolbarIndicatorWrapper() {
  return (
    <div className="p-fixed p-bottom-6 p-right-6 p-z-[999] p-flex p-gap-3">
      <StatusIndicatorPill />
      <CloseEditModePill />
    </div>
  );
}
