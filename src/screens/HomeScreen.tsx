import { useGame } from '@/contexts/GameContext'
import type { Distance, SwimStyle } from '@/types'
import './HomeScreen.css'

const STYLES: { id: SwimStyle; label: string; available: boolean }[] = [
  { id: 'rocket',    label: 'Freestyle',   available: true  },
  { id: 'dolphin',   label: 'Butterfly',   available: false },
  { id: 'submarine', label: 'Breaststroke',available: false },
  { id: 'crab',      label: 'Backstroke',  available: false },
]

const DISTANCES: Distance[] = [25, 50, 100, 200]

export default function HomeScreen() {
  const { state, dispatch } = useGame()

  return (
    <div className="home">
      {/* Pool image hero */}
      <div className="home-hero" />

      {/* Content sits in the gradient zone at the bottom */}
      <div className="home-content">
        <h1 className="home-title">
          <span className="home-title-math">MATH</span>
          <span className="home-title-swimmer">SWIMMER</span>
        </h1>

        {/* Style selector — horizontal strip, no boxes */}
        <div className="style-strip">
          {STYLES.map(s => (
            <button
              key={s.id}
              className={`style-item ${state.style === s.id ? 'selected' : ''} ${!s.available ? 'locked' : ''}`}
              onClick={() => s.available && dispatch({ type: 'SELECT_STYLE', style: s.id })}
              disabled={!s.available}
            >
              <span className="style-item-label">
                {s.available ? s.label : 'Soon'}
              </span>
              {state.style === s.id && <span className="style-item-dot" />}
            </button>
          ))}
        </div>

        {/* Distance selector */}
        <div className="dist-strip">
          {DISTANCES.map(d => (
            <button
              key={d}
              className={`dist-item ${state.distance === d ? 'selected' : ''}`}
              onClick={() => dispatch({ type: 'SELECT_DISTANCE', distance: d })}
            >
              {d}<span className="dist-unit">m</span>
            </button>
          ))}
        </div>

        <button
          className="start-btn"
          onClick={() => dispatch({ type: 'START_GAME' })}
        >
          Start Race
        </button>

        <button
          className="settings-link"
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'settings' })}
        >
          Settings
        </button>
      </div>
    </div>
  )
}
