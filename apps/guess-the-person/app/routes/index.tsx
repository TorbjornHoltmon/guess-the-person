import { createRoute } from 'honox/factory'
import { HomePage } from '../islands/home-page'

export default createRoute((c) => {
  return c.render(<HomePage />)
})
