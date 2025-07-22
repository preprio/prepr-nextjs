import React from 'react';
import { StatusIndicatorPill, CloseEditModePill } from '../ui';

export default function ToolbarIndicatorWrapper() {
  return (
    <div className="p-fixed p-bottom-6 p-right-6 p-z-[999] p-flex p-gap-3">
      <StatusIndicatorPill />
      <CloseEditModePill />
    </div>
  );
}
