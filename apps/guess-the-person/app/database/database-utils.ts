import { sql } from 'drizzle-orm'

export const sqliteISODateNow = sql`(strftime('%Y-%m-%dT%H:%M:%f', 'now') || 'Z')`
