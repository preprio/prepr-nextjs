'use client';

// Main exports
export {
  PreprPreviewBarProvider,
  usePreprPreviewBar,
} from './prepr-previewbar-provider';

export { default as PreprPreviewBar } from './components/prepr-preview-bar';

// Context exports
export * from './contexts';

// Hook exports
export { default as useStegaScan } from './hooks/use-stega-scan';
export { useStegaOverlay } from './hooks/use-stega-overlay';
export { useStegaProximity } from './hooks/use-stega-proximity';
export { useStegaElements } from './hooks/use-stega-elements';
export { useModal } from './hooks/use-modal';
export { default as useScrollPosition } from './hooks/use-scroll-position';

// Debug utilities
export {
  debugLog,
  debugWarn,
  debugError,
  createScopedLogger,
} from '../utils/debug';

// Component exports
export { StegaErrorBoundary } from './components/error-boundary';
export { default as PreviewBar } from './components/preview-bar/preview-bar';
export { default as PreviewBarWrapper } from './components/preview-bar-wrapper';
export { default as PreviewBarIndicatorWrapper } from './components/preview-bar-indicator-wrapper';
export { default as SegmentDropdown } from './components/segment-dropdown';
export { default as VariantSelector } from './components/variant-selector';
export { default as EditModeSelector } from './components/edit-mode-selector';
export { default as ResetButton } from './components/reset-button';
export { default as Logo } from './components/logo';
