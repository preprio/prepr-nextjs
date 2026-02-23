'use client';

import { useStegaClean } from '../hooks/use-stega-clean';

export function PreprStegaClean() {
  useStegaClean(true);
  return null;
}
