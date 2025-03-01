export interface User {
  code?: string
  name: string
  personalityType: string
  eyeColor: string
  cartoonCharacter: string
  guiltyPleasureSong: string
  imageUrl?: string
}

export interface Users {
  [key: string]: User
}

export interface Guess {
  userCode: string
  guessedUserCode: string
  isCorrect: boolean
  numberOfTries: number
}

export interface Score {
  userCode: string
  userName: string
  correctGuesses: number
  totalGuesses: number
  hintsUsed: number
  points: number
  averageTime: number // Average number of tries per correct guess
}

export interface Leaderboard {
  [key: string]: Score
}
