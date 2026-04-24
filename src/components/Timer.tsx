import { formatTime } from '@/game/medals'
import './Timer.css'

interface Props {
  elapsedMs: number
}

export default function Timer({ elapsedMs }: Props) {
  return (
    <div className="timer">
      {formatTime(elapsedMs)}
    </div>
  )
}
