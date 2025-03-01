import { zValidator } from '@hono/zod-validator'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { z } from 'zod'
import { gamesTable } from '../../database/schemas'

const app = new Hono<{
  Bindings: {
    DB: D1Database
  }
}>()

// Create a New Game
app.post(
  '/api/create-game',
  zValidator(
    'json',
    z.object({
      name: z.string(),
    }),
  ),
  async (c) => {
    const db = drizzle(c.env.DB)
    const json = c.req.valid('json')
    const gameCode = crypto.randomUUID().substring(0, 5).toUpperCase()

    await db
      .insert(gamesTable)
      .values({
        gameCode,
        name: json.name,
        started: false,
        currentRound: 1,
        currentUnknownUser: null,
      })
      .run()

    return c.json({ gameCode, message: 'Game created!' })
  },
)
export default app
