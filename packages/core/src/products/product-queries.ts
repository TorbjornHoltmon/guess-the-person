import { Context } from '../context/context'
import type { ProductTable } from './product-database-schema'

export async function getProductById(id: string): Promise<ProductTable | undefined> {
  const { db } = Context

  return db.query.productTable.findFirst({
    where: (favorite, { eq }) => {
      return eq(favorite._id, id)
    },
  })
}
