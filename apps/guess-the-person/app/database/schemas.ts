import { relations } from 'drizzle-orm'
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'
// Games Table
export const gamesTable = sqliteTable('games', {
  gameCode: text('game_code').primaryKey().unique(), // Unique game identifier
  name: text('name').notNull(), // Game name
  started: integer('started', { mode: 'boolean' }).default(false), // 0 = not started, 1 = started
  currentRound: integer('current_round').default(1), // Tracks round number
  currentUnknownUser: text('current_unknown_user'), // The user being guessed
})

export const gamesTableRelations = relations(gamesTable, ({ many }) => ({
  users: many(usersTable),
}))

// Users Table
export const usersTable = sqliteTable('users', {
  userCode: text('user_code').primaryKey().unique(), // Unique user identifier
  gameCode: text('game_code')
    .notNull()
    .references(() => gamesTable.gameCode), // Foreign key linking to game
  name: text('name').notNull(), // Player's name
  personalityType: text('personality_type'), // Personality type
  cartoonCharacter: text('cartoon_character'), // Favorite cartoon character
  eyeColor: text('eye_color'), // Eye color
  guiltyPleasureSong: text('guilty_pleasure_song'), // Guilty pleasure song
  userWasSelected: integer('user_was_selected', { mode: 'boolean' }).default(false), // 1 = selected, 0 = not selected
})

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  game: one(gamesTable),
  answers: many(answersTable),
}))

// Answers Table
export const answersTable = sqliteTable('answers', {
  id: text('id').primaryKey(), // Unique guess ID
  gameCode: text('game_code')
    .notNull()
    .references(() => gamesTable.gameCode), // Foreign key linking to game
  userCode: text('user_code')
    .notNull()
    .references(() => usersTable.userCode), // User making the guess
  guessedUserCode: text('guessed_user_code')
    .notNull()
    .references(() => usersTable.userCode), // The guessed user
  roundNumber: integer('round_number').notNull(), // Round in which guess was made
  numberOfTries: integer('number_of_tries').default(0), // Number of tries for this guess
})

export const answersRelations = relations(answersTable, ({ one }) => ({
  game: one(gamesTable),
  user: one(usersTable),
  guessedUser: one(usersTable),
}))
