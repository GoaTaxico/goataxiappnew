// Centralized logging utility to replace console statements
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
  component?: string;
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string, data?: any, error?: Error, component?: string): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
    
    if (error !== undefined) entry.error = error;
    if (component !== undefined) entry.component = component;
    
    return entry;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: any, component?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.formatMessage(LogLevel.DEBUG, message, data, undefined, component);
      this.addLog(entry);
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[DEBUG] ${component ? `[${component}] ` : ''}${message}`, data);
      }
    }
  }

  info(message: string, data?: any, component?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.formatMessage(LogLevel.INFO, message, data, undefined, component);
      this.addLog(entry);
      if (process.env.NODE_ENV === 'development') {
        console.info(`[INFO] ${component ? `[${component}] ` : ''}${message}`, data);
      }
    }
  }

  warn(message: string, data?: any, component?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.formatMessage(LogLevel.WARN, message, data, undefined, component);
      this.addLog(entry);
      console.warn(`[WARN] ${component ? `[${component}] ` : ''}${message}`, data);
    }
  }

  error(message: string, error?: Error, data?: any, component?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.formatMessage(LogLevel.ERROR, message, data, error, component);
      this.addLog(entry);
      console.error(`[ERROR] ${component ? `[${component}] ` : ''}${message}`, error, data);
    }
  }

  // Get logs for debugging or analytics
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }

  // Set log level
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

// Create singleton instance
export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

// Export convenience functions
export const logDebug = (message: string, data?: any, component?: string) => 
  logger.debug(message, data, component);

export const logInfo = (message: string, data?: any, component?: string) => 
  logger.info(message, data, component);

export const logWarn = (message: string, data?: any, component?: string) => 
  logger.warn(message, data, component);

export const logError = (message: string, error?: Error, data?: any, component?: string) => 
  logger.error(message, error, data, component);

export default logger;
