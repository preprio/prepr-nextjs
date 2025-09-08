# @preprio/prepr-nextjs

## 2.1.0-beta.0

### Minor Changes

- Preview mode toggle: Add a toolbar toggle to temporarily disable Prepr preview mode so you can browse the site using your own session cookie. Useful for verifying live behavior without leaving the preview context.
- Multi-locale support with detection: Add multi-locale handling with automatic browser language detection and sensible fallbacks. The selected locale persists to provide a consistent experience across navigation.

## 2.0.3

### Patch Changes

- Added CF exception for IP recognition

## 2.0.2

### Patch Changes

- Added auto close on segment & variant switch

## 2.0.1

### Patch Changes

- Add sendPreprEvent calls for state changes in context providers

  Implemented automatic event tracking when segments, variants, or edit mode states are updated:
  - Added `segment_changed` event when segments are switched
  - Added `variant_changed` event when variants are switched
  - Added `edit_mode_toggled` event when edit mode is toggled

  This enables better tracking and debugging of personalization state changes.

## 2.0.0

### Major Changes

- Major architectural overhaul with breaking changes to improve API design, performance, and developer experience.

  **BREAKING CHANGES:**

  • **Middleware API**: `PreprMiddleware` renamed to `createPreprMiddleware` with new import path (`@preprio/prepr-nextjs/middleware`) and required preview mode configuration
  • **Component Architecture**: `PreprPreviewBar` renamed to `PreprToolbar` with new provider pattern requiring `PreprToolbarProvider` wrapper
  • **Import Paths**: All imports reorganized - components moved to `/react`, server functions to `/server`, CSS to `/index.css`
  • **Server Functions**: `getPreviewBarProps()` renamed to `getToolbarProps()`, `getPreprHeaders()` now async
  • **Layout Implementation**: Requires complete restructuring with new provider pattern and tracking pixel integration

  **NEW FEATURES:**

  • **User Tracking**: New `PreprTrackingPixel` component and `extractAccessToken()` helper for personalization analytics
  • **Enhanced Middleware**: Improved chaining support with function overloads for better integration
  • **Performance Optimizations**: Reduced React re-renders, enhanced throttling, and improved DOM caching
  • **Error Handling**: New `PreprError` class with typed error codes and better debugging context
  • **TypeScript Improvements**: Stricter typing with readonly interfaces and cleaner API surface

  **MIGRATION REQUIRED**: This release requires code changes in middleware setup, component imports, layout structure, and CSS imports. See UPGRADE_GUIDE.md for complete migration instructions.
