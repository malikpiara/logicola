import type { QuizPatternKind } from '@/lib/patterns';

/**
 * The set presets the colour studio and the pattern gallery both offer.
 * A leaf module (React pass, 2026-09-08): the gallery used to import
 * these from colourStudio.tsx, which would have dragged the studio —
 * popover, mixers, the stimulation model — into the gallery's chunk
 * once the islands split. Data only; the studio's own comment follows.
 */
// `subject` names the set for the chips' tooltips (2026-09-02): the
// set-palettes island that used to spell the names out was cut as a
// duplicate of this studio, so the names ride on the letters here.
export const PRESETS = [
  {
    key: 'A',
    subject: 'Syllogistic',
    surface: '#FFABC6',
    ink: '#4A1040',
    accent: '#674900',
  },
  {
    key: 'C',
    subject: 'Propositional',
    surface: '#E7F099',
    ink: '#02302C',
    accent: '#BD00AD',
  },
  {
    key: 'J',
    subject: 'Modal',
    surface: '#E6ACF4',
    ink: '#1C3601',
    accent: '#674900',
  },
  {
    key: 'L',
    subject: 'Deontic',
    surface: '#CFF6DD',
    ink: '#3F0167',
    accent: '#BD00AD',
  },
  {
    key: 'N',
    subject: 'Belief',
    surface: '#9EDAFF',
    ink: '#4A1040',
    accent: '#8D0381',
  },
  {
    key: 'Q',
    subject: 'Definitions',
    surface: '#D9CCF9',
    ink: '#3E1060',
    accent: '#745400',
  },
  {
    key: 'R',
    subject: 'Fallacies',
    surface: '#E4BDF7',
    ink: '#751100',
    accent: '#824616',
  },
] as const;

export type Preset = (typeof PRESETS)[number];

export const PATTERNS: { key: QuizPatternKind; label: string }[] = [
  { key: 'camo', label: 'Camo' },
  { key: 'camo-giant', label: 'Camo · giant' },
  { key: 'quilt', label: 'Quilt' },
];
