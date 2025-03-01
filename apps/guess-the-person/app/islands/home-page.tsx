import { getApiClient } from '../api-client'
import { GameLobby } from './game-lobby'

export function HomePage() {
  const handleCreateGame = async (gameName: string) => {
    const apiClient = getApiClient()

    const result = await apiClient.api['create-game'].$post({
      json: {
        name: gameName,
      },
    })

    const jsonResult = await result.json()
    if (result.status === 200) {
      console.log('Game created with code:', jsonResult.gameCode)
      window.location.href = `/game/${jsonResult.gameCode}`
    } else {
      console.error('Error creating game:', jsonResult.message)
    }
  }

  const handleJoinGame = (code: string) => {
    console.log('Join game', code)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8"></div>
      <GameLobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
    </div>
  )
}
