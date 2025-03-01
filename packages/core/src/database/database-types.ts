import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core'
import type { productTable, productTableRelations } from '../products/product-database-schema'
import type { variantTable, variantTableRelations } from '../products/variant-database-schema'

export type Schema = {
  productTable: typeof productTable
  productTableRelations: typeof productTableRelations
  variantTable: typeof variantTable
  variantTableRelations: typeof variantTableRelations
}

export type Database = BaseSQLiteDatabase<'async', void, Schema>
