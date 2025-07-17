# Upgrading to Prepr Next.js package **v2.0**

## Overview
This guide helps you upgrade your project to the latest **Prepr Next.js package v2.0**, fully compatible with **Next.js 15**.  
Follow the steps below to update your installation, imports, and component usage.

## Breaking Changes Summary

**Middleware Changes:**
- `PreprMiddleware` → `createPreprMiddleware` (default export)
- Moved from main package to `@preprio/prepr-nextjs/middleware`
- Now requires explicit preview mode configuration

**Component Changes:**
- `PreprPreviewBar` → `PreprToolbar` with provider pattern
- Added `PreprToolbarProvider` wrapper requirement
- New `PreprTrackingPixel` component for user tracking

**Function Changes:**
- `getPreviewBarProps()` → `getToolbarProps()`
- All functions moved to `@preprio/prepr-nextjs/server`
- New `extractAccessToken()` helper function

**Import Changes:**
- Components: `@preprio/prepr-nextjs/components` → `@preprio/prepr-nextjs/react`
- Middleware: `@preprio/prepr-nextjs` → `@preprio/prepr-nextjs/middleware`  
- Server functions: `@preprio/prepr-nextjs` → `@preprio/prepr-nextjs/server`
- CSS: `@preprio/prepr-nextjs/dist/components.css` → `@preprio/prepr-nextjs/index.css`


## 1. Install version 2.0
Run the following command to install the latest version:

```bash
npm install @preprio/prepr-nextjs@latest
```

## 2. Update your Prepr middleware
The middleware function has been updated to use a new default export with improved API design.  
Update your `middleware.ts` or `middleware.js` file as shown below.

**Previous implementation (v1.0):**

```ts
import type { NextRequest } from 'next/server'
import { PreprMiddleware } from '@preprio/prepr-nextjs'

export function middleware(request: NextRequest) {
  return PreprMiddleware(request)
}
```

**New implementation (v2.0):**

```ts
import type { NextRequest } from 'next/server'
import createPreprMiddleware from '@preprio/prepr-nextjs/middleware'

export function middleware(request: NextRequest) {
  return createPreprMiddleware(request, {
    preview: process.env.PREPR_ENV === 'preview'
  })
}
```

**Key changes:**
- **New import path**: `@preprio/prepr-nextjs/middleware` instead of main package
- **New function name**: `createPreprMiddleware` instead of `PreprMiddleware`
- **Default export**: No longer a named export
- **Required configuration**: Must explicitly set preview mode
- **Better TypeScript support**: Function overloads for different usage patterns

### Middleware Chaining (New Feature)
If you need to chain with other middleware (like `next-intl`), you can now do so cleanly:

```ts
import createIntlMiddleware from 'next-intl/middleware'
import createPreprMiddleware from '@preprio/prepr-nextjs/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en'
})

export function middleware(request: NextRequest) {
  // First run internationalization middleware
  const intlResponse = intlMiddleware(request)
  
  // Then chain with Prepr middleware
  return createPreprMiddleware(request, intlResponse, {
    preview: process.env.PREPR_ENV === 'preview'
  })
}
```

## 3. Update your server function imports
All server functions have been moved to a dedicated import path.  
Update your imports to use the `/server` subpath.

**Previous imports (v1.0):**

```ts
import { 
  getPreprHeaders,
  getPreprUUID,
  getActiveSegment,
  getActiveVariant,
  getPreviewBarProps
} from '@preprio/prepr-nextjs'
```

**Updated imports (v2.0):**

```ts
import { 
  getPreprHeaders,
  getPreprUUID,
  getActiveSegment,
  getActiveVariant,
  getToolbarProps,
  extractAccessToken
} from '@preprio/prepr-nextjs/server'
```

**Key changes:**
- **New import path**: All server functions now use `@preprio/prepr-nextjs/server`
- **Function rename**: `getPreviewBarProps()` → `getToolbarProps()`
- **New helper**: `extractAccessToken()` for token extraction from GraphQL URL

## 4. Update to New Toolbar Components and Naming
The Preview Bar has been renamed to Toolbar with improved provider architecture.  
Update your `layout.tsx` to use the new naming and structure.

**Previous implementation (v1.0):**

```tsx
import { getPreviewBarProps } from '@preprio/prepr-nextjs'
import { PreprPreviewBar } from '@preprio/prepr-nextjs/components'
import '@preprio/prepr-nextjs/dist/components.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const previewBarProps = await getPreviewBarProps(process.env.PREPR_GRAPHQL_URL!)

  return (
    <html>
      <body>
        <PreprPreviewBar {...previewBarProps} />
        {children}
      </body>
    </html>
  )
}
```

**Updated implementation (v2.0):**

```tsx
import { getToolbarProps, extractAccessToken } from '@preprio/prepr-nextjs/server'
import {
  PreprToolbar,
  PreprToolbarProvider,
  PreprTrackingPixel,
} from '@preprio/prepr-nextjs/react'
import '@preprio/prepr-nextjs/index.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const toolbarProps = await getToolbarProps(process.env.PREPR_GRAPHQL_URL!)
  const accessToken = extractAccessToken(process.env.PREPR_GRAPHQL_URL!)

  return (
    <html>
      <head>
        {accessToken && <PreprTrackingPixel accessToken={accessToken} />}
      </head>
      <body>
        <PreprToolbarProvider props={toolbarProps}>
          <PreprToolbar />
          {children}
        </PreprToolbarProvider>
      </body>
    </html>
  )
}
```

**Key changes:**  
- **Component naming**: `PreprPreviewBar` → `PreprToolbar`
- **Provider pattern**: Now requires `PreprToolbarProvider` wrapper
- **Function rename**: `getPreviewBarProps()` → `getToolbarProps()`
- **Props passing**: Props now passed to provider, not directly to component
- **New tracking**: `PreprTrackingPixel` component for user analytics
- **Import paths**: `@preprio/prepr-nextjs/components` → `@preprio/prepr-nextjs/react`
- **CSS import**: `@preprio/prepr-nextjs/dist/components.css` → `@preprio/prepr-nextjs/index.css`
- **Token extraction**: New `extractAccessToken()` helper function


## 5. Add User Tracking (New Feature)

Version 2.0 introduces a `PreprTrackingPixel` component for user tracking. This component should be added to track user interactions and enable personalization features.

### Integration Options

**Option 1: In the head (recommended):**
```tsx
<html>
  <head>
    {accessToken && <PreprTrackingPixel accessToken={accessToken} />}
  </head>
  <body>{children}</body>
</html>
```

**Option 2: In the body:**
```tsx
<html>
  <body>
    {accessToken && <PreprTrackingPixel accessToken={accessToken} />}
    {children}
  </body>
</html>
```

### Token Extraction

Use the `extractAccessToken()` helper to safely extract the token from your GraphQL URL:

```tsx
import { extractAccessToken } from '@preprio/prepr-nextjs/server'

const accessToken = extractAccessToken(process.env.PREPR_GRAPHQL_URL!)
```

**Important**: The tracking pixel should be included in both preview and production environments for optimal personalization functionality.

## 6. Update API Usage (Optional)
If you're using the helper functions in your API calls, the usage remains the same but with updated imports:

**Previous usage (v1.0):**

```tsx
import { getClient } from '@/lib/client'
import { GetPageBySlugDocument } from '@/gql/graphql'
import { getPreprHeaders } from '@preprio/prepr-nextjs'

const getData = async () => {
  const { data } = await getClient().query({
    query: GetPageBySlugDocument,
    variables: { slug: '/' },
    context: {
      headers: getPreprHeaders(),
    },
    fetchPolicy: 'no-cache',
  })
  return data
}
```

**Updated usage (v2.0):**

```tsx
import { getClient } from '@/lib/client'
import { GetPageBySlugDocument } from '@/gql/graphql'
import { getPreprHeaders } from '@preprio/prepr-nextjs/server'

const getData = async () => {
  const { data } = await getClient().query({
    query: GetPageBySlugDocument,
    variables: { slug: '/' },
    context: {
      headers: await getPreprHeaders(),
    },
    fetchPolicy: 'no-cache',
  })
  return data
}
```

**Key changes:**
- **Import path**: `@preprio/prepr-nextjs` → `@preprio/prepr-nextjs/server`
- **Async function**: `getPreprHeaders()` is now async and requires `await`

## 7. Confirm your GraphQL Preview token
In your Prepr environment:
1. Go to **Settings → Access tokens**.
2. Open your *GraphQL Preview* token.
3. Make sure **Enable edit mode** is checked.
4. Click **Save**.

## 8. Performance and API improvements (Optional)
Version 2.0 includes several performance improvements and API refinements:

### Enhanced TypeScript Support
- **Stricter typing**: Better IntelliSense and type safety
- **Readonly interfaces**: Prevents accidental mutations
- **Improved error types**: Better error handling with typed error codes

### Performance Optimizations
- **Improved throttling**: Better memory management for mouse events
- **React hook optimizations**: Reduced re-renders in `usePreprToolbar`
- **Caching improvements**: Better element caching for DOM operations

### Streamlined Public API
The package now exposes only essential functions for end users:
- `getPreprHeaders()` - Main integration function
- `getPreprUUID()`, `getActiveSegment()`, `getActiveVariant()` - Individual header access
- `getToolbarProps()` - Toolbar initialization (renamed from `getPreviewBarProps()`)
- `validatePreprToken()`, `isPreviewMode()` - Utility functions
- `extractAccessToken()` - New helper for token extraction
- `PreprTrackingPixel` - New component for user tracking

Internal functions are still available but not prominently documented.

## ✅ You're ready!
Your project is now upgraded to **Prepr Next.js package v2.0** with all the latest performance improvements and API enhancements.

### What's New in v2.0
- ✅ **Cleaner middleware API** with function overloads
- ✅ **Better middleware chaining** support
- ✅ **Improved performance** with optimized hooks and throttling
- ✅ **Stricter TypeScript** support
- ✅ **Streamlined public API** for better developer experience
- ✅ **New toolbar naming** - `PreprToolbar` instead of `PreprPreviewBar`
- ✅ **User tracking pixel** - `PreprTrackingPixel` component for analytics
- ✅ **Token extraction helper** - `extractAccessToken()` utility function

For more information, visit the [Prepr documentation](https://docs.prepr.io) or reach out to the team for support.