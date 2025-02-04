import { NextResponse } from 'next/server';
import { P as PreprSegment } from './types-DmITW6Tn.js';

/**
 *
 * @param request NextRequest object
 * @param response optional NextResponse object
 */
declare function PreprMiddleware(request: any, response?: NextResponse): NextResponse<unknown>;
/**
 * Returns the Prepr Customer ID from the headers
 */
declare function getPreprUUID(): Promise<string>;
/**
 * Retuns the active segment from the headers
 */
declare function getActiveSegment(): Promise<string>;
/**
 * Returns the active variant from the headers
 */
declare function getActiveVariant(): Promise<string>;
/**
 * Helper function to retrieve Prepr headers (will filter out customer ID if in preview mode)
 */
declare function getPreprHeaders(): Promise<{
    [key: string]: string;
}>;
/**
 * Fetches the segments from the Prepr API
 * @param token Prepr access token with scope 'segments'
 * @returns Array of PreprSegmentResponse
 */
declare function getPreprEnvironmentSegments(token: string): Promise<PreprSegment[]>;
/**
 * Fetches all the necessary previewbar props
 * @param token Prepr access token with scope 'segments'
 * @returns Object with activeSegment, activeVariant and data
 */
declare function getPreviewBarProps(token: string): Promise<{
    activeSegment: string | null;
    activeVariant: string | null;
    data: PreprSegment[];
}>;

export { PreprMiddleware, getActiveSegment, getActiveVariant, getPreprEnvironmentSegments, getPreprHeaders, getPreprUUID, getPreviewBarProps };
