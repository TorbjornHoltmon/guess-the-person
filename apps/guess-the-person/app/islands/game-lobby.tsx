import { useState } from 'hono/jsx'

interface GameLobbyProps {
  onCreateGame: (gameName: string) => void
  onJoinGame: (code: string) => void
}

export const GameLobby = ({ onCreateGame, onJoinGame }: GameLobbyProps) => {
  const [gameCode, setGameCode] = useState('')
  const [gameName, setGameName] = useState('')

  const handleJoinGame = () => {
    if (gameCode.trim().length < 4) {
      return
    }

    onJoinGame(gameCode.toUpperCase())
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-8">
      <div className="flex justify-center mb-6">
        <svg
          className="h-16 w-16 text-blue-400"
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
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Guess the Person</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="gameCode" className="block text-sm font-medium text-gray-300 mb-1">
            Game name
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => {
              setGameName((e.target as HTMLInputElement).value.toUpperCase())
            }}
            placeholder="Enter game name"
            className="w-full bg-slate-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 mb-3"
          />
        </div>
      </div>

      <div className="space-y-6">
        <button
          onClick={() => onCreateGame(gameName)}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center"
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Game
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">or join existing game</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="gameCode" className="block text-sm font-medium text-gray-300 mb-1">
              Game Code
            </label>
            <input
              type="text"
              id="gameCode"
              value={gameCode}
              onChange={(e) => {
                setGameCode((e.target as HTMLInputElement).value.toUpperCase())
              }}
              placeholder="Enter game code"
              className="w-full bg-slate-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleJoinGame}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center"
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Join Game
          </button>
        </div>
      </div>
    </div>
  )
}
