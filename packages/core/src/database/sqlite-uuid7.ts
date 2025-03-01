import { sql } from 'drizzle-orm'

export function sqliteUUIDv7(prefix?: string) {
  return sql`${prefix}-uuid7()`
}
