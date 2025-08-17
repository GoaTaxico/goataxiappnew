import React from 'react';

interface ErrorContext {
  userId?: string;
  userRole?: string;
  page?: string;
  action?: string;
  timestamp?: string;
  userAgent?: string;
  url?: string;
  [key: string]: any;
}

interface ErrorReport {
  message: string;
  stack?: string;
  name: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags?: Record<string, string>;
}

class ErrorReportingService {
  private isEnabled: boolean;
  private endpoint: string;
  private apiKey: string;
  private environment: string;
  private appVersion: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.endpoint = process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT || '/api/errors';
    this.apiKey = process.env.NEXT_PUBLIC_ERROR_REPORTING_API_KEY || '';
    this.environment = process.env.NODE_ENV || 'development';
    this.appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  }

  // Capture and report an error
  captureError(error: Error, context: ErrorContext = {}, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    if (!this.isEnabled) {
      console.error('Error Reporting (Development):', error, context);
      return;
    }

    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        environment: this.environment,
        appVersion: this.appVersion,
      },
      severity,
      tags: {
        environment: this.environment,
        version: this.appVersion,
        type: error.name,
      },
    };

    this.sendErrorReport(errorReport);
  }

  // Capture and report a message
  captureMessage(message: string, context: ErrorContext = {}, severity: 'low' | 'medium' | 'high' | 'critical' = 'low') {
    if (!this.isEnabled) {
      console.log('Message Reporting (Development):', message, context);
      return;
    }

    const errorReport: ErrorReport = {
      message,
      name: 'UserMessage',
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        environment: this.environment,
        appVersion: this.appVersion,
      },
      severity,
      tags: {
        environment: this.environment,
        version: this.appVersion,
        type: 'message',
      },
    };

    this.sendErrorReport(errorReport);
  }

  // Set user context for all future error reports
  setUser(userId: string, userRole?: string, additionalData?: Record<string, any>) {
    if (typeof window !== 'undefined') {
      (window as any).__ERROR_REPORTING_USER__ = {
        id: userId,
        role: userRole,
        ...additionalData,
      };
    }
  }

  // Clear user context
  clearUser() {
    if (typeof window !== 'undefined') {
      delete (window as any).__ERROR_REPORTING_USER__;
    }
  }

  // Add breadcrumb for debugging
  addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    if (!this.isEnabled) {
      console.log('Breadcrumb (Development):', { message, category, data });
      return;
    }

    const breadcrumb = {
      message,
      category,
      data,
      timestamp: new Date().toISOString(),
    };

    // Store breadcrumbs in session storage for debugging
    if (typeof window !== 'undefined') {
      const breadcrumbs = JSON.parse(sessionStorage.getItem('error_breadcrumbs') || '[]');
      breadcrumbs.push(breadcrumb);
      
      // Keep only last 50 breadcrumbs
      if (breadcrumbs.length > 50) {
        breadcrumbs.splice(0, breadcrumbs.length - 50);
      }
      
      sessionStorage.setItem('error_breadcrumbs', JSON.stringify(breadcrumbs));
    }
  }

  // Send error report to the server
  private async sendErrorReport(errorReport: ErrorReport) {
    try {
      // Add user context if available
      if (typeof window !== 'undefined' && (window as any).__ERROR_REPORTING_USER__) {
        errorReport.context.userId = (window as any).__ERROR_REPORTING_USER__.id;
        errorReport.context.userRole = (window as any).__ERROR_REPORTING_USER__.role;
      }

      // Add breadcrumbs if available
      if (typeof window !== 'undefined') {
        const breadcrumbs = JSON.parse(sessionStorage.getItem('error_breadcrumbs') || '[]');
        if (breadcrumbs.length > 0) {
          errorReport.context.breadcrumbs = breadcrumbs;
        }
      }

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(errorReport),
      });

      if (!response.ok) {
        console.error('Failed to send error report:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error sending error report:', error);
    }
  }

  // Enable/disable error reporting
  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Get breadcrumbs for debugging
  getBreadcrumbs() {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem('error_breadcrumbs') || '[]');
    }
    return [];
  }

  // Clear breadcrumbs
  clearBreadcrumbs() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('error_breadcrumbs');
    }
  }
}

// Create singleton instance
export const errorReporting = new ErrorReportingService();

// React Error Boundary integration
export function withErrorReporting<P extends object>(
  Component: React.ComponentType<P>,
  context?: ErrorContext
) {
  return function ErrorBoundaryWrappedComponent(props: P) {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
      errorReporting.captureError(error, {
        ...context,
        componentName: Component.name,
        errorInfo,
      }, 'high');
    };

    return (
      <ErrorBoundary onError={handleError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error, errorInfo: React.ErrorInfo) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error, errorInfo: React.ErrorInfo) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We&apos;ve encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for error reporting
export function useErrorReporting() {
  const captureError = React.useCallback((error: Error, context?: ErrorContext) => {
    errorReporting.captureError(error, context);
  }, []);

  const captureMessage = React.useCallback((message: string, context?: ErrorContext) => {
    errorReporting.captureMessage(message, context);
  }, []);

  const addBreadcrumb = React.useCallback((message: string, category: string, data?: Record<string, any>) => {
    errorReporting.addBreadcrumb(message, category, data);
  }, []);

  return {
    captureError,
    captureMessage,
    addBreadcrumb,
  };
}

// Global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorReporting.captureError(
      new Error(event.reason?.message || 'Unhandled Promise Rejection'),
      {
        action: 'unhandledrejection',
        reason: event.reason,
      },
      'high'
    );
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    errorReporting.captureError(
      new Error(event.message),
      {
        action: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      'high'
    );
  });
}
