import { useEffect, useState } from 'hono/jsx'
import { AdminPanel } from './admin-panel'
import { GameHeader } from './game-header'
import { GameLobby } from './game-lobby'
import { GamePlay } from './game-play'
import { mockUsers } from './mock-data' // Import mock data
import { Leaderboard as LeaderboardType, User, Users } from './types'
import { UserProfile } from './user-profile'

function App() {
  const [gameState, setGameState] = useState<'lobby' | 'profile' | 'admin' | 'play'>('lobby')
  const [gameCode, setGameCode] = useState<string>('')
  const [userCode, setUserCode] = useState<string>('')
  const [users, setUsers] = useState<Users>({})
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [useMockData, setUseMockData] = useState<boolean>(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardType>({})
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)

  // Load mock data if enabled
  useEffect(() => {
    if (useMockData && gameState === 'admin') {
      setUsers(mockUsers)
    }
  }, [useMockData, gameState])

  const handleCreateGame = () => {
    // In a real app, this would make an API call to create a game
    const newGameCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGameCode(newGameCode)
    setIsAdmin(true)
    setGameState('admin')
  }

  const handleJoinGame = (code: string) => {
    // In a real app, this would validate the game code against the backend
    setGameCode(code)
    setGameState('profile')
  }

  const handleProfileSubmit = (user: User) => {
    // In a real app, this would send the profile to the backend
    const newUserCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newUser = { ...user, code: newUserCode }

    setUsers((prev) => ({ ...prev, [newUserCode]: newUser }))
    setCurrentUser(newUser)
    setUserCode(newUserCode)

    // Initialize user's score in the leaderboard
    setLeaderboard((prev) => ({
      ...prev,
      [newUserCode]: {
        userCode: newUserCode,
        userName: newUser.name,
        correctGuesses: 0,
        totalGuesses: 0,
        hintsUsed: 0,
        points: 0,
        averageTime: 0,
      },
    }))

    if (isAdmin) {
      setGameState('admin')
    } else {
      setGameState('play')
    }
  }

  const handleStartGame = (selectedUsers: Users) => {
    // In a real app, this would start the game on the backend
    setUsers(selectedUsers)
    setGameState('play')
  }

  const toggleMockData = () => {
    setUseMockData(!useMockData)
  }

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard)
  }

  const updateScore = (userCode: string, isCorrect: boolean, numberOfTries: number, hintsUsed: number) => {
    setLeaderboard((prev) => {
      const userScore = prev[userCode] || {
        userCode,
        userName: users[userCode]?.name || 'Unknown',
        correctGuesses: 0,
        totalGuesses: 0,
        hintsUsed: 0,
        points: 0,
        averageTime: 0,
      }

      // Calculate new score
      const newCorrectGuesses = isCorrect ? userScore.correctGuesses + 1 : userScore.correctGuesses
      const newTotalGuesses = userScore.totalGuesses + 1
      const newHintsUsed = userScore.hintsUsed + hintsUsed

      // Calculate points
      // Base points: 100 per correct guess
      // Speed bonus: Up to 50 points based on how quickly they guess (fewer tries = more points)
      // Hint penalty: -10 points per hint used
      let newPoints = userScore.points

      if (isCorrect) {
        const basePoints = 100
        const maxSpeedBonus = 50
        const speedBonus = Math.max(0, maxSpeedBonus - (numberOfTries - 1) * 10)
        const hintPenalty = hintsUsed * 10

        newPoints += basePoints + speedBonus - hintPenalty
      }

      // Calculate average time (tries per correct guess)
      const newAverageTime =
        newCorrectGuesses > 0
          ? (userScore.averageTime * (newCorrectGuesses - (isCorrect ? 1 : 0)) + numberOfTries) / newCorrectGuesses
          : 0

      return {
        ...prev,
        [userCode]: {
          ...userScore,
          correctGuesses: newCorrectGuesses,
          totalGuesses: newTotalGuesses,
          hintsUsed: newHintsUsed,
          points: newPoints,
          averageTime: newAverageTime,
        },
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {gameState === 'lobby' && <GameLobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />}

        {gameState === 'profile' && <UserProfile onSubmit={handleProfileSubmit} />}

        {gameState === 'admin' && (
          <AdminPanel
            gameCode={gameCode}
            users={users}
            onStartGame={handleStartGame}
            onAddProfile={() => setGameState('profile')}
            useMockData={useMockData}
            onToggleMockData={toggleMockData}
          />
        )}

        {gameState === 'play' && !showLeaderboard && (
          <GamePlay
            gameCode={gameCode}
            userCode={userCode}
            users={users}
            currentUser={currentUser}
            onUpdateScore={updateScore}
          />
        )}
      </div>
    </div>
  )
}

export default App
