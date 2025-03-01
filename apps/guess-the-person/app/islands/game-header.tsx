interface GameHeaderProps {
  gameCode: string
  onToggleLeaderboard?: () => void
  showLeaderboard?: boolean
}

export const GameHeader = ({ gameCode, onToggleLeaderboard, showLeaderboard = false }: GameHeaderProps) => {
  return (
    <header className="bg-slate-950 shadow-lg py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            className="h-8 w-8 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h1 className="text-2xl font-bold text-white">Guess the Person</h1>
        </div>

        <div className="flex items-center space-x-4">
          {gameCode && onToggleLeaderboard && (
            <button
              onClick={onToggleLeaderboard}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                showLeaderboard
                  ? 'bg-yellow-700 hover:bg-yellow-800 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M12 18v-6"></path>
                <path d="M8 18v-1"></path>
                <path d="M16 18v-3"></path>
              </svg>
              <span>{showLeaderboard ? 'Back to Game' : 'Leaderboard'}</span>
            </button>
          )}

          {gameCode && (
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-gray-300 mr-2">Game Code:</span>
              <span className="font-mono font-bold text-white">{gameCode}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
