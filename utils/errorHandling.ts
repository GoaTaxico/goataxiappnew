// Error handling utilities for production

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  isOperational: boolean;
  context?: Record<string, any>;
}

export class AppError extends Error implements AppError {
  public code?: string;
  public statusCode?: number;
  public isOperational: boolean;
  public context?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    if (code !== undefined) this.code = code;
    this.isOperational = isOperational;
    if (context !== undefined) this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error logger for production
export const errorLogger = {
  error: (error: Error | AppError, context?: Record<string, any>) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      context,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        appContext: error.context,
      }),
    };

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error reporting service (Sentry, LogRocket, etc.)
      console.error('Production Error:', errorData);
    } else {
      console.error('Development Error:', errorData);
    }
  },

  warn: (message: string, context?: Record<string, any>) => {
    const warningData = {
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (process.env.NODE_ENV === 'production') {
      console.warn('Production Warning:', warningData);
    } else {
      console.warn('Development Warning:', warningData);
    }
  },

  info: (message: string, context?: Record<string, any>) => {
    const infoData = {
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (process.env.NODE_ENV === 'production') {
      console.info('Production Info:', infoData);
    } else {
      console.info('Development Info:', infoData);
    }
  },
};

// Error handler for async operations
export const asyncErrorHandler = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLogger.error(error as Error);
      throw error;
    }
  };
};

// Error handler for React components
export const componentErrorHandler = (error: Error, errorInfo?: any) => {
  errorLogger.error(error, { errorInfo });
};

// Common error types
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

// Error factory functions
export const createValidationError = (message: string, context?: Record<string, any>) =>
  new AppError(message, 400, ErrorTypes.VALIDATION_ERROR, true, context);

export const createAuthenticationError = (message: string = 'Authentication required', context?: Record<string, any>) =>
  new AppError(message, 401, ErrorTypes.AUTHENTICATION_ERROR, true, context);

export const createAuthorizationError = (message: string = 'Access denied', context?: Record<string, any>) =>
  new AppError(message, 403, ErrorTypes.AUTHORIZATION_ERROR, true, context);

export const createNotFoundError = (message: string = 'Resource not found', context?: Record<string, any>) =>
  new AppError(message, 404, ErrorTypes.NOT_FOUND_ERROR, true, context);

export const createRateLimitError = (message: string = 'Rate limit exceeded', context?: Record<string, any>) =>
  new AppError(message, 429, ErrorTypes.RATE_LIMIT_ERROR, true, context);

export const createNetworkError = (message: string = 'Network error', context?: Record<string, any>) =>
  new AppError(message, 500, ErrorTypes.NETWORK_ERROR, true, context);

export const createDatabaseError = (message: string = 'Database error', context?: Record<string, any>) =>
  new AppError(message, 500, ErrorTypes.DATABASE_ERROR, true, context);

export const createPaymentError = (message: string = 'Payment error', context?: Record<string, any>) =>
  new AppError(message, 500, ErrorTypes.PAYMENT_ERROR, true, context);

export const createExternalServiceError = (message: string = 'External service error', context?: Record<string, any>) =>
  new AppError(message, 500, ErrorTypes.EXTERNAL_SERVICE_ERROR, true, context);

// Error response formatter for API routes
export const formatErrorResponse = (error: Error | AppError) => {
  const isAppError = error instanceof AppError;
  
  return {
    success: false,
    error: {
      message: error.message,
      code: isAppError ? error.code : 'UNKNOWN_ERROR',
      statusCode: isAppError ? error.statusCode : 500,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        name: error.name,
      }),
    },
    timestamp: new Date().toISOString(),
  };
};

// Success response formatter for API routes
export const formatSuccessResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
});
