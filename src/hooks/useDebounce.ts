import { useEffect, useState } from "react"

export default function useDebounce<T>(value: T, delay: number): T {
  //State and setters for debounce value
  const [debounceValue, setDebounceValue] = useState<T>(value)

  useEffect(() => {
    //Update debounce value after delay
    const handler = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    //Cancel the timeout if the value changes (also on delay change or unmount)
    //This is how we prevent debounce value from updating if value is changed
    //...within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debounceValue
}
