import { useEffect, useRef } from 'react'

export function useGameLoop(
  active: boolean,
  onTick: (deltaMs: number) => void,
) {
  const lastTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) {
      lastTimeRef.current = null
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    function tick(timestamp: number) {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp
      }
      const delta = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp
      onTick(Math.min(delta, 100))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTimeRef.current = null
    }
  }, [active, onTick])
}
