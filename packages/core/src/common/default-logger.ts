import kleur from 'kleur'
import type { Logger } from './logger-interface.js'

export interface DefaultLoggerOptions {
  tags?: string[]
}

function withTags(tags: string[]) {
  return tags.length ? ':' + tags.join(',') : ''
}

export class DefaultLogger implements Logger {
  private tags: string[] = []
  constructor(options?: DefaultLoggerOptions) {
    this.tags = options?.tags ?? []
  }
  public async flush() {}
  public info(msg: string, data?: Record<string | number, unknown>) {
    if (data) console.log(`[${kleur.blue('INFO')}${withTags(this.tags)}]`, msg, data)
    else console.log(`[${kleur.blue('INFO')}${withTags(this.tags)}]`, msg)
  }
  public warn(msg: string, data?: Record<string | number, unknown>) {
    if (data) console.log(`[${kleur.yellow('WARN')}${withTags(this.tags)}]`, msg, data)
    else console.log(`[${kleur.yellow('WARN')}${withTags(this.tags)}]`, msg)
  }
  public error(msg: string, data?: Record<string | number, unknown>) {
    if (data) console.log(`[${kleur.red('ERROR')}${withTags(this.tags)}]`, msg, data)
    else console.log(`[${kleur.red('ERROR')}${withTags(this.tags)}]`, msg)
  }
  public debug(msg: string, data?: Record<string | number, unknown>) {
    if (data) console.log(`[${kleur.bgMagenta('DEBUG')}${withTags(this.tags)}]`, msg, data)
    else console.log(`[${kleur.bgMagenta('DEBUG')}${withTags(this.tags)}]`, msg)
  }
  public child(tags?: string[]) {
    const defaultTags = tags ?? []
    const combinedTags = [...this.tags, ...defaultTags]
    return new DefaultLogger({ tags: combinedTags })
  }
}
