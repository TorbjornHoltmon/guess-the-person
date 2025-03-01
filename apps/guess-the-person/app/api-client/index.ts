import { hc } from 'hono/client'
import type { apiWithTypes } from '../routes/api/index'

export const getApiClient = (options?: { url?: URL }) => {
  const { url } = options || {}
  return hc<typeof apiWithTypes>(typeof window !== 'undefined' || !url ? window.location.origin : url.origin)
}
