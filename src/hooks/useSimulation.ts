import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic hook that ticks every `intervalMs` and calls `updater` on the state.
 */
export function useSimulation<T>(initial: T, updater: (prev: T) => T, intervalMs = 3000) {
  const [state, setState] = useState(initial);
  const updaterRef = useRef(updater);
  updaterRef.current = updater;

  useEffect(() => {
    const id = setInterval(() => setState(prev => updaterRef.current(prev)), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return state;
}

/** Jitter a number by ±pct (e.g. 0.02 = 2%) */
export function jitter(value: number, pct: number): number {
  return parseFloat((value + (Math.random() - 0.5) * 2 * value * pct).toFixed(2));
}

/** Countdown a number, floored at 0, by `step` */
export function countdown(value: number, step = 1): number {
  return Math.max(0, value - step);
}

/** Advance elapsed toward duration by `step`, capped */
export function advanceElapsed(elapsed: number, duration: number, step = 1): number {
  return Math.min(duration, elapsed + step);
}
