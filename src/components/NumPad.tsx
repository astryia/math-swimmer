import './NumPad.css'

interface Props {
  onDigit: (d: string) => void
  onBackspace: () => void
  onSubmit: () => void
  disabled?: boolean
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', '✓'],
]

export default function NumPad({ onDigit, onBackspace, onSubmit, disabled }: Props) {
  function handleKey(key: string) {
    if (disabled) return
    if (key === '⌫') onBackspace()
    else if (key === '✓') onSubmit()
    else onDigit(key)
  }

  return (
    <div className="numpad">
      {ROWS.map((row, ri) => (
        <div key={ri} className="numpad-row">
          {row.map(key => (
            <button
              key={key}
              className={`numpad-key ${key === '✓' ? 'key-submit' : ''} ${key === '⌫' ? 'key-back' : ''}`}
              onClick={() => handleKey(key)}
              disabled={disabled}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
