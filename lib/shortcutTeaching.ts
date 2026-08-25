/**
 * Progressive reduction for the options' shortcut tooltips (Saffer's
 * long loop, applied 2026-08-22): the tips are beginner scaffolding —
 * "Press 3", "Type aa" — and a teaching interface should retire its
 * scaffolding once the lesson lands. The moment the learner SELECTS an
 * option by key, this device has proven it knows, and the tips stop.
 * A new device is a fresh learner, so the tips return there — which is
 * the correct reading, not a bug.
 */
const KEY = 'lc-shortcuts-used';

export function markShortcutsUsed(): void {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Private mode etc. — the tip simply keeps teaching.
  }
}

export function shortcutsUsed(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}
