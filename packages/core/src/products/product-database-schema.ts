import { relations } from 'drizzle-orm'
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sqliteISODateNow } from '../database/sqlite-now'
import { sqliteUUIDv7 } from '../database/sqlite-uuid7'
import { variantTable } from './variant-database-schema'

export const productTable = sqliteTable(
  'product',
  {
    _id: text('_id').primaryKey().notNull().default(sqliteUUIDv7('product')),
    id: text('id').notNull(),
    title: text('title'),
    createdAt: text('created_at', { mode: 'text' }).default(sqliteISODateNow),
    updatedAt: text('updated_at', { mode: 'text' }).default(sqliteISODateNow),
  },
  (currentTable) => [
    index('product_table_id_idx').on(currentTable.id),
    index('product_table_created_at_idx').on(currentTable.createdAt),
    index('product_table_updated_at_idx').on(currentTable.updatedAt),
  ],
)

export const productTableRelations = relations(productTable, ({ many }) => ({
  variants: many(variantTable),
}))

export type ProductTable = typeof productTable.$inferSelect
