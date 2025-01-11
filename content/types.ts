// The propositional logic translations were likely generated programatically by Gensler.
// TODO: Create a program that generates easy translations, four options and the solution.
// TODO: Create a program that gives hints based on the mistaken option (There's always a pattern!)

export interface Option {
  id: number;
  label: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: Option[];
  correctId: number[];
  answer: string;
}

export interface Set {
  name: string; // The overall name of the set
  logicType: string; // The type of logic covered by the set
  slugs: string[]; // URL slugs for the set
  id: number; // Unique identifier for the set
  title: string; // Title of the set
  header: string; // Header text for the set
  subSets: SubSet[]; // Array of sub-sets within this set
}

export interface SubSet {
  name: string; // Name of the sub-set
  logicType: string; // The type of logic covered by the sub-set
  slugs: string[]; // URL slugs for the sub-set
  id: number; // Unique identifier for the sub-set
  title: string; // Title of the sub-set
  header: string; // Header text for the sub-set
  isNew?: boolean; // Indicates if this sub-set is new
  questions: Question[]; // Array of questions within this sub-set
}
