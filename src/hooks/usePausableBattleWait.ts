import { useCallback, useLayoutEffect, useRef } from "react";

export function usePausableBattleWait(paused: boolean) {
  const pausedRef = useRef(paused);

  useLayoutEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  return useCallback(async (milliseconds: number) => {
    let remaining = milliseconds;
    let previous = performance.now();
    while (remaining > 0) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, Math.min(50, remaining)));
      const now = performance.now();
      if (!pausedRef.current) remaining -= now - previous;
      previous = now;
    }
  }, []);
}
