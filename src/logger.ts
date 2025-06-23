/**
 * Logger utilities for MCP Mermaid Server
 */

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, ...args: any[]): void {
    console.error(`[INFO] [${this.context}] ${message}`, ...args);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] [${this.context}] ${message}`, error);
  }

  warn(message: string, ...args: any[]): void {
    console.error(`[WARN] [${this.context}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.DEBUG) {
      console.error(`[DEBUG] [${this.context}] ${message}`, ...args);
    }
  }
}