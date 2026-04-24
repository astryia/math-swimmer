export type Screen = 'home' | 'settings' | 'game' | 'results'

export type Operation = '+' | '-' | '*' | '/'

export type Distance = 25 | 50 | 100 | 200

export type SwimStyle = 'rocket' | 'dolphin' | 'submarine' | 'crab'

export type MedalTier = 'gold' | 'silver' | 'bronze'

export interface Question {
  text: string
  answer: number
}

export interface Settings {
  maxAnswer: number
  operations: Operation[]
}

export interface GameState {
  screen: Screen
  style: SwimStyle
  distance: Distance
  segmentsCompleted: number
  elapsedMs: number
  correctCount: number
  wrongCount: number
  currentQuestion: Question | null
  pendingAnswer: string
  swimSpeed: number   // animation cycle duration in seconds — lower = faster
  finished: boolean
  phase: 'countdown' | 'racing' | 'done'
  countdownValue: number
}

export interface GameResult {
  style: SwimStyle
  distance: Distance
  elapsedMs: number
  correctCount: number
  wrongCount: number
  medal: MedalTier
}
