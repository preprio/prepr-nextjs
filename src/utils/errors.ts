export const StegaError = {
  DECODE_FAILED: 'STEGA_DECODE_FAILED',
  INVALID_FORMAT: 'STEGA_INVALID_FORMAT',
  DOM_MANIPULATION_FAILED: 'DOM_MANIPULATION_FAILED',
  CONTEXT_NOT_FOUND: 'CONTEXT_NOT_FOUND',
} as const;

export type StegaErrorType = (typeof StegaError)[keyof typeof StegaError];

// Define specific types for error additional data
export interface ErrorAdditionalData {
  input?: string;
  element?: HTMLElement;
  context?: string;
  [key: string]: string | HTMLElement | undefined;
}

export interface ErrorInfo {
  type: StegaErrorType;
  context: string;
  message: string;
  timestamp: string;
  stack?: string;
  additionalData?: ErrorAdditionalData;
}

export function createErrorInfo(
  type: StegaErrorType,
  context: string,
  error: Error,
  additionalData?: ErrorAdditionalData
): ErrorInfo {
  return {
    type,
    context,
    message: error.message,
    timestamp: new Date().toISOString(),
    stack: error.stack,
    additionalData,
  };
}

export function handleStegaError(
  error: Error,
  context: string,
  additionalData?: ErrorAdditionalData
) {
  const errorInfo = createErrorInfo(
    StegaError.DECODE_FAILED,
    context,
    error,
    additionalData
  );

  console.error('Stega Error:', errorInfo);

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorTrackingService(errorInfo);
  }

  return errorInfo;
}

export function handleDOMError(error: Error, context: string) {
  const errorInfo = createErrorInfo(
    StegaError.DOM_MANIPULATION_FAILED,
    context,
    error
  );

  console.error('DOM Error:', errorInfo);
  return errorInfo;
}

export function handleContextError(contextName: string) {
  const error = new Error(`${contextName} must be used within its provider`);
  const errorInfo = createErrorInfo(
    StegaError.CONTEXT_NOT_FOUND,
    contextName,
    error
  );

  console.error('Context Error:', errorInfo);
  throw error;
}
