import './QuestionCard.css'

interface Props {
  questionText: string
  pendingAnswer: string
  feedback: 'correct' | 'wrong' | null
}

export default function QuestionCard({ questionText, pendingAnswer, feedback }: Props) {
  return (
    <div className={`question-card ${feedback ? `feedback-${feedback}` : ''}`}>
      <div className="question-text">
        {questionText} <span className="question-eq">=</span>
      </div>
      <div className="answer-display">
        <span className="answer-value">{pendingAnswer || <span className="answer-placeholder">?</span>}</span>
        <span className="answer-cursor" />
      </div>
    </div>
  )
}
