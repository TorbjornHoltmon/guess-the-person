import { v7 } from 'uuid'

export function UUIDv7(prefix?: string): string {
  return `${prefix}-${v7()}`
}
