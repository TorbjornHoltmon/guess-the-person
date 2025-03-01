import { useEffect, useState } from 'hono/jsx'
import { Guess, User as UserType, Users } from './types'

interface GamePlayProps {
  gameCode: string
  userCode: string
  users: Users
  currentUser: UserType | null
  onUpdateScore?: (userCode: string, isCorrect: boolean, numberOfTries: number, hintsUsed: number) => void
}

export const GamePlay = ({ gameCode, userCode, users, currentUser, onUpdateScore }: GamePlayProps) => {
  const [loading, setLoading] = useState(true)
  const [unknownUser, setUnknownUser] = useState<UserType | null>(null)
  const [revealedHints, setRevealedHints] = useState<string[]>([])
  const [selectedUserCode, setSelectedUserCode] = useState<string | null>(null)
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null)
  const [numberOfTries, setNumberOfTries] = useState(0)
  const [guessHistory, setGuessHistory] = useState<Guess[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [roundScore, setRoundScore] = useState<{
    points: number
    breakdown: { base: number; speed: number; hints: number }
  } | null>(null)
  const [finalGuessMode, setFinalGuessMode] = useState(false)
  const [roundEnded, setRoundEnded] = useState(false)

  // Define the order of hints to reveal
  const hintOrder = ['personalityType', 'eyeColor', 'cartoonCharacter', 'guiltyPleasureSong', 'imageUrl']

  // Simulate fetching the current unknown user from the backend
  useEffect(() => {
    const fetchUnknownUser = () => {
      setLoading(true)

      // In a real app, this would be an API call
      setTimeout(() => {
        const userCodes = Object.keys(users).filter((code) => code !== userCode)
        if (userCodes.length === 0) {
          setGameOver(true)
          setLoading(false)
          return
        }

        const randomUserCode = userCodes[Math.floor(Math.random() * userCodes.length)]
        setUnknownUser(users[randomUserCode])
        setLoading(false)

        // Always reveal the first hint when starting the game
        setRevealedHints(['personalityType'])

        setSelectedUserCode(null)
        setGuessResult(null)
        setNumberOfTries(0)
        setRoundScore(null)
        setFinalGuessMode(false)
        setRoundEnded(false)
      }, 1000)
    }

    fetchUnknownUser()
  }, [users, userCode, gameOver])

  // Check if we've revealed the image (last hint)
  useEffect(() => {
    if (revealedHints.includes('imageUrl') && !finalGuessMode && !roundEnded) {
      setFinalGuessMode(true)
    }
  }, [revealedHints, finalGuessMode, roundEnded])

  const revealNextHint = () => {
    if (!unknownUser || roundEnded) return

    // Find the next hint to reveal based on the defined order
    const nextHint = hintOrder.find((hint) => !revealedHints.includes(hint))

    if (nextHint) {
      setRevealedHints((prev) => [...prev, nextHint])
    }
  }

  const calculateScore = (isCorrect: boolean, tries: number, hints: number) => {
    if (!isCorrect) return null

    const basePoints = 100
    const maxSpeedBonus = 50
    const speedBonus = Math.max(0, maxSpeedBonus - (tries - 1) * 10)
    const hintPenalty = hints * 10

    const totalPoints = basePoints + speedBonus - hintPenalty

    return {
      points: totalPoints,
      breakdown: {
        base: basePoints,
        speed: speedBonus,
        hints: -hintPenalty,
      },
    }
  }

  const makeGuess = () => {
    if (!selectedUserCode || !unknownUser || roundEnded) return

    setNumberOfTries((prev) => prev + 1)
    const currentTries = numberOfTries + 1

    // In a real app, this would be an API call
    const isCorrect = selectedUserCode === unknownUser.code
    setGuessResult(isCorrect ? 'correct' : 'incorrect')

    const newGuess: Guess = {
      userCode,
      guessedUserCode: selectedUserCode,
      isCorrect,
      numberOfTries: currentTries,
    }

    setGuessHistory([...guessHistory, newGuess])

    // Calculate score for this round
    if (isCorrect) {
      const score = calculateScore(true, currentTries, revealedHints.length)
      setRoundScore(score)

      // Update the overall score in the parent component
      if (onUpdateScore) {
        onUpdateScore(userCode, true, currentTries, revealedHints.length)
      }
    } else {
      // If incorrect, update the score with a failed attempt
      if (onUpdateScore) {
        onUpdateScore(userCode, false, currentTries, 0)
      }
    }

    // If correct, move to next round after a delay
    if (isCorrect) {
      setTimeout(() => {
        // In a real app, this would trigger the next round via API
        const userCodes = Object.keys(users).filter((code) => code !== userCode)
        if (userCodes.length === 0) {
          setGameOver(true)
        } else {
          const randomUserCode = userCodes[Math.floor(Math.random() * userCodes.length)]
          setUnknownUser(users[randomUserCode])
          // Always reveal the first hint when starting a new round
          setRevealedHints(['personalityType'])
          setSelectedUserCode(null)
          setGuessResult(null)
          setNumberOfTries(0)
          setRoundScore(null)
          setFinalGuessMode(false)
          setRoundEnded(false)
        }
      }, 5000) // Longer delay to show the score
    } else if (finalGuessMode) {
      // If in final guess mode and guess is incorrect, end the round
      setRoundEnded(true)
    } else if (revealedHints.length < hintOrder.length) {
      // If incorrect and not all hints revealed, reveal the next hint automatically
      setTimeout(() => {
        revealNextHint()
      }, 1000)
    }
  }

  const nextRound = () => {
    // Reset for next round
    // Always reveal the first hint when starting a new round
    setRevealedHints(['personalityType'])
    setSelectedUserCode(null)
    setGuessResult(null)
    setNumberOfTries(0)
    setRoundScore(null)
    setFinalGuessMode(false)
    setRoundEnded(false)

    // In a real app, this would fetch the next unknown user
    const userCodes = Object.keys(users).filter((code) => code !== userCode)
    if (userCodes.length === 0) {
      setGameOver(true)
    } else {
      const randomUserCode = userCodes[Math.floor(Math.random() * userCodes.length)]
      setUnknownUser(users[randomUserCode])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="mb-6">You've completed all the rounds. Here's your performance:</p>

        <div className="bg-slate-900/70 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/80 p-4 rounded-lg">
              <p className="text-gray-400">Total Guesses</p>
              <p className="text-3xl font-bold">{guessHistory.length}</p>
            </div>
            <div className="bg-gray-800/80 p-4 rounded-lg">
              <p className="text-gray-400">Correct Guesses</p>
              <p className="text-3xl font-bold">{guessHistory.filter((g) => g.isCorrect).length}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center mx-auto"
        >
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Play Again
        </button>
      </div>
    )
  }

  if (!unknownUser) {
    return (
      <div className="text-center py-8">
        <p>No users available to guess.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mystery Person Panel */}
        <div className="md:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Mystery Person
            </h2>

            <div className="space-y-3">
              <div className="bg-slate-900/90 p-3 rounded-lg">
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-400">Personality Type</span>
                  {revealedHints.includes('personalityType') ? (
                    <span className="font-semibold">{unknownUser.personalityType}</span>
                  ) : (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg">
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-400">Eye Color</span>
                  {revealedHints.includes('eyeColor') ? (
                    <span className="font-semibold">{unknownUser.eyeColor}</span>
                  ) : (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg">
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-400">Cartoon Character</span>
                  {revealedHints.includes('cartoonCharacter') ? (
                    <span className="font-semibold">{unknownUser.cartoonCharacter}</span>
                  ) : (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg">
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-400">Guilty Pleasure Song</span>
                  {revealedHints.includes('guiltyPleasureSong') ? (
                    <span className="font-semibold">{unknownUser.guiltyPleasureSong}</span>
                  ) : (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg">
                <div className="flex items-center justify-between w-full">
                  <span className="text-gray-400">Image</span>
                  {revealedHints.includes('imageUrl') ? (
                    <span className="font-semibold text-green-400">Revealed</span>
                  ) : (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Image display area - only shown when revealed */}
            {revealedHints.includes('imageUrl') && (
              <div className="mt-4 h-48 bg-slate-900/70 rounded-lg overflow-hidden">
                <img src={unknownUser.imageUrl} alt="Mystery Person" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">
                Hints revealed: {revealedHints.length}/{hintOrder.length}
              </p>
              <div className="w-full bg-slate-900/70 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(revealedHints.length / hintOrder.length) * 100}%` }}
                ></div>
              </div>

              <button
                onClick={revealNextHint}
                disabled={revealedHints.length >= hintOrder.length || guessResult === 'correct' || roundEnded}
                className={`mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition ${
                  revealedHints.length >= hintOrder.length || guessResult === 'correct' || roundEnded
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                Reveal Next Hint
              </button>
            </div>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="md:col-span-2 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Make Your Guess</h2>

            {(guessResult || roundEnded) && (
              <div className={`mb-6 p-4 rounded-lg ${guessResult === 'correct' ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                <div className="flex items-center">
                  {guessResult === 'correct' ? (
                    <svg
                      className="h-6 w-6 text-green-400 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-red-400 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  )}
                  <p className="font-semibold">
                    {guessResult === 'correct'
                      ? 'Correct! You guessed the right person.'
                      : roundEnded
                        ? 'Round ended. Your final guess was incorrect.'
                        : 'Incorrect. Revealing next hint...'}
                  </p>
                </div>

                {finalGuessMode && !roundEnded && guessResult === 'incorrect' && (
                  <div className="mt-4 bg-blue-900/50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-blue-400 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <p className="font-semibold">Image revealed! Make your final guess.</p>
                    </div>
                  </div>
                )}

                {guessResult === 'correct' && roundScore && (
                  <div className="mt-4 bg-slate-900/50 p-3 rounded-lg">
                    <h3 className="font-semibold text-green-400 mb-2">Round Score: +{roundScore.points} points</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Base</p>
                        <p className="font-bold">+{roundScore.breakdown.base}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Speed</p>
                        <p className="font-bold">+{roundScore.breakdown.speed}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Hints</p>
                        <p className="font-bold">{roundScore.breakdown.hints}</p>
                      </div>
                    </div>
                  </div>
                )}

                {(guessResult === 'correct' || roundEnded) && (
                  <div className="mt-4">
                    <button
                      onClick={nextRound}
                      className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      Next Round
                    </button>
                  </div>
                )}

                {roundEnded && guessResult === 'incorrect' && (
                  <div className="mt-4 bg-slate-900/50 p-3 rounded-lg">
                    <h3 className="font-semibold text-yellow-400 mb-2">The mystery person was:</h3>
                    <div className="flex items-center space-x-3">
                      {unknownUser.imageUrl && (
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={unknownUser.imageUrl}
                            alt={unknownUser.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <p className="font-bold text-lg">{unknownUser.name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(users)
                .filter(([code]) => code !== userCode) // Don't show current user
                .map(([code, user]) => (
                  <div
                    key={code}
                    className={`bg-slate-900/70 rounded-lg overflow-hidden cursor-pointer transition ${
                      selectedUserCode === code ? 'ring-2 ring-blue-500' : ''
                    } ${guessResult === 'correct' || roundEnded ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={() => setSelectedUserCode(code)}
                  >
                    <div className="p-4">
                      <h4 className="font-bold text-center text-lg">{user.name}</h4>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Number of tries: {numberOfTries}</p>
              </div>

              <button
                onClick={makeGuess}
                disabled={!selectedUserCode || guessResult === 'correct' || roundEnded}
                className={`bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition ${
                  !selectedUserCode || guessResult === 'correct' || roundEnded ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Submit Guess
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
