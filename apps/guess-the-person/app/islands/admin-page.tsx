import { AdminPanel } from './admin-panel'

export function AdminPage({ gameCode }: { gameCode: string }) {
  const users = {} // replace with actual users retrieval
  const handleStartGame = () => {} // provide actual implementation
  const setGameState = (state: string) => {} // provide actual implementation
  const useMockData = false // replace based on actual state
  const toggleMockData = () => {} // provide actual implementation

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8"></div>
      <AdminPanel
        gameCode={gameCode}
        users={users}
        onStartGame={handleStartGame}
        onAddProfile={() => setGameState('profile')}
        useMockData={useMockData}
        onToggleMockData={toggleMockData}
      />
    </div>
  )
}
