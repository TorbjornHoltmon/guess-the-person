import { createRoute } from 'honox/factory'
import { AdminPage } from '../../islands/admin-page'

export default createRoute((c) => {
  const url = new URL(c.req.raw.url)
  const gameCode = url.pathname.split('/')[1]
  return c.render(<AdminPage gameCode={gameCode} />)
})
