import type { MedalTier } from '@/types'
import './MedalDisplay.css'

const MEDAL_CONFIG: Record<MedalTier, { emoji: string; label: string; color: string }> = {
  gold:   { emoji: '🥇', label: 'Gold!',   color: 'var(--color-gold)' },
  silver: { emoji: '🥈', label: 'Silver!', color: 'var(--color-silver)' },
  bronze: { emoji: '🥉', label: 'Bronze!', color: 'var(--color-bronze)' },
}

interface Props {
  medal: MedalTier
}

export default function MedalDisplay({ medal }: Props) {
  const cfg = MEDAL_CONFIG[medal]
  return (
    <div className="medal-display" style={{ '--medal-color': cfg.color } as React.CSSProperties}>
      <div className="medal-emoji">{cfg.emoji}</div>
      <div className="medal-label">{cfg.label}</div>
    </div>
  )
}
