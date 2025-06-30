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
The middleware function has been updated to use a new default export.  
Update your `middleware.ts` or `middleware.js` file as shown below.

**Previous implementation:**

```ts
import { PreprMiddleware } from '@preprio/prepr-nextjs'

export function middleware(request: NextRequest) {
  return PreprMiddleware(request)
}
```

**New implementation:**

```ts
import createPreprMiddleware from '@preprio/prepr-nextjs/middleware'

export function middleware(request: NextRequest) {
  return createPreprMiddleware(request)
}
```

**Note:**  
Use `createPreprMiddleware` instead of `PreprMiddleware`.

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

## 5. Verify environment variables
Your environment variables remain the same — check your `.env` file to confirm:

```env
PREPR_ENV=preview    # For staging and preview mode
PREPR_ENV=production # For production
```

## 6. Confirm your GraphQL Preview token
In your Prepr environment:
1. Go to **Settings → Access tokens**.
2. Open your *GraphQL Preview* token.
3. Make sure **Enable edit mode** is checked.
4. Click **Save**.

## ✅ You’re ready!
Your project is now upgraded to **Prepr Next.js package v2.0** and ready for personalization and A/B testing in **Next.js 15**.

For more information, visit the [Prepr documentation](https://docs.prepr.io) or reach out to the team for support.