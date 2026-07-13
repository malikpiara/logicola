import { Set } from '../types';

/**
 * Set H — Quantificational Translations. Empty skeleton awaiting
 * Phase 3 (T3.2) build: 93 templates from the 2008 source make this
 * the **largest content opportunity in the catalog**. See
 * the Set H fidelity audit for the full template inventory and the
 * recommended subset split (basic / identity / relational).
 *
 * T1.7 (Phase 1 scaffolding fix): canonicalized `slugs`, `header`,
 * `id`, `title`, and subset metadata so the route, navigation, and
 * page metadata don't misadvertise this set as "informal/definitions
 * — what is wrong with this definition?" (the original copy-paste
 * from setQ.ts). Set H is not yet routable from the catalog;
 * fixing the shape ahead of time means T3.2 can populate
 * `subSets[0].questions` without touching any other field.
 */
const setH: Set = {
  name: 'Set H',
  logicType: 'Quantificational',
  slugs: ['quantificational', 'translations'],
  id: 8,
  title: 'Quantificational Translations',
  header: 'Translates into logic as:',
  subSets: [
    {
      name: 'Set H',
      logicType: 'Quantificational',
      slugs: ['quantificational', 'translations', 'basic'],
      id: 8,
      title: 'Quantificational Translations: Easy',
      header: 'Translates into logic as:',
      isNew: true,
      questions: [],
    },
  ],
};

export { setH };
