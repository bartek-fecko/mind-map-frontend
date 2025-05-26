/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';

export function useThrottle(fn: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);

  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      fn(...args);
    }
  };
}
