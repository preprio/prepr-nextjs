# The Prepr Next.js package

## Getting Started
<hr>
The Prepr Next.js package offers some helper functions and the Adaptive Preview Bar component for an
easier personalization & A/B testing implementation in your Next.js project.

## Installation
<hr>
To install the Prepr Next.js package, run the following command:

```bash
npm install @preprio/prepr-nextjs
```

Next, add the `PREPR_ENV` variable to the `.env` file. You can enable the *Adaptive Preview Bar* for a staging environment by setting the value to `preview`.

```bash
PREPR_ENV=preview
```

When you're launching your project to production, then set the `PREPR_ENV` environment variable to `production`. This way, the  *Adaptive Preview Bar* doesn't get displayed on a live web app.

Next, implement the `PreprMiddleware` function. Go to your `middleware.js` or the `middleware.ts`
file. If you don't have this file, you can create it in the root of your project.

Then add the following code to the `middleware.ts` file:
```javascript
import type { NextRequest } from 'next/server'
import { PreprMiddleware } from '@preprio/prepr-nextjs'

export function middleware(request: NextRequest) {
    return PreprMiddleware(request)
}
```

Or add the following code to the `middleware.js` file:
```javascript
import { PreprMiddleware } from '@preprio/prepr-nextjs'

export function middleware(request) {
    return PreprMiddleware(request)
}
```

### Middleware functionality
The `PreprMiddleware` accepts a request and optional response property and returns a `NextRequest` object. 
This is done so you are able to chain your own middleware to it.

The `PreprMiddleware` function checks every request if the `__prepr_uid` cookie is set. If it isn't, the function generates a new UUID and sets it as a cookie. Then it returns a `Prepr-Customer-Id` header with the value of the `__prepr_uid` cookie to simplify your personalization and A/B testing implementation.

If the `PREPR_ENV` environment variable is set to `preview`, the `PreprMiddleware` function also checks for searchParams `segments` and `a-b-testing` in the URL.
If these searchParams are set, the PreprMiddleware sets the `Prepr-Segments` and `Prepr-AB-Testing` headers with the values of the searchParams, and stores its value in a cookie.

## Usage
To set your API request headers to query adaptive content or A/B testing content, you can call the `getPreprHeaders()` helper function. It returns an array of headers that you can spread in your fetch call.
See the example code below in the `page.tsx` file. 

```javascript
import { getClient } from '@/lib/client'
import { GetPageBySlugDocument, GetPageBySlugQuery } from '@/gql/graphql'
import { getPreprHeaders } from '@preprio/prepr-nextjs'

const getData = async () => {
    // Fetching the data using Apollo Client
    const {data} = await getClient().query < GetPageBySlugQuery > ({
        query: GetPageBySlugDocument,
        variables: {
            slug: '/',
        },
        context: {
            // Call the getPreprHeaders function to get the appropriate headers
            headers: getPreprHeaders(),
        },
        fetchPolicy: 'no-cache',
    })
}
```
See the JavaScript example code below in the `page.js`file.

```javascript
import { getClient } from '@/lib/client'
import { GetPageBySlug } from '@/queries/get-page-by-slug';
import { getPreprHeaders } from '@preprio/prepr-nextjs'

const getData = async () => {
    // Fetching the data using Apollo Client
    const { data } = await client.query({
    query: GetPageBySlug,
    variables: {
        slug: '/',
    },
    context: {
            // Call the getPreprHeaders function to get the appropriate headers
            headers: getPreprHeaders(),
        },
        fetchPolicy: 'no-cache',
    })
    return data;
}
```

### Installing the Adaptive Preview Bar component

The preview bar component fetches all segments from the Prepr API. So, you need to give it access to do this as follows:

1. In your Prepr environment, go to the  **Settings → Access tokens** page to view all the access tokens.
2. Click the **Add access token** button to create a new access token, give it a name and choose the segments scope like in the image below.

![Segments access token](https://assets-site.prepr.io//2mcoy87hhmfz-segments-access-token.png)

3. Click the **Save** button and copy the generated *Access token*.

4. Add a new variable `PREPR_SEGMENTS_ACCESS_TOKEN` to the `.env` file and paste the value you just copied.

```bash
PREPR_SEGMENTS_ACCESS_TOKEN=<YOUR-SEGMENTS-ACCESS-TOKEN>
```

To implement the *Adaptive Preview Bar* component, navigate to your root layout file, this is usually `layout.tsx`.

Then add the following code to the `layout.tsx` file:

```javascript
// Helper function to get all the props for the PreviewBar component (this needs a server component)
import { getPreviewBarProps } from '@preprio/prepr-nextjs'
// Import the PreviewBar component
import { PreprPreviewBar } from '@preprio/prepr-nextjs/components'
// Import the PreviewBar CSS
import '@preprio/prepr-nextjs/dist/components.css'


export default async function RootLayout({children}: {children: React.ReactNode}) {
    // Get the props for the PreviewBar component, pass the access token as an argument
    const previewBarProps = await getPreviewBarProps(process.env.PREPR_SEGMENTS_ACCESS_TOKEN)

    return (
        <html>
            <head>
                {/*...*/}
            </head>
            <body>
                {/* Render the PreviewBar component and spread the previewBarProps */}
                <PreprPreviewBar {...previewBarProps} />
                {children}
            </body>    
        </html>
    )
}
```

Now the *Adaptive Preview Bar* is rendered on every page of your website. This component shows the segments in a dropdown list and a switch for A and B variants for an A/B test.  If you have added the `getPreprHeaders()` function 
to your API calls it automatically updates the segments and A/B testing variants when you select a new segment or variant.

### Helper functions

#### getPreprUUID()
The `getPreprUUID()` function will return the value of the `__prepr_uid` cookie. This can be useful if you want to store the `__prepr_uid` in a cookie or local storage.

#### getActiveSegment()
Returns the active segment from the `Prepr-Segments` header.

#### getActiveVariant()
Returns the active variant from the `Prepr-ABTesting` header.

#### getPreviewHeaders()
Helper function to only get the preview headers.

#### getPreprHeaders()
Helper function that will either return the customer id header or the preview headers depending on the `PREPR_ENV` environment variable.

#### getPreviewBarProps()
Helper function to get the props for the PreviewBar component. Will return the segments and A/B testing variants aswell as an aray of all the segments.
