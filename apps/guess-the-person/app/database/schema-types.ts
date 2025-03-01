import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core'
import type {
  answersTable,
  answersRelations,
  gamesTable,
  gamesTableRelations,
  usersRelations,
  usersTable,
} from './schemas'

export type Schema = {
  answersTable: typeof answersTable
  answersRelations: typeof answersRelations
  gamesTable: typeof gamesTable
  gamesTableRelations: typeof gamesTableRelations
  usersTable: typeof usersTable
  usersRelations: typeof usersRelations
}

export type Database = BaseSQLiteDatabase<'async', void, Schema>
