import { headers } from 'next/headers';
import { PreprPreviewBarProps, PreprSegment } from '../types';
import pjson from '../../package.json';

/**
 * Returns the Prepr Customer ID from the headers
 */
export async function getPreprUUID() {
  const headersList = await headers();
  return headersList.get('prepr-customer-id');
}

/**
 * Retuns the active segment from the headers
 */
export async function getActiveSegment() {
  const headersList = await headers();
  return headersList.get('Prepr-Segments');
}

/**
 * Returns the active variant from the headers
 */
export async function getActiveVariant() {
  const headersList = await headers();
  return headersList.get('Prepr-ABtesting');
}

/**
 * Helper function to retrieve Prepr headers (will filter out customer ID if in preview mode)
 */
export async function getPreprHeaders() {
  const newHeaders: {
    [key: string]: string;
  } = {};

  const headersList = await headers();

  headersList.forEach((value, key) => {
    if (key.startsWith('prepr')) {
      newHeaders[key] = value;
    }
  });

  return newHeaders;
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
    );
    return [];
  }

  if (!token.startsWith('https://')) {
    console.error(
      'Invalid token provided, make sure you are using your Prepr GraphQL URL'
    );
    return [];
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
    try {
      const json = await response.json();

      if (!json || !json.data || !json.data._Segments) {
        return [];
      }

      return json.data?._Segments as PreprSegment[];
    } catch {
      console.error('Error parsing JSON, please contact Prepr support');
      return [];
    }
  } catch (error) {
    console.error('Error fetching segments:', error);
    return [];
  }
}

/**
 * Fetches all the necessary previewbar props
 * @param token Prepr access token with scope 'segments'
 * @returns Object with activeSegment, activeVariant and data
 */
export async function getPreviewBarProps(
  token: string
): Promise<PreprPreviewBarProps> {
  let data: PreprSegment[] = [];
  let activeSegment: string | null = null;
  let activeVariant: string | null = null;

  // Prevent unnecessary function calling in production
  if (process.env.PREPR_ENV === 'preview') {
    data = await getPreprEnvironmentSegments(token);
    activeSegment = await getActiveSegment();
    activeVariant = await getActiveVariant();
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
