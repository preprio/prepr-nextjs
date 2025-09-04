export interface PreprSegment {
  readonly _id: string;
  readonly name: string;
}

export interface PreprToolbarOptions {
  readonly debug?: boolean;
  readonly locale?: string; // e.g., 'en', 'nl'
  // Future options can be added here:
  // readonly enableProximityHighlight?: boolean;
  // readonly enableOverlay?: boolean;
  // readonly enableTooltip?: boolean;
}

export interface PreprToolbarProps {
  readonly activeSegment: string | null;
  readonly activeVariant: string | null;
  readonly data: readonly PreprSegment[];
}

// Header names used by the external Prepr system (must match exactly)
export type PreprHeaderName =
  | 'prepr-customer-id'
  | 'Prepr-Segments'
  | 'Prepr-ABtesting';

// Supported A/B testing variants
export type PreprVariant = 'A' | 'B';

// Environment types
export type PreprEnvironment = 'preview' | 'production';

// Event types for preview bar communication
export type PreprEventType =
  | 'segment_changed'
  | 'variant_changed'
  | 'edit_mode_toggled'
  | 'preview_mode_toggled'
  | 'personalization_reset'
  | 'getScrollPosition'
  | 'loaded';

// Headers object with proper typing
export interface PreprHeaders {
  readonly 'prepr-customer-id'?: string;
  readonly 'Prepr-Segments'?: string;
  readonly 'Prepr-ABtesting'?: PreprVariant;
  readonly 'Prepr-Preview-Bar'?: 'true';
  readonly 'Prepr-Context-utm_source'?: string;
  readonly 'Prepr-Context-utm_medium'?: string;
  readonly 'Prepr-Context-utm_term'?: string;
  readonly 'Prepr-Context-utm_content'?: string;
  readonly 'Prepr-Context-utm_campaign'?: string;
  readonly 'Prepr-Context-initial_referral'?: string;
  readonly 'Prepr-Visitor-IP'?: string;
  readonly 'Prepr-Hubspot-Id'?: string;
  readonly 'Prepr-Customer-Id-Created'?: 'true';
}

// Error codes for better error handling
export type PreprErrorCode =
  | 'INVALID_TOKEN'
  | 'MISSING_TOKEN'
  | 'HTTP_ERROR'
  | 'FETCH_ERROR'
  | 'INVALID_RESPONSE'
  | 'CONTEXT_ERROR';
