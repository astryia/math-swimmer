import type { Question, Settings } from '@/types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateQuestion(settings: Settings): Question {
  const ops = settings.operations.length > 0 ? settings.operations : ['+']
  const op = pickRandom(ops)
  const max = Math.max(settings.maxAnswer, 2)

  let a: number, b: number, answer: number, text: string

  switch (op) {
    case '+': {
      answer = Math.floor(Math.random() * (max - 1)) + 1
      a = Math.floor(Math.random() * answer)
      b = answer - a
      text = `${a} + ${b}`
      break
    }
    case '-': {
      answer = Math.floor(Math.random() * (max - 1)) + 1
      b = Math.floor(Math.random() * answer)
      a = answer + b
      text = `${a} − ${b}`
      break
    }
    case '*': {
      const maxFactor = Math.floor(Math.sqrt(max))
      a = Math.floor(Math.random() * (maxFactor - 1)) + 2
      b = Math.floor(Math.random() * Math.floor(max / a)) + 1
      answer = a * b
      text = `${a} × ${b}`
      break
    }
    case '/': {
      const divisor = Math.floor(Math.random() * 8) + 2
      answer = Math.floor(Math.random() * Math.floor(max / divisor)) + 1
      a = answer * divisor
      text = `${a} ÷ ${divisor}`
      break
    }
    default: {
      answer = 1
      text = '1 + 0'
    }
  }

  return { text, answer }
}

export function isAnswerCorrect(question: Question, input: string): boolean {
  const n = parseInt(input, 10)
  return !isNaN(n) && n === question.answer
}

// Keep generateQuestion pure and exportable for future testing
export { shuffle }
