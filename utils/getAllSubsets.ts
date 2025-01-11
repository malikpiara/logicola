import { Set, SubSet } from '@/content/types';

export const getAllSubSets = (allSets: Set[]): SubSet[] => {
  return allSets.flatMap((set) => set.subSets);
};
