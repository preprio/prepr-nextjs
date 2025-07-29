import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PreprEventType } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define specific types for Prepr events
export interface PreprEventData {
  readonly segment?: string;
  readonly variant?: string;
  readonly editMode?: boolean;
  readonly [key: string]: string | boolean | number | undefined;
}

/**
 * Sends a Prepr event to both the current window and parent window
 * @param event - The event type to send
 * @param data - Optional event data
 */
export function sendPreprEvent(
  event: PreprEventType,
  data?: PreprEventData
): void {
  if (typeof window !== 'undefined') {
    const message = {
      name: 'prepr_preview_bar',
      event,
      ...data,
    };

    // Send to current window for local event handling
    window.dispatchEvent(
      new CustomEvent('prepr_preview_bar', { detail: message })
    );

    // Send to parent window if available
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  }
}

// Export error handling utilities
export * from './errors';

// Export DOM service
export * from './dom';

// Export debug utilities
export * from './debug';

// Export performance utilities
export * from './performance';
