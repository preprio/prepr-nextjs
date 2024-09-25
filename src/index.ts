import {NextRequest, NextResponse} from "next/server";
import {headers} from "next/headers";

export function PreprMiddleware(request: NextRequest, response?: NextResponse) {
    const newResponse = response || NextResponse.next()

    let cookie = request.cookies.get('__prepr_uid')?.value

    if (!cookie) {
        cookie = crypto.randomUUID()
        newResponse.cookies.set('__prepr_uid', cookie, {
            maxAge: 1 * 365 * 24 * 60, // Set for one year
        })
    }

    newResponse.headers.set('Prepr-Customer-Id', cookie)

    if (process.env.PREPR_ENV === 'preview') {
        if (request.nextUrl.searchParams.has('segments')) {
            const segments = request.nextUrl.searchParams.get('segments')

            if (segments) {
                newResponse.headers.set('Prepr-Segments', segments)
                newResponse.cookies.set('Prepr-Segments', segments, {
                    maxAge: 60, // Set for one year
                })
            }
        }

        if (request.nextUrl.searchParams.has('a-b-testing')) {
            const ab_testing = request.nextUrl.searchParams.get('a-b-testing')
            let value = ab_testing?.toUpperCase()
            if (value === 'B') {
                value = 'B'
            } else {
                value = 'A'
            }
            newResponse.headers.set('Prepr-ABtesting',  value)
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
export function getPreprUUID() {
    return headers().get('prepr-customer-id')
}

/**
 * Retuns the active segment from the headers
 */
export function getActiveSegment() {
    return headers().get('Prepr-Segments')
}

/**
 * Returns the active variant from the headers
 */
export function getActiveVariant() {
    return headers().get('Prepr-ABtesting')
}

/**
 * Helper function to only retrieve Prepr preview headers
 */
export function getPreviewHeaders() {
    let newHeaders: {
        [key: string]: string
    } = {}
    headers().forEach((value, key) => {
        if (key.startsWith('prepr') && key !== 'prepr-customer-id') {
            newHeaders[key] = value
        }
    })

    return newHeaders
}

/**
 * Helper function to retrieve Prepr headers (will filter out customer ID if in preview mode)
 */
export function getPreprHeaders() {
    let newHeaders: {
        [key: string]: string
    } = {}

    if (process.env.PREPR_ENV !== 'preview') {
        newHeaders['prepr-customer-id'] =
            headers().get('prepr-customer-id') || ''
    } else {
        headers().forEach((value, key) => {
            if (key.startsWith('prepr') && key !== 'prepr-customer-id') {
                newHeaders[key] = value
            }
        })
    }

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
export async function getPreprEnvironmentSegments(token: string): Promise<PreprSegmentsResponse> {
    const response = await fetch('https://api.eu1.prepr.io/segments', {
        headers: {
            Authorization: `Bearer ${token}`,
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
    activeSegment: string | null,
    activeVariant: string | null,
    data: PreprSegmentsResponse
}> {
    const data = await getPreprEnvironmentSegments(token)
    const activeSegment = getActiveSegment()
    const activeVariant = getActiveVariant()

    return {
        activeSegment,
        activeVariant,
        data
    }
}