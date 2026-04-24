import './ProgressBar.css'

interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
      <span className="progress-label">{current}/{total}</span>
    </div>
  )
}
