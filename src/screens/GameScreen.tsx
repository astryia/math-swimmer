import { useEffect, useRef, useCallback, useState } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useGameLoop } from '@/hooks/useGameLoop'
import { generateQuestion } from '@/game/questionGenerator'
import { CORRECT_FEEDBACK_MS, WRONG_FEEDBACK_MS } from '@/game/speedMechanics'
import Swimmer from '@/components/Swimmer'
import ProgressBar from '@/components/ProgressBar'
import Timer from '@/components/Timer'
import QuestionCard from '@/components/QuestionCard'
import NumPad from '@/components/NumPad'
import './GameScreen.css'

export default function GameScreen() {
  const { state, dispatch } = useGame()
  const { settings } = useSettings()
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isWaitingFeedback = useRef(false)

  // Generate first question when racing starts
  useEffect(() => {
    if (state.phase === 'racing' && !state.currentQuestion) {
      dispatch({ type: 'SET_QUESTION', question: generateQuestion(settings) })
    }
  }, [state.phase, state.currentQuestion, settings, dispatch])

  // Countdown logic
  useEffect(() => {
    if (state.phase !== 'countdown') return
    countdownTimerRef.current = setTimeout(() => {
      dispatch({ type: 'COUNTDOWN_TICK' })
    }, 1000)
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current)
    }
  }, [state.phase, state.countdownValue, dispatch])

  // Timer tick
  const onTick = useCallback((deltaMs: number) => {
    dispatch({ type: 'TICK', deltaMs })
  }, [dispatch])

  useGameLoop(state.phase === 'racing' && !state.finished, onTick)

  function handleDigit(d: string) {
    if (isWaitingFeedback.current) return
    dispatch({ type: 'APPEND_DIGIT', digit: d })
  }

  function handleBackspace() {
    if (isWaitingFeedback.current) return
    dispatch({ type: 'BACKSPACE' })
  }

  function handleSubmit() {
    if (isWaitingFeedback.current || !state.pendingAnswer || !state.currentQuestion) return

    const given = parseInt(state.pendingAnswer, 10)
    const correct = given === state.currentQuestion.answer

    setFeedback(correct ? 'correct' : 'wrong')
    isWaitingFeedback.current = true

    dispatch({ type: 'SUBMIT_ANSWER' })

    // Show feedback briefly, then load next question
    const delay = correct ? CORRECT_FEEDBACK_MS : WRONG_FEEDBACK_MS
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null)
      isWaitingFeedback.current = false
      if (!state.finished) {
        dispatch({ type: 'SET_QUESTION', question: generateQuestion(settings) })
      }
    }, delay)
  }

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key)
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === 'Enter') handleSubmit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current)
    }
  }, [])

  return (
    <div className="game-screen">
      <div className="game-topbar">
        <ProgressBar current={state.segmentsCompleted} total={state.distance} />
        <Timer elapsedMs={state.elapsedMs} />
      </div>

      <div className="game-pool">
        {/* swimSpeed is the animation cycle duration: lower = faster swimmer */}
        <Swimmer animationDuration={state.swimSpeed} />

        {state.phase === 'countdown' && (
          <div className="countdown-overlay">
            <span className="countdown-number">
              {state.countdownValue > 0 ? state.countdownValue : 'GO!'}
            </span>
          </div>
        )}
      </div>

      <div className="game-bottom">
        {state.currentQuestion && (
          <QuestionCard
            questionText={state.currentQuestion.text}
            pendingAnswer={state.pendingAnswer}
            feedback={feedback}
          />
        )}
        <NumPad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          onSubmit={handleSubmit}
          disabled={state.phase !== 'racing' || isWaitingFeedback.current}
        />
      </div>
    </div>
  )
}
