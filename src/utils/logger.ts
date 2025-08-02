/**
 * Simple logger utility with timestamps
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = this.formatTimestamp();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  debug(message: string, data?: any): void {
    if (process.env['NODE_ENV'] === 'development') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }
}

export const logger = new Logger();
