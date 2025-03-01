import { Leaderboard as LeaderboardType } from './types'

interface LeaderboardProps {
  leaderboard: LeaderboardType
}

export const Leaderboard = ({ leaderboard }: LeaderboardProps) => {
  // Convert leaderboard object to array for sorting
  const scores = Object.values(leaderboard).sort((a, b) => b.points - a.points)

  // Calculate ranks (handling ties)
  let currentRank = 1
  let previousScore = -1
  let rankedScores = scores.map((score, index) => {
    if (index > 0 && score.points < previousScore) {
      currentRank = index + 1
    }
    previousScore = score.points
    return { ...score, rank: currentRank }
  })

  // Get medal color based on rank
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400' // Gold
      case 2:
        return 'text-gray-400' // Silver
      case 3:
        return 'text-amber-700' // Bronze
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-6">
      <div className="flex items-center mb-6">
        <svg
          className="h-8 w-8 text-yellow-400 mr-2"
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
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      {scores.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/50 rounded-lg">
          <p className="text-gray-400">No scores yet. Start playing to see the leaderboard!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/70">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>Points</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                    <span>Correct</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Avg. Time</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>Hints Used</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {rankedScores.map((score, index) => (
                <tr key={score.userCode} className={index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {score.rank <= 3 ? (
                        <svg
                          className={`h-5 w-5 mr-1 ${getMedalColor(score.rank)}`}
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
                      ) : (
                        <span className="w-5 text-center mr-1">{score.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{score.userName}</td>
                  <td className="px-4 py-3 text-center font-bold text-yellow-400">{score.points}</td>
                  <td className="px-4 py-3 text-center">
                    {score.correctGuesses}/{score.totalGuesses}
                  </td>
                  <td className="px-4 py-3 text-center">{score.averageTime.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center">{score.hintsUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 bg-slate-900/70 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Scoring System</h3>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Base points: 100 points per correct guess</li>
          <li>• Speed bonus: Up to 50 points based on how quickly you guess</li>
          <li>• Hint penalty: -10 points for each hint used</li>
        </ul>
      </div>
    </div>
  )
}
