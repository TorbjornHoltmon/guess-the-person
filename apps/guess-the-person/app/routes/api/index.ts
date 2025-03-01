// app/routes/games/index.ts
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { z } from 'zod'
import { answersTable, gamesTable, usersTable } from '../../database/schemas'
// Import your tables (defined via Drizzle schemas)

// Bindings for Cloudflare D1
const app = new Hono<{
  Bindings: {
    DB: D1Database
  }
}>()
  .post(
    '/create-game',
    zValidator(
      'json',
      z.object({
        name: z.string().min(3).max(50),
      }),
    ),
    async (c) => {
      // Create the Drizzle client
      const db = drizzle(c.env.DB)

      // Get validated JSON data
      const json = c.req.valid('json')

      // Generate a short random code for the game
      const gameCode = crypto.randomUUID().substring(0, 5).toUpperCase()

      // Insert a new game row
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

  /**
   * 2. JOIN A GAME (USER REGISTRATION)
   *
   * Validates incoming request with fields for joining a game:
   * - gameCode (string of length 5)
   * - name (user name, min 2 chars, max 50)
   * - other optional fields like personalityType, etc.
   */
  .post(
    '/join-game',
    zValidator(
      'json',
      z.object({
        gameCode: z.string().length(5),
        name: z.string().min(2).max(50),
        personalityType: z.string().max(50).optional(),
        cartoonCharacter: z.string().max(50).optional(),
        eyeColor: z.string().max(30).optional(),
        guiltyPleasureSong: z.string().max(100).optional(),
      }),
    ),
    async (c) => {
      const db = drizzle(c.env.DB)
      const json = c.req.valid('json')
      const userCode = crypto.randomUUID()

      // Insert a new user row
      await db
        .insert(usersTable)
        .values({
          userCode,
          gameCode: json.gameCode,
          name: json.name,
          personalityType: json.personalityType,
          cartoonCharacter: json.cartoonCharacter,
          eyeColor: json.eyeColor,
          guiltyPleasureSong: json.guiltyPleasureSong,
          userWasSelected: false,
        })
        .run()

      return c.json({ userCode, message: 'User joined the game!' })
    },
  )

  /**
   * 3. START A GAME (SELECT RANDOM USER FOR GUESSING)
   *
   * Validates incoming request with a `gameCode`.
   * Selects a random user who hasn't been guessed before, updates game state.
   */
  .post(
    '/start-game',
    zValidator(
      'json',
      z.object({
        gameCode: z.string().length(5),
      }),
    ),
    async (c) => {
      const db = drizzle(c.env.DB)
      const json = c.req.valid('json')

      const players = await db.select().from(usersTable).where(eq(usersTable.gameCode, json.gameCode))

      if (players.length < 2) {
        return c.json({ error: 'Not enough players!' }, 400)
      }

      // Randomly select a user
      const selectedPerson = players[Math.floor(Math.random() * players.length)]

      // Mark that user as selected
      await db
        .update(usersTable)
        .set({ userWasSelected: true })
        .where(eq(usersTable.userCode, selectedPerson.userCode))
        .run()

      // Update the game to reference the unknown user
      await db
        .update(gamesTable)
        .set({ currentUnknownUser: selectedPerson.userCode })
        .where(eq(gamesTable.gameCode, json.gameCode))
        .run()

      return c.json({ selectedPersonId: selectedPerson.userCode })
    },
  )

  /**
   * 4. MAKE A GUESS
   *
   * Validates incoming request with fields:
   * - gameCode: length 5
   * - userCode: valid UUID
   * - guessedUserCode: valid UUID
   * - numberOfTries: optional, minimum 1
   *
   * Inserts a record in `answersTable` and checks correctness.
   */
  .post(
    '/make-guess',
    zValidator(
      'json',
      z.object({
        gameCode: z.string().length(5),
        userCode: z.string().uuid(),
        guessedUserCode: z.string().uuid(),
        numberOfTries: z.number().min(1),
      }),
    ),
    async (c) => {
      const db = drizzle(c.env.DB)
      const json = c.req.valid('json')

      // Check if the game exists
      const [currentGame] = await db.select().from(gamesTable).where(eq(gamesTable.gameCode, json.gameCode))
      if (!currentGame) {
        return c.json({ error: 'Game not found!' }, 400)
      }

      // Validate if there's a user to guess
      const currentUnknownUser = currentGame.currentUnknownUser
      if (!currentUnknownUser) {
        return c.json({ error: 'No unknown user selected!' }, 400)
      }

      // Check if the guess is correct
      const isCorrect = json.guessedUserCode === currentUnknownUser

      // Insert a new guess
      await db
        .insert(answersTable)
        .values({
          id: crypto.randomUUID(),
          gameCode: json.gameCode,
          userCode: json.userCode,
          guessedUserCode: json.guessedUserCode,
          roundNumber: currentGame.currentRound ?? 1,
          numberOfTries: json.numberOfTries,
        })
        .run()

      return c.json({ correct: isCorrect, message: isCorrect ? 'Correct guess!' : 'Wrong guess!' })
    },
  )

// Stupid hack to be able to see types for the client
const apiWithTypes = new Hono().route('/api', app)

export { apiWithTypes }

export default app
