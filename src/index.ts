import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export function PreprMiddleware(request: any, response?: NextResponse) {
    const newResponse = response || NextResponse.next()

    const utm_source = request.nextUrl.searchParams.get('utm_source')
    const utm_medium = request.nextUrl.searchParams.get('utm_medium')
    const utm_term = request.nextUrl.searchParams.get('utm_term')
    const utm_content = request.nextUrl.searchParams.get('utm_content')
    const utm_campaign = request.nextUrl.searchParams.get('utm_campaign')
    const initial_referral = request.headers.get('referer')

    let cookie = request.cookies.get('__prepr_uid')?.value
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

    if (!cookie) {
        cookie = crypto.randomUUID()
        newResponse.cookies.set('__prepr_uid', cookie, {
            maxAge: 60, // Set for one year
        })
    }

    newResponse.headers.set('Prepr-Customer-Id', cookie)

    if (process.env.PREPR_ENV === 'preview') {
        newResponse.headers.set('Prepr-Preview-Bar', 'true')

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

        const segmentCookie = request.cookies.get('Prepr-Segments')?.value
        if (segmentCookie) {
            newResponse.headers.set('Prepr-Segments', segmentCookie)
        }

        const abCookie = request.cookies.get('Prepr-ABtesting')?.value
        if (abCookie) {
            newResponse.headers.set('Prepr-ABtesting', abCookie)
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

export type PreprSegment = {
    id: string
    created_on: string
    changed_on: string
    synced_on: string
    label: string
    reference_id: string
    body: string
    query: string
    count: number
}

export type PreprSegmentsResponse = {
    total: number
    skip: number
    limit: number
    items: PreprSegment[]
}

/**
 * Fetches the segments from the Prepr API
 * @param token Prepr access token with scope 'segments'
 * @returns Object with total, skip, limit and items
 */
export async function getPreprEnvironmentSegments(
    token: string
): Promise<PreprSegmentsResponse> {
    const response = await fetch('https://api.eu1.prepr.io/segments', {
        headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'Prepr-Preview-Bar/1.0',
        },
    })

    return response.json()
}

/**
 * Fetches all the necessary previewbar props
 * @param token Prepr access token with scope 'segments'
 * @returns Object with activeSegment, activeVariant and data
 */
export async function getPreviewBarProps(token: string): Promise<{
    activeSegment: string | null
    activeVariant: string | null
    data: PreprSegmentsResponse
}> {
    const data = await getPreprEnvironmentSegments(token)
    const activeSegment = await getActiveSegment()
    const activeVariant = await getActiveVariant()

    return {
        activeSegment,
        activeVariant,
        data,
    }
}
