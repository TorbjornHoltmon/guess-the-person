import { createTimer, prettyDuration } from '../utils/timer.js'
import { getAdaptContext } from '../adapt-context/adapt-context.js'
import type { LogLevel } from '../logger-v2/types.js'

export interface PerformanceLogOptions {
  logPrefix?: string
  level?: LogLevel | ((duration: number | null) => LogLevel)
  name: string
}

export function perfLog<TheClass>(options: PerformanceLogOptions) {
  return (target: TheClass, propertyKey: string, descriptor: PropertyDescriptor) => {
    const { logPrefix, name, level = 'debug' } = options
    const label = logPrefix ? `${logPrefix}.${name}` : name

    const getLogLevel = typeof level === 'function' ? level : (duration: number | null) => level

    const originalMethod = descriptor.value

    async function replacementMethod(this: TheClass, ...args: any[]) {
      const timer = createTimer()
      const { logger_v2 } = getAdaptContext()

      logger_v2[getLogLevel(null)](`Starting ${label}`)

      const result = await originalMethod.call(this, ...args)
      const duration = timer().elapsed
      const durationFormatted = prettyDuration(duration, { colors: false })

      logger_v2[getLogLevel(duration)](`Finished ${label} in ${durationFormatted}`)

      return result
    }

    descriptor.value = replacementMethod

    return descriptor
  }
}
