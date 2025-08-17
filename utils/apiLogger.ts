// API-specific logging utility
import { logError, logWarn, logInfo } from './logger';

export const apiLogger = {
  error: (message: string, error?: any, route?: string) => {
    logError(message, error instanceof Error ? error : new Error(String(error)), undefined, `API:${route || 'Unknown'}`);
  },
  
  warn: (message: string, data?: any, route?: string) => {
    logWarn(message, data, `API:${route || 'Unknown'}`);
  },
  
  info: (message: string, data?: any, route?: string) => {
    logInfo(message, data, `API:${route || 'Unknown'}`);
  }
};

// Convenience functions for common API error patterns
export const logApiError = (operation: string, error: any, route?: string) => {
  apiLogger.error(`${operation} error`, error, route);
};

export const logDatabaseError = (operation: string, error: any, route?: string) => {
  apiLogger.error(`Database ${operation} error`, error, route);
};

export const logAuthError = (operation: string, error: any, route?: string) => {
  apiLogger.error(`Authentication ${operation} error`, error, route);
};

export default apiLogger;
