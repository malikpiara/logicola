// The propositional logic translations were likely generated programatically by Gensler.
// TODO: Create a program that generates easy translations, four options and the solution.
// TODO: Create a program that gives hints based on the mistaken option (There's always a pattern!)

export interface Option {
  id: number;
  label: string;
  hint?: string; // Gensler hints
  /**
   * Short typeable code for this option (Set R's fallacy abbreviations,
   * e.g. 'ah'). When present it replaces the numeric badge and the digit
   * keyboard shortcut: typing the code selects the option.
   */
  abbreviation?: string;
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
  shuffleOptions?: boolean;
  /**
   * One-sentence description of what this drill practices, shown on the
   * start screen instead of the generic tagline.
   */
  description?: string;
  /**
   * How to lay out answer options. 'list' (default) is the classic
   * full-width vertical stack; 'grid' is a compact multi-column grid for
   * sets with many options (Set R shows all 18 fallacies per question).
   */
  optionLayout?: 'list' | 'grid';
  /**
   * Reveal the solution after this many wrong guesses. Defaults to the
   * classic behavior (all options but one exhausted) — which is far too
   * punishing for large option counts like Set R's 18.
   */
  maxWrongGuesses?: number;
  /**
   * Let the user select several options and submit them together (Set R,
   * where a passage can commit more than one fallacy). Graded by the
   * subset rule: correct when every selected option is one of
   * `correctId` and at least one is picked. Defaults to single-select.
   */
  multiSelect?: boolean;
}
