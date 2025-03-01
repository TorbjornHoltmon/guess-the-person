import { relations } from 'drizzle-orm'
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sqliteISODateNow } from '../database/sqlite-now'
import { sqliteUUIDv7 } from '../database/sqlite-uuid7'
import { productTable } from './product-database-schema'

export const variantTable = sqliteTable(
  'variant',
  {
    _id: text('_id').primaryKey().notNull().default(sqliteUUIDv7('variant')),
    id: text('id').notNull(),
    skuId: text('sku_id').unique().notNull(),
    ean: text('ean'),
    title: text('title'),
    createdAt: text('created_at').default(sqliteISODateNow),
    updatedAt: text('updated_at').default(sqliteISODateNow),
    productId: text('product_id').references(() => productTable._id, {
      onDelete: 'cascade',
    }),
  },
  (currentTable) => [
    index('variant_table_id_idx').on(currentTable.id),
    index('variant_table_product_id_idx').on(currentTable.productId),
    index('variant_table_created_at_idx').on(currentTable.createdAt),
    index('variant_table_updated_at_idx').on(currentTable.updatedAt),
  ],
)

export const variantTableRelations = relations(variantTable, ({ one }) => ({
  product: one(productTable, {
    fields: [variantTable.productId],
    references: [productTable._id],
  }),
}))

export type VariantTable = typeof variantTable.$inferInsert
