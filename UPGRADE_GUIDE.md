# Upgrading to Prepr Next.js package **v2.0**

## Overview
This guide helps you upgrade your project to the latest **Prepr Next.js package v2.0**, fully compatible with **Next.js 15**.  
Follow the steps below to update your installation, imports, and component usage.


## 1. Install version 2.0
Run the following command to install the latest version:

```bash
npm install @preprio/prepr-nextjs@latest
```

## 2. Update your Prepr middleware
The middleware function has been updated to use a new default export with improved API design.  
Update your `middleware.ts` or `middleware.js` file as shown below.

**Previous implementation:**

```ts
import { PreprMiddleware } from '@preprio/prepr-nextjs'

export function middleware(request: NextRequest) {
  return PreprMiddleware(request)
}
```

**New implementation (v2.0.0-alpha.9+):**

```ts
import createPreprMiddleware from '@preprio/prepr-nextjs/middleware'

export function middleware(request: NextRequest) {
  return createPreprMiddleware(request, {
    preview: process.env.PREPR_ENV === 'preview'
  })
}
```

**Key improvements:**
- Use `createPreprMiddleware` instead of `PreprMiddleware`
- **Better TypeScript support**: Function overloads for different usage patterns
- **Options parameter**: Configure preview mode explicitly

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

## 3. Update your helper imports
Helper functions like `getPreprHeaders` now have dedicated paths.  
Update your imports to use the `/server` subpath.

**Previous import:**

```ts
import { getPreprHeaders } from '@preprio/prepr-nextjs'
```

**Updated import:**

```ts
import { getPreprHeaders } from '@preprio/prepr-nextjs/server'
```

## 4. Wrap the Preview Toolbar with the Provider
The Preview Toolbar now uses a `PreprPreviewBarProvider` component.  
Update your `layout.tsx` to include the provider.

**Previous implementation:**

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

**Updated implementation:**

```tsx
import { getPreviewBarProps } from '@preprio/prepr-nextjs/server'
import {
  PreprPreviewBar,
  PreprPreviewBarProvider,
} from '@preprio/prepr-nextjs/react'
import '@preprio/prepr-nextjs/index.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const previewBarProps = await getPreviewBarProps(process.env.PREPR_GRAPHQL_URL!)

  return (
    <html>
      <body>
        <PreprPreviewBarProvider props={previewBarProps}>
          <PreprPreviewBar />
          {children}
        </PreprPreviewBarProvider>
      </body>
    </html>
  )
}
```

**Key changes:**  
- Import the toolbar and provider from `@preprio/prepr-nextjs/react`.
- Wrap your application with `<PreprPreviewBarProvider>`.
- Update the CSS import to `@preprio/prepr-nextjs/index.css`.


## 5. Confirm your GraphQL Preview token
In your Prepr environment:
1. Go to **Settings → Access tokens**.
2. Open your *GraphQL Preview* token.
3. Make sure **Enable edit mode** is checked.
4. Click **Save**.

## 6. Performance and API improvements (Optional)
Version 2.0.0-alpha.9+ includes several performance improvements and API refinements:

### Enhanced TypeScript Support
- **Stricter typing**: Better IntelliSense and type safety
- **Readonly interfaces**: Prevents accidental mutations
- **Improved error types**: Better error handling with typed error codes

### Performance Optimizations
- **Improved throttling**: Better memory management for mouse events
- **React hook optimizations**: Reduced re-renders in `usePreprPreviewBar`
- **Caching improvements**: Better element caching for DOM operations

### Streamlined Public API
The package now exposes only essential functions for end users:
- `getPreprHeaders()` - Main integration function
- `getPreprUUID()`, `getActiveSegment()`, `getActiveVariant()` - Individual header access
- `getPreviewBarProps()` - Preview bar initialization
- `validatePreprToken()`, `isPreviewMode()` - Utility functions

Internal functions are still available but not prominently documented.

## ✅ You're ready!
Your project is now upgraded to **Prepr Next.js package v2.0** with all the latest performance improvements and API enhancements.

### What's New in v2.0.0-alpha.9+
- ✅ **Cleaner middleware API** with function overloads
- ✅ **Better middleware chaining** support
- ✅ **Improved performance** with optimized hooks and throttling
- ✅ **Stricter TypeScript** support
- ✅ **Streamlined public API** for better developer experience

For more information, visit the [Prepr documentation](https://docs.prepr.io) or reach out to the team for support.