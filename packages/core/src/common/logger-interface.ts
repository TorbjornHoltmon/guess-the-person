export interface Logger {
  info: (msg: string, data?: Record<string, any>) => void
  warn: (msg: string, data?: Record<string, any>) => void
  error: (msg: string, data?: Record<string, any>) => void
  debug: (msg: string, data?: Record<string, any>) => void
  flush: () => Promise<void>
  child: (tags: string[]) => Logger
}
