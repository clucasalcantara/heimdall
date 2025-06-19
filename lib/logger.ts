export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  message: string
  data?: any
  source: string
}

class Logger {
  private logs: LogEntry[] = []
  private listeners: ((logs: LogEntry[]) => void)[] = []
  private maxLogs = 5000 // Reduced for massive tests
  private batchSize = 100
  private pendingLogs: LogEntry[] = []
  private batchTimeout: NodeJS.Timeout | null = null

  log(level: LogLevel, message: string, data?: any, source = "system") {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level,
      message,
      data,
      source,
    }

    // Batch logs for performance during massive tests
    this.pendingLogs.push(entry)

    if (this.pendingLogs.length >= this.batchSize) {
      this.flushLogs()
    } else if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => this.flushLogs(), 1000)
    }

    // Also log to console for debugging
    const levelName = LogLevel[level]
    const timestamp = new Date(entry.timestamp).toLocaleTimeString()
    console.log(`[${timestamp}] [${levelName}] [${source}] ${message}`, data || "")
  }

  private flushLogs() {
    if (this.pendingLogs.length === 0) return

    this.logs.unshift(...this.pendingLogs)
    this.pendingLogs = []

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
      this.batchTimeout = null
    }

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener([...this.logs]))
  }

  debug(message: string, data?: any, source?: string) {
    this.log(LogLevel.DEBUG, message, data, source)
  }

  info(message: string, data?: any, source?: string) {
    this.log(LogLevel.INFO, message, data, source)
  }

  warn(message: string, data?: any, source?: string) {
    this.log(LogLevel.WARN, message, data, source)
  }

  error(message: string, data?: any, source?: string) {
    this.log(LogLevel.ERROR, message, data, source)
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener)
    // Send current logs immediately
    listener([...this.logs])

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  getLogs(level?: LogLevel, source?: string, limit?: number): LogEntry[] {
    // Flush any pending logs first
    this.flushLogs()

    let filteredLogs = [...this.logs]

    if (level !== undefined) {
      filteredLogs = filteredLogs.filter((log) => log.level >= level)
    }

    if (source) {
      filteredLogs = filteredLogs.filter((log) => log.source === source)
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(0, limit)
    }

    return filteredLogs
  }

  clear() {
    this.logs = []
    this.pendingLogs = []
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
      this.batchTimeout = null
    }
    this.listeners.forEach((listener) => listener([]))
  }

  getStats() {
    this.flushLogs() // Ensure all logs are processed

    const now = Date.now()
    const last5Minutes = now - 5 * 60 * 1000
    const recentLogs = this.logs.filter((log) => log.timestamp > last5Minutes)

    return {
      totalLogs: this.logs.length,
      recentLogs: recentLogs.length,
      errorCount: recentLogs.filter((log) => log.level === LogLevel.ERROR).length,
      warnCount: recentLogs.filter((log) => log.level === LogLevel.WARN).length,
      sources: [...new Set(this.logs.map((log) => log.source))],
      pendingLogs: this.pendingLogs.length,
    }
  }
}

// Global logger instance
export const logger = new Logger()
