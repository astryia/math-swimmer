import { useEffect, useRef } from 'react'
import './Swimmer.css'
import freestyleSheet from '@/assets/freestyle-sheet.png'

const FRAME_COUNT = 77
// Each sprite frame is 280×360px — height/width ratio
const FRAME_H_OVER_W = 360 / 280

interface Props {
  animationDuration: number // seconds for one full cycle through all frames
}

export default function Swimmer({ animationDuration }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const durationRef = useRef(animationDuration)
  const frameRef = useRef(0)
  const lastFrameTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  // Keep duration ref in sync without restarting the animation loop
  useEffect(() => {
    durationRef.current = animationDuration
  }, [animationDuration])

  useEffect(() => {
    const viewport = viewportRef.current
    const img = imgRef.current
    if (!viewport || !img) return

    function tick(now: number) {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = now

      const frameDurationMs = (durationRef.current * 1000) / FRAME_COUNT
      const elapsed = now - lastFrameTimeRef.current

      if (elapsed >= frameDurationMs) {
        const framesAdv = Math.floor(elapsed / frameDurationMs)
        frameRef.current = (frameRef.current + framesAdv) % FRAME_COUNT
        lastFrameTimeRef.current = now - (elapsed % frameDurationMs)

        // Scale by HEIGHT so exactly one frame fills the viewport top-to-bottom.
        // frame width = frameHeight / aspect_ratio — wider than the viewport on
        // tall screens, so the pool is centered and the sides are naturally cropped.
        const frameHeight = viewport!.offsetHeight
        const frameWidth  = Math.round(frameHeight / FRAME_H_OVER_W)
        img!.style.width = `${frameWidth}px`
        img!.style.left  = `${Math.round((viewport!.offsetWidth - frameWidth) / 2)}px`
        img!.style.transform = `translateY(${-frameRef.current * frameHeight}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastFrameTimeRef.current = null
    }
  }, [])

  return (
    <div ref={viewportRef} className="swimmer-viewport">
      <img
        ref={imgRef}
        src={freestyleSheet}
        className="swimmer-strip"
        alt=""
        draggable={false}
      />
    </div>
  )
}
