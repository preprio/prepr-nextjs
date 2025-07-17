'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PreprSegment } from '../../types';
import { handleContextError } from '../../utils/errors';

interface SegmentContextValue {
  segments: PreprSegment[];
  selectedSegment: PreprSegment;
  setSelectedSegment: (segment: PreprSegment) => void;
  emptySegment: PreprSegment;
}

const SegmentContext = createContext<SegmentContextValue | undefined>(
  undefined
);

interface SegmentProviderProps {
  children: ReactNode;
  initialSegments: readonly PreprSegment[];
  activeSegment?: string | null;
}

export function SegmentProvider({
  children,
  initialSegments,
  activeSegment,
}: SegmentProviderProps) {
  const segmentList: PreprSegment[] = [
    {
      _id: 'all_other_users',
      name: 'All other users',
    },
    ...initialSegments,
  ];

  const emptySegment: PreprSegment = {
    name: 'Choose segment',
    _id: 'null',
  };

  const [selectedSegment, setSelectedSegment] = useState<PreprSegment>(
    (segmentList &&
      segmentList.filter(
        (segmentData: PreprSegment) => segmentData._id === activeSegment
      )[0]) ||
      emptySegment
  );

  const value: SegmentContextValue = {
    segments: segmentList,
    selectedSegment,
    setSelectedSegment,
    emptySegment,
  };

  return (
    <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
  );
}

export function useSegmentContext(): SegmentContextValue {
  const context = useContext(SegmentContext);
  if (!context) {
    handleContextError('useSegmentContext');
  }
  return context!;
}
