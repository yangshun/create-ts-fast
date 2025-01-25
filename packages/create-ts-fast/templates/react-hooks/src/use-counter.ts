import { useCallback, useState } from 'react';

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((x) => x + 1), []);

  return { count, increment };
}
