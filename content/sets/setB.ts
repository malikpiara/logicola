import { Set } from '../types';

/**
 * Set B — Syllogistic Arguments. Empty skeleton awaiting Phase 3
 * (T3.1) build: 37 argument templates from the 2008 source need to
 * be authored as MCQ "is this argument valid / which conclusion
 * follows?" questions. See notes/audits/setB.md for the full
 * specification and template inventory.
 *
 * T1.7 (Phase 1 scaffolding fix): canonicalized `slugs`, `header`,
 * `id`, `title`, and subset metadata so the route, navigation, and
 * page metadata don't misadvertise this set as "informal/definitions
 * — what is wrong with this definition?" (the original copy-paste
 * from setQ.ts). Set B is not yet routable from the catalog;
 * fixing the shape ahead of time means T3.1 can populate
 * `subSets[0].questions` without touching any other field.
 */
const setB: Set = {
  name: 'Set B',
  logicType: 'Syllogistic',
  slugs: ['syllogistic', 'arguments'],
  id: 2,
  title: 'Syllogistic Arguments',
  header: 'What follows from these premises?',
  subSets: [
    {
      name: 'Set B',
      logicType: 'Syllogistic',
      slugs: ['syllogistic', 'arguments', 'basic'],
      id: 2,
      title: 'Syllogistic Arguments',
      header: 'What follows from these premises?',
      isNew: true,
      questions: [],
    },
  ],
};

export { setB };
