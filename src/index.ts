import { NextResponse } from 'next/server'
import { ipAddress } from '@vercel/functions'
import { headers } from 'next/headers'
import { getPackageVersion } from './utils'
import { PreprSegment } from './shared/types'

/**
 *
 * @param request NextRequest object
 * @param response optional NextResponse object
 */
export function PreprMiddleware(request: any) {
    const newResponse = NextResponse.next()

    const utm_source = request.nextUrl.searchParams.get('utm_source')
    const utm_medium = request.nextUrl.searchParams.get('utm_medium')
    const utm_term = request.nextUrl.searchParams.get('utm_term')
    const utm_content = request.nextUrl.searchParams.get('utm_content')
    const utm_campaign = request.nextUrl.searchParams.get('utm_campaign')
    const initial_referral = request.headers.get('referer')

    const ip = ipAddress(request)

    if (ip) {
        newResponse.headers.set('Prepr-Visitor-IP', ip)
    }

    const hutkCookie = request.cookies.get('hubspotutk')?.value

    if (utm_source) {
        newResponse.headers.set('Prepr-Context-utm_source', utm_source)
    }

    if (utm_medium) {
        newResponse.headers.set('Prepr-Context-utm_medium', utm_medium)
    }

    if (utm_term) {
        newResponse.headers.set('Prepr-Context-utm_term', utm_term)
    }

    if (utm_content) {
        newResponse.headers.set('Prepr-Context-utm_content', utm_content)
    }

    if (utm_campaign) {
        newResponse.headers.set('Prepr-Context-utm_campaign', utm_campaign)
    }

    if (hutkCookie) {
        newResponse.headers.set('Prepr-Hubspot-Id', hutkCookie)
    }

    if (initial_referral) {
        newResponse.headers.set(
            'prepr-context-initial_referral',
            initial_referral
        )
    }

    let cookie = request.cookies.get('__prepr_uid')?.value

    if (!cookie) {
        cookie = crypto.randomUUID()
        newResponse.cookies.set('__prepr_uid', cookie, {
            maxAge: 1 * 365 * 24 * 60, // Set for one year
        })
        newResponse.headers.set('Prepr-Customer-Id-Created', 'true')
    }

    newResponse.headers.set('Prepr-Customer-Id', cookie)

    if (process.env.PREPR_ENV === 'preview') {
        newResponse.headers.set('Prepr-Preview-Bar', 'true')

        const segmentCookie = request.cookies.get('Prepr-Segments')?.value
        if (segmentCookie) {
            newResponse.headers.set('Prepr-Segments', segmentCookie)
        }

        const abCookie = request.cookies.get('Prepr-ABtesting')?.value
        if (abCookie) {
            newResponse.headers.set('Prepr-ABtesting', abCookie)
        }

        if (request.nextUrl.searchParams.has('prepr_preview_segment')) {
            const segments = request.nextUrl.searchParams.get(
                'prepr_preview_segment'
            )

            if (segments) {
                newResponse.headers.set('Prepr-Segments', segments)
                newResponse.cookies.set('Prepr-Segments', segments, {
                    maxAge: 60, // Set for one year
                })
            }
        }

        if (request.nextUrl.searchParams.has('prepr_preview_ab')) {
            const ab_testing =
                request.nextUrl.searchParams.get('prepr_preview_ab')
            let value = ab_testing?.toUpperCase()
            if (value === 'B') {
                value = 'B'
            } else {
                value = 'A'
            }

            newResponse.headers.set('Prepr-ABtesting', value)
            newResponse.cookies.set('Prepr-ABtesting', value, {
                maxAge: 60, // Set for one year
            })
        }
    }

    return newResponse
}

/**
 * Returns the Prepr Customer ID from the headers
 */
export async function getPreprUUID() {
    const headersList = await headers()
    return headersList.get('prepr-customer-id')
}

/**
 * Retuns the active segment from the headers
 */
export async function getActiveSegment() {
    const headersList = await headers()
    return headersList.get('Prepr-Segments')
}

/**
 * Returns the active variant from the headers
 */
export async function getActiveVariant() {
    const headersList = await headers()
    return headersList.get('Prepr-ABtesting')
}

/**
 * Helper function to retrieve Prepr headers (will filter out customer ID if in preview mode)
 */
export async function getPreprHeaders() {
    let newHeaders: {
        [key: string]: string
    } = {}

    const headersList = await headers()

    headersList.forEach((value, key) => {
        if (key.startsWith('prepr')) {
            newHeaders[key] = value
        }
    })

    return newHeaders
}

/**
 * Fetches the segments from the Prepr API
 * @param token Prepr access token with scope 'segments'
 * @returns Array of PreprSegmentResponse
 */
export async function getPreprEnvironmentSegments(
    token: string
): Promise<PreprSegment[]> {
    if (!token) {
        console.error(
            'No token provided, make sure you are using your Prepr GraphQL URL'
        )
        return []
    }

    if (!token.startsWith('https://')) {
        console.error(
            'Invalid token provided, make sure you are using your Prepr GraphQL URL'
        )
        return []
    }

    try {
        const response = await fetch(token, {
            headers: {
                'User-Agent': `Prepr-Preview-Bar/${getPackageVersion()}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                query: `{
                _Segments {
                    _id
                    name
                }
            }`,
            }),
        })
        try {
            const json = await response.json()

            if (!json || !json.data || !json.data._Segments) {
                return []
            }

            return json.data?._Segments as PreprSegment[]
        } catch (jsonError) {
            console.error('Error parsing JSON, please contact Prepr support')
            return []
        }
    } catch (error) {
        console.error('Error fetching segments:', error)
        return []
    }
}

/**
 * Fetches all the necessary previewbar props
 * @param token Prepr access token with scope 'segments'
 * @returns Object with activeSegment, activeVariant and data
 */
export async function getPreviewBarProps(token: string): Promise<{
    activeSegment: string | null
    activeVariant: string | null
    data: PreprSegment[]
}> {
    let data: PreprSegment[] = []
    let activeSegment, activeVariant

    // Prevent unnecessary function calling in production
    if (process.env.PREPR_ENV === 'preview') {
        data = await getPreprEnvironmentSegments(token)
        activeSegment = await getActiveSegment()
        activeVariant = await getActiveVariant()
    }

    return {
        activeSegment,
        activeVariant,
        data,
    }
}
