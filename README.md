# Prepr Nextjs

## Getting Started
<hr>
The Prepr NextJS package offers some helper functions and a PreviewBar component for an
easier personalization & A/B testing implementation in your NextJS project.

## Installation
<hr>
To install the Prepr NextJS package, run the following command:

```bash
npm install @preprio/prepr-nextjs
```

Next you should navigate to your `.env` file and add the following environment variable:

```bash
PREPR_ENV=
```

If you want to include the PreviewBar component in your project, set the `PREPR_ENV` environment variable to `preview`. 
When you're launching your project to production, then set the `PREPR_ENV` environment variable to `production`. This way, the PreviewBar component doesn't get displayed on a live web app.

Next, we will implement the PreprMiddleware function. Navigate to your `middleware.js` or the `middleware.ts`
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

The PreprMiddleware accepts a request and optional response property and returns a `NextRequest` object. 
This is done so you are able to chain your own middleware to it.

### Middleware functionality
The PreprMiddleware function will check on every request if the `__prepr_uid` cookie is set. If it is not set it will generate a new UUID and set it as a cookie.
Then it returns a `Prepr-Customer-Id` header with the value of the `__prepr_uid` cookie. This makes for easy personalization & A/B testing implementation.

If the `PREPR_ENV` environment variable is set to `preview`, the PreprMiddleware function will also check for searchParams `segments` and `a-b-testing` in the URL.
If these searchParams are set, the PreprMiddleware will set the `Prepr-Segments` and `Prepr-AB-Testing` headers with the values of the searchParams, and store its value in a cookie.

## Usage
To set up the headers with your API calls, you can call the `getPreprHeaders()` helper function. This will return an array of headers that you can spread in your fetch call.
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
See the javascript example code below in the `page.js`file.

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

### Installing the PreviewBar component

For the PreviewBar to work we need to fetch all the segments from the Prepr API. To do this navigate to Prepr -> Settings -> Access tokens and create a new access token with the following scopes:
- `segments`

Then copy the access token and navigate to your `.env` file and add the following environment variable:
```bash
PREPR_SEGMENTS_ACCESS_TOKEN=<YOUR_ACCESS_TOKEN>
```

Next we will implement the PreviewBar component, navigate to your root layout file, this is usually `layout.tsx`.

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

Now the PreviewBar component will be rendered on every page of your website. The PreviewBar component will show the segments and A/B testing variants in a dropdown. If you have added the `getPreprHeaders()` function 
to your API calls it should automatically update the segments and A/B testing variants when you select a new one in the PreviewBar component.

### Helper functions

#### getPreprUUID()()
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
