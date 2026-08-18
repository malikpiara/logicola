// Haptic feedback for the installed app (Malik, 2026-08-18). One call,
// two mechanisms behind feature detection:
//
// - Android/Chrome: navigator.vibrate(). It drives the raw motor, not a
//   tuned taptic engine, so durations stay short — ~8ms reads as a
//   tick, anything past ~30ms as a cheap buzz. Patterns are dialled in
//   docs/haptics-lab.html; change them there first, then here.
// - iOS Safari/PWA: no Vibration API (WebKit has declined it). Since
//   Safari 17.4 a native <input type="checkbox" switch> fires a real
//   Taptic tick when toggled, including via a programmatic click inside
//   a user gesture — the "ios-haptics" trick. Only one flavour of tick
//   exists, so `success` doubles it and the rest collapse to one.
//   UNVERIFIED on a device as of 2026-08-18 (no iPhone at hand); the
//   failure mode is silence, which is acceptable.
//
// Desktop and older iOS no-op silently. Haptics stay deliberately rare —
// option select, Start Quiz, and the check verdict — texture on every
// keystroke is how users end up muting the whole app.

export type HapticKind = 'selection' | 'impact' | 'success' | 'error';

const VIBRATE_PATTERNS: Record<HapticKind, number | number[]> = {
  selection: 8,
  impact: 15,
  success: [10, 60, 10],
  error: [35, 40, 35],
};

// Lazily-created hidden switch for the iOS path. A label click toggles
// the input, and the toggle is what carries the haptic.
let iosSwitchLabel: HTMLLabelElement | null = null;

function iosTick() {
  if (!iosSwitchLabel) {
    iosSwitchLabel = document.createElement('label');
    // Visually hidden but NOT display:none — a fully removed element
    // may not toggle, and the haptic rides on the toggle.
    iosSwitchLabel.style.cssText =
      'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);pointer-events:none;';
    iosSwitchLabel.setAttribute('aria-hidden', 'true');
    const input = document.createElement('input');
    input.type = 'checkbox';
    // Not in the TS DOM types yet; the attribute is what makes Safari
    // render (and haptically confirm) a native switch.
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    iosSwitchLabel.appendChild(input);
    document.body.appendChild(iosSwitchLabel);
  }
  iosSwitchLabel.click();
}

/**
 * Fire a haptic if the platform has one. Must be called from inside a
 * user gesture handler (click/tap) — both mechanisms require activation.
 */
export function haptic(kind: HapticKind): void {
  if (typeof window === 'undefined') return;

  // A truthiness check, not `'vibrate' in navigator`: lib.dom types every
  // Navigator with vibrate, so the `in` guard narrows the else-branch to
  // `never` — at runtime iOS Safari genuinely lacks the method.
  if (typeof navigator.vibrate === 'function') {
    // Desktop Chrome also has vibrate() and simply has no motor — the
    // call is the no-op, no extra gating needed.
    navigator.vibrate(VIBRATE_PATTERNS[kind]);
    return;
  }

  // No Vibration API + a real touch screen ≈ iOS. The touch check keeps
  // desktop Safari/Firefox from pointlessly building the hidden switch.
  if (navigator.maxTouchPoints > 1) {
    try {
      iosTick();
      if (kind === 'success') setTimeout(iosTick, 120);
    } catch {
      // Silence is the designed failure mode.
    }
  }
}
