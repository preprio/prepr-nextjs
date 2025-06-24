/**
 * Debug utility for Prepr Next.js package
 * Provides centralized debug logging with performance optimizations
 */

// Define specific types for debug arguments
export type DebugArg = string | number | boolean | null | undefined | object;

interface DebugOptions {
  enabled: boolean;
  prefix?: string;
}

class DebugLogger {
  private options: DebugOptions;

  constructor(options: DebugOptions) {
    this.options = {
      prefix: '[Prepr]',
      ...options,
    };
  }

  /**
   * Log a debug message if debug is enabled
   */
  log(message: string, ...args: DebugArg[]): void {
    if (!this.options.enabled) return;

    const prefix = this.options.prefix;
    console.log(`${prefix} ${message}`, ...args);
  }

  /**
   * Log a debug warning if debug is enabled
   */
  warn(message: string, ...args: DebugArg[]): void {
    if (!this.options.enabled) return;

    const prefix = this.options.prefix;
    console.warn(`${prefix} ${message}`, ...args);
  }

  /**
   * Log a debug error if debug is enabled
   */
  error(message: string, ...args: DebugArg[]): void {
    if (!this.options.enabled) return;

    const prefix = this.options.prefix;
    console.error(`${prefix} ${message}`, ...args);
  }

  /**
   * Create a scoped logger with additional context
   */
  scope(scopeName: string): DebugLogger {
    return new DebugLogger({
      ...this.options,
      prefix: `${this.options.prefix}[${scopeName}]`,
    });
  }
}

// Global debug instance
let globalDebugLogger: DebugLogger | null = null;

/**
 * Initialize the debug logger
 */
export function initDebugLogger(enabled: boolean = false): void {
  globalDebugLogger = new DebugLogger({ enabled });
}

/**
 * Get the debug logger instance
 */
export function getDebugLogger(): DebugLogger {
  if (!globalDebugLogger) {
    // Fallback to disabled logger if not initialized
    globalDebugLogger = new DebugLogger({ enabled: false });
  }
  return globalDebugLogger;
}

/**
 * Convenience function for logging
 */
export function debugLog(message: string, ...args: DebugArg[]): void {
  getDebugLogger().log(message, ...args);
}

/**
 * Convenience function for warning
 */
export function debugWarn(message: string, ...args: DebugArg[]): void {
  getDebugLogger().warn(message, ...args);
}

/**
 * Convenience function for errors
 */
export function debugError(message: string, ...args: DebugArg[]): void {
  getDebugLogger().error(message, ...args);
}

/**
 * Create a scoped debug logger
 */
export function createScopedLogger(scopeName: string): DebugLogger {
  return getDebugLogger().scope(scopeName);
}
