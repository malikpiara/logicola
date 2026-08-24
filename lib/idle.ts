/**
 * Idle scheduling with a flush guarantee (2026-08-24). Two sites defer
 * work off the render-settle path — the pageview capture and the
 * lastDrill write — and both were first written as bare
 * requestIdleCallback + cancel-on-cleanup, which DROPPED the work
 * whenever the effect tore down inside the idle window (a fast
 * navigation, a quiz remount). This helper owns the ladder once:
 * requestIdleCallback where it exists, setTimeout where it doesn't,
 * and `flush()` runs the task immediately if it hasn't run yet —
 * effect cleanups call flush, never a bare cancel, so deferral can
 * delay the work but never lose it.
 */
export interface IdleTask {
  /** Run the task now if it hasn't run yet. Idempotent. */
  flush(): void;
  /**
   * Unschedule the pending run. The task stays flushable — cancel is
   * for supersession (a newer schedule carries fresher data), and the
   * superseder may still need to flush THIS task's closure on unmount,
   * where cleanup order between effects is not worth betting on.
   */
  cancel(): void;
}

export function runWhenIdle(
  task: () => void,
  { timeout = 1000, fallbackMs = 200 }: { timeout?: number; fallbackMs?: number } = {}
): IdleTask {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    task();
  };

  let cancelPending: () => void;
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(run, { timeout });
    cancelPending = () => cancelIdleCallback(id);
  } else {
    const id = setTimeout(run, fallbackMs);
    cancelPending = () => clearTimeout(id);
  }

  return {
    flush() {
      cancelPending();
      run();
    },
    cancel() {
      cancelPending();
    },
  };
}
