import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define specific types for Prepr events
export interface PreprEventData {
  segment?: string;
  variant?: string;
  editMode?: boolean;
  [key: string]: string | boolean | number | undefined;
}

export function sendPreprEvent(event: string, data?: PreprEventData) {
  window.parent.postMessage({
    name: 'prepr_preview_bar',
    event,
    ...data,
  });
}

// Export error handling utilities
export * from './errors';

// Export DOM service
export * from './dom';

// Export debug utilities
export * from './debug';

// Export performance utilities
export * from './performance';
