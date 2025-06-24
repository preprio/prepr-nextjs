import { ipAddress } from '@vercel/functions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to set Prepr headers for personalization.
 * @param request - NextRequest object.
 * @param preview - Boolean indicating if preview mode is enabled.
 */
export default function createPreprMiddleware(request: NextRequest) {
  if (!process.env.PREPR_GRAPHQL_URL) {
    console.error('PREPR_GRAPHQL_URL is not set');
  }

  const response = NextResponse.next();

  // Map over search params and set headers
  request.nextUrl.searchParams.forEach((value, key) => {
    switch (key) {
      case 'utm_source':
        response.headers.set('Prepr-Context-utm_source', value);
        break;
      case 'utm_medium':
        response.headers.set('Prepr-Context-utm_medium', value);
        break;
      case 'utm_term':
        response.headers.set('Prepr-Context-utm_term', value);
        break;
      case 'utm_content':
        response.headers.set('Prepr-Context-utm_content', value);
        break;
      case 'utm_campaign':
        response.headers.set('Prepr-Context-utm_campaign', value);
        break;
    }
  });

  // Set initial referral header
  const referrer = request.headers.get('referer');
  if (referrer) {
    response.headers.set('Prepr-Context-initial_referral', referrer);
  }

  // Set IP address header
  const ip = ipAddress(request);
  if (ip) {
    response.headers.set('Prepr-Visitor-IP', ip);
  }

  // Set HubSpot cookie header
  const hutkCookie = request.cookies.get('hubspotutk')?.value;
  if (hutkCookie) {
    response.headers.set('Prepr-Hubspot-Id', hutkCookie);
  }

  // Check for existing Prepr UID cookie or create a new one
  let cookie = request.cookies.get('__prepr_uid')?.value;
  if (!cookie) {
    cookie = crypto.randomUUID();
    response.cookies.set('__prepr_uid', cookie, {
      maxAge: 1 * 365 * 24 * 60, // Set for one year
    });
    response.headers.set('Prepr-Customer-Id-Created', 'true');
  }

  // Set the Prepr Customer ID header
  response.headers.set('Prepr-Customer-Id', cookie);

  // If preview mode is enabled, set additional headers
  if (process.env.PREPR_ENV === 'preview') {
    response.headers.set('Prepr-Preview-Bar', 'true');

    // Set Prepr Preview Segment and AB test cookies
    const segmentCookie = request.cookies.get('Prepr-Segments')?.value;
    if (segmentCookie) {
      response.headers.set('Prepr-Segments', segmentCookie);
    }

    const abCookie = request.cookies.get('Prepr-ABtesting')?.value;
    if (abCookie) {
      response.headers.set('Prepr-ABtesting', abCookie);
    }

    // Set Prepr Preview Segment and AB test headers from query params
    request.nextUrl.searchParams.forEach((value, key) => {
      if (key === 'prepr_preview_ab') {
        response.headers.set('Prepr-ABtesting', value);
        response.cookies.set('Prepr-ABtesting', value);
      }

      if (key === 'prepr_preview_segment') {
        response.headers.set('Prepr-Segments', value);
        response.cookies.set('Prepr-Segments', value);
      }
    });
    console.log(response.headers.getSetCookie());
  }

  return response;
}
