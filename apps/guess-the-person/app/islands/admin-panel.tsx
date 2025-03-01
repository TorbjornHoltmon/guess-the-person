import { useState } from 'hono/jsx'
import { Users as UsersType, User } from './types'

interface AdminPanelProps {
  gameCode: string
  users: UsersType
  onStartGame: (users: UsersType) => void
  onAddProfile: () => void
  useMockData?: boolean
  onToggleMockData?: () => void
}

export const AdminPanel = ({
  gameCode,
  users,
  onStartGame,
  onAddProfile,
  useMockData = false,
  onToggleMockData,
}: AdminPanelProps) => {
  const [selectedUserCode, setSelectedUserCode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'normal' | 'cartoon'>('normal')

  const handleRemoveUser = (code: string) => {
    const newUsers = { ...users }
    delete newUsers[code]
    // In a real app, this would make an API call to remove the user
  }

  const handleStartGame = () => {
    if (Object.keys(users).length < 2) {
      alert('You need at least 2 participants to start the game')
      return
    }

    onStartGame(users)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'normal' ? 'cartoon' : 'normal')
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <svg
            className="h-8 w-8 text-blue-400 mr-2"
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
          <h2 className="text-2xl font-bold">Game Admin Panel</h2>
        </div>

        <div className="flex space-x-4">
          {onToggleMockData && (
            <button
              onClick={onToggleMockData}
              className={`${useMockData ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-600 hover:bg-gray-700'} text-white font-bold py-2 px-4 rounded-lg transition flex items-center`}
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
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
              {useMockData ? 'Using Mock Data' : 'Use Mock Data'}
            </button>
          )}

          <button
            onClick={onAddProfile}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition flex items-center"
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="16" y1="11" x2="22" y2="11"></line>
            </svg>
            Add Participant
          </button>

          <button
            onClick={handleStartGame}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg transition flex items-center"
            disabled={Object.keys(users).length < 2}
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
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start Game
          </button>
        </div>
      </div>

      <div className="bg-slate-900/70 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">How to Play</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-300">
          <li>Add participants by clicking "Add Participant"</li>
          <li>Each participant fills out their profile with personal facts</li>
          <li>When everyone has joined, click "Start Game"</li>
          <li>Players will take turns guessing who matches each profile</li>
        </ol>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Participants ({Object.keys(users).length})</h3>

        {Object.keys(users).length === 0 ? (
          <div className="text-center py-8 bg-slate-900/50 rounded-lg">
            <p className="text-gray-400">No participants yet. Add some to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(users).map(([code, user]) => (
              <div
                key={code}
                className={`bg-slate-900/70 rounded-lg overflow-hidden cursor-pointer transition ${
                  selectedUserCode === code ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedUserCode(code === selectedUserCode ? null : code)}
              >
                <div className="h-40 overflow-hidden">
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{user.name}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveUser(code)
                      }}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm">Code: {code}</p>

                  {selectedUserCode === code && (
                    <div className="mt-3 pt-3 border-t border-gray-700 text-sm space-y-1">
                      <p>
                        <span className="text-blue-400">Personality:</span> {user.personalityType}
                      </p>
                      <p>
                        <span className="text-blue-400">Eyes:</span> {user.eyeColor}
                      </p>
                      <p>
                        <span className="text-blue-400">Character:</span> {user.cartoonCharacter}
                      </p>
                      <p>
                        <span className="text-blue-400">Song:</span> {user.guiltyPleasureSong}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
