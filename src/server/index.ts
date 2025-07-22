import { headers } from 'next/headers';
import {
  PreprToolbarProps,
  PreprSegment,
  PreprHeaderName,
  PreprErrorCode,
} from '../types';
import pjson from '../../package.json';
import createPreprMiddleware from '../middleware';

/**
 * Custom error class for Prepr-related errors
 */
export class PreprError extends Error {
  constructor(
    message: string,
    public readonly code: PreprErrorCode,
    public readonly context?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'PreprError';
  }
}

/**
 * Internal helper to get a specific Prepr header value
 * @param name - The header name to retrieve
 * @returns The header value or null if not found
 */
async function getPreprHeader(name: PreprHeaderName): Promise<string | null> {
  const headersList = await headers();
  return headersList.get(name);
}

/**
 * Returns the Prepr Customer ID from the headers
 * @returns Prepr Customer ID
 */
export async function getPreprUUID(): Promise<string | null> {
  return getPreprHeader('prepr-customer-id');
}

/**
 * Returns the active segment from the headers
 * @returns Active segment
 */
export async function getActiveSegment(): Promise<string | null> {
  return getPreprHeader('Prepr-Segments');
}

/**
 * Returns the active variant from the headers
 * @returns Active variant
 */
export async function getActiveVariant(): Promise<string | null> {
  return getPreprHeader('Prepr-ABtesting');
}

/**
 * Helper function to retrieve all Prepr headers
 * @returns Object with Prepr headers
 */
export async function getPreprHeaders(): Promise<Record<string, string>> {
  const preprHeaders: Record<string, string> = {};
  const headersList = await headers();

  headersList.forEach((value, key) => {
    if (key.startsWith('prepr') || key.startsWith('Prepr')) {
      preprHeaders[key] = value;
    }
  });

  return preprHeaders;
}

/**
 * Validates a Prepr GraphQL token
 * @param token - The token to validate
 * @returns Validation result with error details if invalid
 */
export function validatePreprToken(token: string): {
  valid: boolean;
  error?: string;
} {
  if (!token) {
    return { valid: false, error: 'Token is required' };
  }
  if (!token.startsWith('https://')) {
    return { valid: false, error: 'Token must be a valid HTTPS URL' };
  }
  return { valid: true };
}

/**
 * Checks if the current environment is in preview mode
 * @returns True if in preview mode
 */
export function isPreviewMode(): boolean {
  return process.env.PREPR_ENV === 'preview';
}

/**
 * Extracts the access token from a Prepr GraphQL URL
 * @param graphqlUrl - The full Prepr GraphQL URL
 * @returns The access token or null if invalid
 * @example
 * ```typescript
 * const token = extractAccessToken('https://graphql.prepr.io/abc123')
 * // Returns: 'abc123'
 * ```
 */
export function extractAccessToken(graphqlUrl: string): string | null {
  if (!graphqlUrl) return null;

  try {
    const url = new URL(graphqlUrl);
    if (url.hostname !== 'graphql.prepr.io') return null;

    const pathParts = url.pathname.split('/');
    const token = pathParts[pathParts.length - 1];

    return token && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

/**
 * Fetches the segments from the Prepr API
 * @param token Prepr GraphQL URL with scope 'segments'
 * @returns Array of PreprSegment
 * @throws PreprError if the request fails
 */
export async function getPreprEnvironmentSegments(
  token: string
): Promise<PreprSegment[]> {
  const validation = validatePreprToken(token);
  if (!validation.valid) {
    throw new PreprError(
      validation.error!,
      'INVALID_TOKEN',
      'getPreprEnvironmentSegments'
    );
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
    });

    if (!response.ok) {
      throw new PreprError(
        `HTTP ${response.status}: ${response.statusText}`,
        'HTTP_ERROR',
        'getPreprEnvironmentSegments'
      );
    }

    const json = await response.json();

    if (!json || !json.data || !json.data._Segments) {
      throw new PreprError(
        'Invalid response format from Prepr API',
        'INVALID_RESPONSE',
        'getPreprEnvironmentSegments'
      );
    }

    return json.data._Segments as PreprSegment[];
  } catch (error) {
    if (error instanceof PreprError) {
      throw error;
    }
    throw new PreprError(
      'Failed to fetch segments from Prepr API',
      'FETCH_ERROR',
      'getPreprEnvironmentSegments',
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Fetches all the necessary previewbar props
 * @param token Prepr GraphQL URL with scope 'segments'
 * @returns Object with activeSegment, activeVariant and data
 */
export async function getToolbarProps(
  token: string
): Promise<PreprToolbarProps> {
  let data: PreprSegment[] = [];
  let activeSegment: string | null = null;
  let activeVariant: string | null = null;

  // Prevent unnecessary function calling in production
  if (isPreviewMode()) {
    try {
      data = await getPreprEnvironmentSegments(token);
      activeSegment = await getActiveSegment();
      activeVariant = await getActiveVariant();
    } catch (error) {
      // In preview mode, we should still return props even if API fails
      console.error('Failed to fetch toolbar props:', error);
      // Return empty data to prevent toolbar from crashing
      data = [];
    }
  }

  return {
    activeSegment,
    activeVariant,
    data,
  };
}

function getPackageVersion() {
  return pjson.version;
}

export { createPreprMiddleware };
