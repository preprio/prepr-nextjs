# @preprio/prepr-nextjs

## 2.2.2

### Patch Changes

- **Fixed middleware preview params priority**: Preview query params (`prepr_preview_segment`, `prepr_preview_ab`) now always take priority over the `Prepr-Preview-Mode` cookie. Previously, if a user had toggled preview mode off in their browser, the CMS dashboard's iframe-based segment/variant previews would be blocked by that cookie. Preview headers are now always applied when preview query params are present, regardless of the cookie state.

## 2.2.1

### Patch Changes

- **Fixed live preview iframe cookie isolation**: Middleware now detects when running inside the Prepr live preview iframe (`prepr_hide_bar=true`) and skips reading/writing segment and variant cookies. This prevents the editor's own browser cookies from leaking into live preview sessions, ensuring the default (no segment/variant) is shown when no query params are present.

- **New `PreprStegaClean` component**: Added a standalone `PreprStegaClean` component that can be placed anywhere in the React tree to trigger stega cleaning without requiring the full toolbar. Exported from `@preprio/prepr-nextjs/react`.

- **Global observer deduplication in `useStegaClean`**: Added a module-level guard to prevent multiple `MutationObserver` instances from being created when `useStegaClean` is mounted more than once (e.g. from both the toolbar provider and `PreprStegaClean`).

- **Improved stega scan cleanup**: `useStegaScan` now calls `cleanupElements()` on edit mode deactivation in addition to `cleanupVisuals()`, ensuring data attributes are fully removed when edit mode is turned off.

- **React hook dependency fixes**: Corrected exhaustive dependency arrays in `useStegaScan` and `use-i18n` to satisfy React's rules of hooks and prevent stale closure bugs.

## 2.2.0

### Minor Changes

- **Auto stega scan & clean on load**: Automatically detect and clean stega-encoded text on page load in preview mode, eliminating invisible Unicode characters that cause layout shifts with `letter-spacing` and `ReactWrapBalancer`.
  - New `useStegaClean` hook scans DOM for stega-encoded text after hydration and cleans it automatically
  - WeakMap-based tracking handles React re-renders gracefully without infinite loops
  - Data attributes persist across edit mode toggles for instant re-activation without re-scanning

- **Enhanced cleanup system**: Split cleanup into `cleanupVisuals()` (preserves data attributes) and `cleanupAll()` (full cleanup) for better performance and instant edit mode re-activation.

- **Fixed frozen overlay states**: Added immediate scroll handling with `hideOverlayImmediate()` and `handleScroll()` callback to instantly hide overlay and gradients when scrolling, preventing frozen visual states.

- **Performance optimization**: Added `skipIfTagged` parameter to skip redundant re-scanning of pre-cleaned elements when toggling edit mode.

## 2.1.1

### Patch Changes

- Updated translation for enable preview toggle

## 2.1.0

### Minor Changes

- Preview mode toggle: Add a toolbar toggle to temporarily disable Prepr preview mode so you can browse the site using your own session cookie. Useful for verifying live behavior without leaving the preview context.
- Multi-locale support with detection: Add multi-locale handling with automatic browser language detection and sensible fallbacks. The selected locale persists to provide a consistent experience across navigation.

## 2.0.4

### Patch Changes

- Removed unnecessary error throw on missing PREPR_GRAPHQL_URL env variable.

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
