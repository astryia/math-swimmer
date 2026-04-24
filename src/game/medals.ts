import type { Distance, MedalTier } from '@/types'

// Thresholds based on ~3.6s per question average for gold
// Gold: distance × 3.6s, Silver: distance × 5.4s, Bronze: finished
export function computeMedal(distance: Distance, elapsedMs: number): MedalTier {
  const goldMs = distance * 3600
  const silverMs = distance * 5400

  if (elapsedMs <= goldMs) return 'gold'
  if (elapsedMs <= silverMs) return 'silver'
  return 'bronze'
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
