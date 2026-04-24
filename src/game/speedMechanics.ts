// swimSpeed = animation cycle duration in seconds.
// Lower value → faster swimmer.  Higher value → slower swimmer.

/** Starting speed — 2× slower than the mid-point (3.0s cycle) */
export const SWIM_SPEED_START = 3.0

/** How much a correct answer speeds up the swimmer (decreases duration) */
export const SWIM_SPEED_STEP_UP = 0.35

/** How much a wrong answer slows the swimmer (increases duration) */
export const SWIM_SPEED_STEP_DOWN = 0.4

/** Fastest the swimmer can go — requires ~7 consecutive correct answers */
export const SWIM_SPEED_MAX = 0.55

/** Slowest the swimmer goes — floor after repeated wrong answers */
export const SWIM_SPEED_MIN = 4.0

/** Clamp swimSpeed to [MAX, MIN] (note: MAX < MIN since lower = faster) */
export function clampSpeed(s: number): number {
  return Math.min(SWIM_SPEED_MIN, Math.max(SWIM_SPEED_MAX, s))
}

/** Visual feedback durations (independent of speed — just the flash/shake) */
export const CORRECT_FEEDBACK_MS = 400
export const WRONG_FEEDBACK_MS   = 500
