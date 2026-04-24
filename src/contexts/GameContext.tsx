import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react'
import type { GameState, SwimStyle, Distance, Question } from '@/types'
import {
  SWIM_SPEED_START,
  SWIM_SPEED_STEP_UP,
  SWIM_SPEED_STEP_DOWN,
  clampSpeed,
} from '@/game/speedMechanics'

const initialState: GameState = {
  screen: 'home',
  style: 'rocket',
  distance: 25,
  segmentsCompleted: 0,
  elapsedMs: 0,
  correctCount: 0,
  wrongCount: 0,
  currentQuestion: null,
  pendingAnswer: '',
  swimSpeed: SWIM_SPEED_START,
  finished: false,
  phase: 'countdown',
  countdownValue: 3,
}

type Action =
  | { type: 'NAVIGATE'; screen: GameState['screen'] }
  | { type: 'SELECT_STYLE'; style: SwimStyle }
  | { type: 'SELECT_DISTANCE'; distance: Distance }
  | { type: 'START_GAME' }
  | { type: 'COUNTDOWN_TICK' }
  | { type: 'RACE_START' }
  | { type: 'SET_QUESTION'; question: Question }
  | { type: 'APPEND_DIGIT'; digit: string }
  | { type: 'BACKSPACE' }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'TICK'; deltaMs: number }
  | { type: 'FINISH' }
  | { type: 'PLAY_AGAIN' }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen }

    case 'SELECT_STYLE':
      return { ...state, style: action.style }

    case 'SELECT_DISTANCE':
      return { ...state, distance: action.distance }

    case 'START_GAME':
      return {
        ...state,
        screen: 'game',
        segmentsCompleted: 0,
        elapsedMs: 0,
        correctCount: 0,
        wrongCount: 0,
        currentQuestion: null,
        pendingAnswer: '',
        swimSpeed: SWIM_SPEED_START,
        finished: false,
        phase: 'countdown',
        countdownValue: 3,
      }

    case 'COUNTDOWN_TICK':
      if (state.countdownValue <= 1) {
        return { ...state, phase: 'racing', countdownValue: 0 }
      }
      return { ...state, countdownValue: state.countdownValue - 1 }

    case 'RACE_START':
      return { ...state, phase: 'racing' }

    case 'SET_QUESTION':
      return { ...state, currentQuestion: action.question, pendingAnswer: '' }

    case 'APPEND_DIGIT': {
      if (state.pendingAnswer.length >= 4) return state
      if (state.pendingAnswer === '0') return { ...state, pendingAnswer: action.digit }
      return { ...state, pendingAnswer: state.pendingAnswer + action.digit }
    }

    case 'BACKSPACE':
      return { ...state, pendingAnswer: state.pendingAnswer.slice(0, -1) }

    case 'SUBMIT_ANSWER': {
      if (!state.currentQuestion || !state.pendingAnswer) return state
      const given = parseInt(state.pendingAnswer, 10)
      const correct = given === state.currentQuestion.answer

      if (correct) {
        const newSegments = state.segmentsCompleted + 1
        const finished = newSegments >= state.distance
        return {
          ...state,
          correctCount: state.correctCount + 1,
          segmentsCompleted: newSegments,
          // Speed up: decrease duration, capped at SWIM_SPEED_MAX
          swimSpeed: clampSpeed(state.swimSpeed - SWIM_SPEED_STEP_UP),
          pendingAnswer: '',
          finished,
          screen: finished ? 'results' : 'game',
          phase: finished ? 'done' : state.phase,
        }
      } else {
        return {
          ...state,
          wrongCount: state.wrongCount + 1,
          // Slow down: increase duration, floored at SWIM_SPEED_MIN
          swimSpeed: clampSpeed(state.swimSpeed + SWIM_SPEED_STEP_DOWN),
          pendingAnswer: '',
        }
      }
    }

    case 'TICK':
      if (state.phase !== 'racing') return state
      return { ...state, elapsedMs: state.elapsedMs + action.deltaMs }

    case 'FINISH':
      return { ...state, finished: true, phase: 'done', screen: 'results' }

    case 'PLAY_AGAIN':
      return {
        ...state,
        screen: 'game',
        segmentsCompleted: 0,
        elapsedMs: 0,
        correctCount: 0,
        wrongCount: 0,
        currentQuestion: null,
        pendingAnswer: '',
        swimSpeed: SWIM_SPEED_START,
        finished: false,
        phase: 'countdown',
        countdownValue: 3,
      }

    default:
      return state
  }
}

interface GameContextValue {
  state: GameState
  dispatch: Dispatch<Action>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
