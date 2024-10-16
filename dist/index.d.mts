import { NextRequest, NextResponse } from 'next/server';

declare function PreprMiddleware(request: NextRequest, response?: NextResponse): NextResponse<unknown>;
/**
 * Returns the Prepr Customer ID from the headers
 */
declare function getPreprUUID(): string;
/**
 * Retuns the active segment from the headers
 */
declare function getActiveSegment(): string;
/**
 * Returns the active variant from the headers
 */
declare function getActiveVariant(): string;
/**
 * Helper function to retrieve Prepr headers (will filter out customer ID if in preview mode)
 */
declare function getPreprHeaders(): {
    [key: string]: string;
};
type PreprSegment = {
    id: string;
    created_on: string;
    changed_on: string;
    synced_on: string;
    label: string;
    reference_id: string;
    body: string;
    query: string;
    count: number;
};
type PreprSegmentsResponse = {
    total: number;
    skip: number;
    limit: number;
    items: PreprSegment[];
};
/**
 * Fetches the segments from the Prepr API
 * @param token Prepr access token with scope 'segments'
 * @returns Object with total, skip, limit and items
 */
declare function getPreprEnvironmentSegments(token: string): Promise<PreprSegmentsResponse>;
/**
 * Fetches all the necessary previewbar props
 * @param token Prepr access token with scope 'segments'
 * @returns Object with activeSegment, activeVariant and data
 */
declare function getPreviewBarProps(token: string): Promise<{
    activeSegment: string | null;
    activeVariant: string | null;
    data: PreprSegmentsResponse;
}>;

export { PreprMiddleware, type PreprSegment, type PreprSegmentsResponse, getActiveSegment, getActiveVariant, getPreprEnvironmentSegments, getPreprHeaders, getPreprUUID, getPreviewBarProps };
