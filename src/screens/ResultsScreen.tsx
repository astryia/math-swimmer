import { useGame } from '@/contexts/GameContext'
import { computeMedal, formatTime } from '@/game/medals'
import MedalDisplay from '@/components/MedalDisplay'
import './ResultsScreen.css'

export default function ResultsScreen() {
  const { state, dispatch } = useGame()
  const medal = computeMedal(state.distance, state.elapsedMs)
  const total = state.distance
  const accuracy = total > 0 ? Math.round((state.correctCount / total) * 100) : 0

  return (
    <div className="results-screen">
      <div className="results-inner">
        <h1 className="results-title">Race Complete!</h1>

        <MedalDisplay medal={medal} />

        <div className="results-stats">
          <div className="stat-row">
            <span className="stat-label">Time</span>
            <span className="stat-value mono">{formatTime(state.elapsedMs)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Correct</span>
            <span className="stat-value correct">{state.correctCount}/{total}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Wrong</span>
            <span className="stat-value wrong">{state.wrongCount}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>

        <div className="results-actions">
          <button
            className="results-btn primary"
            onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
          >
            Play Again
          </button>
          <button
            className="results-btn secondary"
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  )
}
