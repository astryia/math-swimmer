import { useSettings } from '@/contexts/SettingsContext'
import { useGame } from '@/contexts/GameContext'
import type { Operation } from '@/types'
import './SettingsScreen.css'

const ALL_OPS: { op: Operation; label: string }[] = [
  { op: '+', label: '+  Add' },
  { op: '-', label: '−  Subtract' },
  { op: '*', label: '×  Multiply' },
  { op: '/', label: '÷  Divide' },
]

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings()
  const { dispatch } = useGame()

  function toggleOp(op: Operation) {
    const current = settings.operations
    if (current.includes(op)) {
      if (current.length === 1) return // keep at least one
      updateSettings({ operations: current.filter(o => o !== op) })
    } else {
      updateSettings({ operations: [...current, op] })
    }
  }

  return (
    <div className="settings-screen">
    <div className="settings-inner">
      <div className="settings-header">
        <button
          className="settings-back"
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'home' })}
          aria-label="Back to home"
        >
          ← Back
        </button>
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-body">
        <section className="settings-section">
          <label className="settings-label">
            Max Answer
            <span className="settings-value">{settings.maxAnswer}</span>
          </label>
          <input
            type="range"
            className="settings-slider"
            min={5}
            max={200}
            step={5}
            value={settings.maxAnswer}
            onChange={e => updateSettings({ maxAnswer: Number(e.target.value) })}
          />
          <div className="settings-range-hints">
            <span>5</span>
            <span>200</span>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-label">Operations</div>
          <div className="settings-ops">
            {ALL_OPS.map(({ op, label }) => {
              const active = settings.operations.includes(op)
              return (
                <button
                  key={op}
                  className={`settings-op-btn ${active ? 'active' : ''}`}
                  onClick={() => toggleOp(op)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
    </div>
  )
}
