'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class StegaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Stega Error Boundary caught an error:', error, errorInfo);

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // sendToErrorTrackingService({ error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-rounded-lg p-border p-border-red-200 p-bg-red-50 p-p-4 p-text-sm p-text-red-800">
          <div className="p-mb-2 p-font-semibold">Preview mode unavailable</div>
          <div className="p-text-red-600">
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
