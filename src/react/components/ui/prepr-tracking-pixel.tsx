'use client';

import React from 'react';
import Script from 'next/script';

interface PreprTrackingPixelProps {
  /**
   * The Prepr access token (without the full GraphQL URL)
   * Extract this from your PREPR_GRAPHQL_URL: https://graphql.prepr.io/YOUR_ACCESS_TOKEN
   */
  accessToken?: string;
}

/**
 * PreprTrackingPixel component for user tracking
 *
 * This component loads the Prepr tracking script and initializes tracking.
 * It should be included in your application to track user interactions.
 *
 * @param accessToken - Your Prepr access token
 *
 * @example
 * ```tsx
 * // In your layout or page
 *
 * import { PreprTrackingPixel } from '@preprio/prepr-nextjs/react'
 *
 * // Extract token from PREPR_GRAPHQL_URL
 * const accessToken = extractAccessToken(process.env.PREPR_GRAPHQL_URL!)
 *
 * export default function Layout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <PreprTrackingPixel accessToken={accessToken!} />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   )
 * }
 * ```
 */
export default function PreprTrackingPixel({
  accessToken,
}: PreprTrackingPixelProps) {
  if (!accessToken) {
    console.warn(
      'PreprTrackingPixel: accessToken is required for tracking to work'
    );
    return null;
  }

  return (
    <Script
      id="prepr-tracking-pixel"
      dangerouslySetInnerHTML={{
        __html: `
   ! function (e, t, p, r, n, a, s) {
    e[r] || ((n = e[r] = function () {
    n.process ? n.process.apply(n, arguments) : n.queue.push(arguments)
    }).queue = [], n.t = +new Date, (a = t.createElement(p)).async = 1, a.src = "https://cdn.tracking.prepr.io/js/prepr_v2.min.js?t=" + 864e5 * Math.ceil(new Date / 864e5), (s = t.getElementsByTagName(p)[0]).parentNode.insertBefore(a, s))
    }(window, document, "script", "prepr"), prepr("init", "${accessToken}", { destinations: { googleTagManager: true } }), prepr("event", "pageload");`,
      }}
    />
  );
}
