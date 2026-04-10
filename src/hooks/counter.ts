import { useState } from 'react'

export const useCounter = (initialValue: number = 1) => {
  const [counter, setCounter] = useState(initialValue)

  const onInc = () => {
    setCounter((prev) => prev + 1)
  }

  const onDec = () => {
    setCounter((prev) => prev - 1)
  }

  const onReset = () => {
    setCounter(initialValue)
  }

  return {
    counter,
    onInc,
    onDec,
    onReset,
  }
}
