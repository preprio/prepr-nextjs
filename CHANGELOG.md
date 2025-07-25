# @preprio/prepr-nextjs

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
